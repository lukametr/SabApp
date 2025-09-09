import {
  mergeHazards,
  mergeHazardsAuthoritative,
  HazardLike,
} from './merge-hazards';

describe('mergeHazardsAuthoritative', () => {
  it('merges existing by id and applies risk defaults and photos preservation', () => {
    const current = [
      {
        id: 'h1',
        hazardIdentification: 'old',
        initialRisk: { probability: 5, severity: 5, total: 25 },
        residualRisk: { probability: 3, severity: 3, total: 9 },
        photos: ['data:image/png;base64,OLD'],
      },
    ];
    const incoming = [
      {
        id: 'h1',
        hazardIdentification: 'new',
        // missing risks should keep fields merged and defaulted
        photos: undefined,
      } as any,
      {
        hazardIdentification: 'added',
        // new item without risks must get defaults
      } as any,
    ];

    const merged = mergeHazardsAuthoritative(current as any, incoming as any);
    expect(merged).toHaveLength(2);
    const m0 = merged[0];
    expect(m0.id).toBe('h1');
    expect(m0.hazardIdentification).toBe('new');
    expect(m0.initialRisk).toEqual({ probability: 5, severity: 5, total: 25 });
    expect(m0.residualRisk).toEqual({ probability: 3, severity: 3, total: 9 });
    expect(m0.photos).toEqual(['data:image/png;base64,OLD']);

    const m1 = merged[1];
    expect(m1.hazardIdentification).toBe('added');
    expect(m1.initialRisk).toEqual({ probability: 0, severity: 0, total: 0 });
    expect(m1.residualRisk).toEqual({ probability: 0, severity: 0, total: 0 });
    expect(Array.isArray(m1.photos)).toBe(true);
  });
});

describe('mergeHazards', () => {
  it('preserves existing fields when incoming hazard omits them', () => {
    const current: HazardLike[] = [
      {
        id: 'h1',
        hazardIdentification: 'Old',
        affectedPersons: ['A'],
        injuryDescription: 'Old inj',
        existingControlMeasures: 'Old cm',
        initialRisk: { probability: 3, severity: 4, total: 12 },
        additionalControlMeasures: 'Old add',
        residualRisk: { probability: 2, severity: 2, total: 4 },
        requiredMeasures: 'Old req',
        responsiblePerson: 'Old resp',
        reviewDate: new Date('2024-01-01'),
        photos: ['data:image/png;base64,AAA'],
      },
    ];

    const incoming: HazardLike[] = [
      {
        id: 'h1',
        hazardIdentification: 'New Title',
        initialRisk: { probability: 5 },
      },
    ];

    const merged = mergeHazards(current, incoming);
    expect(merged).toHaveLength(1);
    const h = merged[0];
    expect(h.hazardIdentification).toBe('New Title');
    // Unspecified fields preserved
    expect(h.affectedPersons).toEqual(['A']);
    expect(h.injuryDescription).toBe('Old inj');
    expect(h.existingControlMeasures).toBe('Old cm');
    expect(h.additionalControlMeasures).toBe('Old add');
    expect(h.requiredMeasures).toBe('Old req');
    expect(h.responsiblePerson).toBe('Old resp');
    expect(h.photos).toEqual(['data:image/png;base64,AAA']);
    // Nested risk merged
    expect(h.initialRisk).toEqual({ probability: 5, severity: 4, total: 12 });
    expect(h.residualRisk).toEqual({ probability: 2, severity: 2, total: 4 });
  });

  it('adds new hazards when id not found', () => {
    const current: HazardLike[] = [];
    const incoming: HazardLike[] = [
      {
        id: 'new1',
        hazardIdentification: 'H New',
        initialRisk: { probability: 1, severity: 1, total: 1 },
        residualRisk: { probability: 1, severity: 1, total: 1 },
      },
    ];
    const merged = mergeHazards(current, incoming);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('new1');
  });

  it('keeps existing photos if incoming photos are not provided', () => {
    const current: HazardLike[] = [{ id: 'h1', photos: ['photoA'] }];
    const incoming: HazardLike[] = [{ id: 'h1' }];
    const merged = mergeHazards(current, incoming);
    expect(merged[0].photos).toEqual(['photoA']);
  });

  it('replaces photos if incoming photos array is provided', () => {
    const current: HazardLike[] = [{ id: 'h1', photos: ['photoA'] }];
    const incoming: HazardLike[] = [{ id: 'h1', photos: ['photoB'] }];
    const merged = mergeHazards(current, incoming);
    expect(merged[0].photos).toEqual(['photoB']);
  });

  describe('mergeHazardsAuthoritative', () => {
    it('does not duplicate hazards and respects incoming count/order', () => {
      const current: HazardLike[] = [
        { id: 'h1', hazardIdentification: 'Old 1' },
        { id: 'h2', hazardIdentification: 'Old 2' },
      ];
      const incoming: HazardLike[] = [
        { id: 'h1', hazardIdentification: 'New 1' },
        { id: 'h3', hazardIdentification: 'New 3' },
      ];
      const merged = mergeHazardsAuthoritative(current, incoming);
      expect(merged).toHaveLength(2);
      expect(merged[0].id).toBe('h1');
      expect(merged[0].hazardIdentification).toBe('New 1');
      expect(merged[1].id).toBe('h3');
      // h2 was removed because it is not present in incoming
      expect(merged.find((h) => h.id === 'h2')).toBeUndefined();
    });

    it('deep-merges nested risks when ids match', () => {
      const current: HazardLike[] = [
        { id: 'h1', initialRisk: { probability: 1, severity: 2, total: 3 } },
      ];
      const incoming: HazardLike[] = [
        { id: 'h1', initialRisk: { severity: 5 } },
      ];
      const merged = mergeHazardsAuthoritative(current, incoming);
      expect(merged[0].initialRisk).toEqual({
        probability: 1,
        severity: 5,
        total: 3,
      });
    });
  });
});
