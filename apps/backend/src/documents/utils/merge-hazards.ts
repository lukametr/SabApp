// Utility to deep-merge hazards during document update while preserving nested fields
// and existing values when incoming update does not specify them.

export interface Risk {
  probability?: number;
  severity?: number;
  total?: number;
}

export interface HazardLike {
  id?: string;
  hazardIdentification?: string;
  affectedPersons?: string[];
  injuryDescription?: string;
  existingControlMeasures?: string;
  initialRisk?: Risk;
  additionalControlMeasures?: string;
  residualRisk?: Risk;
  requiredMeasures?: string;
  responsiblePerson?: string;
  reviewDate?: Date | string;
  photos?: string[];
  [key: string]: any;
}

export const mergeHazards = (current: HazardLike[] = [], incoming: HazardLike[] = []): HazardLike[] => {
  const byId = new Map<string, HazardLike>();
  // Index existing hazards by id (or synthesized index)
  current.forEach((h, idx) => {
    const key = h.id || `existing_${idx}`;
    byId.set(key, { ...h });
  });

  incoming.forEach((h) => {
    const key = h.id || `hazard_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const existing = byId.get(key);
    if (!existing) {
      // New hazard, just add
      byId.set(key, { ...h });
    } else {
      // Merge into existing, preserving nested risk fields and photos when not provided
      const merged: HazardLike = {
        ...existing,
        ...h,
        initialRisk: {
          ...(existing.initialRisk || {}),
          ...(h.initialRisk || {}),
        },
        residualRisk: {
          ...(existing.residualRisk || {}),
          ...(h.residualRisk || {}),
        },
        photos: Array.isArray(h.photos) ? h.photos : existing.photos,
      };
      byId.set(key, merged);
    }
  });

  return Array.from(byId.values());
};

export default mergeHazards;

// Authoritative merge: returns exactly the incoming hazards list length,
// deep-merging fields with existing when ids match. Hazards not present in
// incoming are removed. Useful to avoid duplication and allow deletions.
export const mergeHazardsAuthoritative = (current: HazardLike[] = [], incoming: HazardLike[] = []): HazardLike[] => {
  const currentById = new Map<string, HazardLike>();
  current.forEach((h, idx) => currentById.set(h.id || `existing_${idx}`, { ...h }));

  return incoming.map((h, idx) => {
    const key = h.id || `hazard_${Date.now()}_${idx}`;
    const existing = currentById.get(key);
    if (!existing) {
      // New hazard, ensure photos is array if provided
      return {
        ...h,
        // Default required strings to '' if omitted to satisfy schema validators on update
        hazardIdentification: h.hazardIdentification ?? '',
        injuryDescription: h.injuryDescription ?? '',
        existingControlMeasures: h.existingControlMeasures ?? '',
        additionalControlMeasures: h.additionalControlMeasures ?? '',
        requiredMeasures: h.requiredMeasures ?? '',
        responsiblePerson: h.responsiblePerson ?? '',
        affectedPersons: Array.isArray(h.affectedPersons) ? h.affectedPersons : [],
        initialRisk: { ...(h.initialRisk || {}) },
        residualRisk: { ...(h.residualRisk || {}) },
        photos: Array.isArray(h.photos) ? h.photos : (h.photos ? [h.photos] : [])
      } as HazardLike;
    }
    return {
      ...existing,
      ...h,
      initialRisk: {
        ...(existing.initialRisk || {}),
        ...(h.initialRisk || {}),
      },
      residualRisk: {
        ...(existing.residualRisk || {}),
        ...(h.residualRisk || {}),
      },
      photos: Array.isArray(h.photos) ? h.photos : existing.photos,
    } as HazardLike;
  });
};
