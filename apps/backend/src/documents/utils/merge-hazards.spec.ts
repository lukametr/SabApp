import { mergeHazards, HazardLike } from './merge-hazards';

describe('mergeHazards', () => {
  it('preserves existing fields when incoming hazard omits them', () => {
    const current: HazardLike[] = [{
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
      photos: ['data:image/png;base64,AAA']
    }];

    const incoming: HazardLike[] = [{
      id: 'h1',
      hazardIdentification: 'New Title',
      initialRisk: { probability: 5 },
    }];

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
    const incoming: HazardLike[] = [{ id: 'new1', hazardIdentification: 'H New', initialRisk: { probability: 1, severity: 1, total: 1 }, residualRisk: { probability: 1, severity: 1, total: 1 } }];
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
});
