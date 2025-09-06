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
  implementationDeadlines?: string;
  reviewDate?: Date | string;
  photos?: string[];
  [key: string]: any;
}

export const mergeHazards = (current: HazardLike[] = [], incoming: HazardLike[] = []): HazardLike[] => {
  const ensureRisk = (r?: Risk): Risk => ({
    probability: r?.probability ?? 0,
    severity: r?.severity ?? 0,
    total: r?.total ?? 0,
  });
  // Remove undefined fields so they don't overwrite existing values
  const sanitize = (h: HazardLike): HazardLike => {
    const out: any = {};
    Object.keys(h || {}).forEach((k) => {
      const v = (h as any)[k];
      if (v !== undefined) out[k] = v;
    });
    if (h.initialRisk) {
      out.initialRisk = Object.fromEntries(
        Object.entries(h.initialRisk).filter(([, v]) => v !== undefined)
      );
    }
    if (h.residualRisk) {
      out.residualRisk = Object.fromEntries(
        Object.entries(h.residualRisk).filter(([, v]) => v !== undefined)
      );
    }
    return out as HazardLike;
  };
  const byId = new Map<string, HazardLike>();
  // Index existing hazards by id (or synthesized index)
  current.forEach((h, idx) => {
    const key = h.id || `existing_${idx}`;
    byId.set(key, { ...h });
  });

  incoming.forEach((_h) => {
    const h = sanitize(_h);
    const key = h.id || `hazard_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const existing = byId.get(key);
    if (!existing) {
      // New hazard, just add
      byId.set(key, { ...h });
    } else {
      // Merge into existing, preserving nested risk fields and photos when not provided
      const mergedBase: HazardLike = {
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
      // normalize risks to ensure required fields present
      const merged: HazardLike = {
        ...mergedBase,
        initialRisk: ensureRisk(mergedBase.initialRisk),
        residualRisk: ensureRisk(mergedBase.residualRisk),
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

  const ensureRisk = (r?: Risk): Risk => ({
    probability: r?.probability ?? 0,
    severity: r?.severity ?? 0,
    total: r?.total ?? 0,
  });
  const sanitize = (h: HazardLike): HazardLike => {
    const out: any = {};
    Object.keys(h || {}).forEach((k) => {
      const v = (h as any)[k];
      if (v !== undefined) out[k] = v;
    });
    if (h.initialRisk) {
      out.initialRisk = Object.fromEntries(
        Object.entries(h.initialRisk).filter(([, v]) => v !== undefined)
      );
    }
    if (h.residualRisk) {
      out.residualRisk = Object.fromEntries(
        Object.entries(h.residualRisk).filter(([, v]) => v !== undefined)
      );
    }
    return out as HazardLike;
  };

  return incoming.map((_h, idx) => {
    const h = sanitize(_h);
    const key = h.id || `hazard_${Date.now()}_${idx}`;
    const existing = currentById.get(key);
    if (!existing) {
      // New hazard, ensure photos is array if provided
      const created: HazardLike = {
        ...h,
        // Default required strings to '' if omitted to satisfy schema validators on update
        hazardIdentification: h.hazardIdentification ?? '',
        injuryDescription: h.injuryDescription ?? '',
        existingControlMeasures: h.existingControlMeasures ?? '',
        additionalControlMeasures: h.additionalControlMeasures ?? '',
        requiredMeasures: h.requiredMeasures ?? '',
        responsiblePerson: h.responsiblePerson ?? '',
        implementationDeadlines: h.implementationDeadlines ?? '',
        affectedPersons: Array.isArray(h.affectedPersons) ? h.affectedPersons : [],
        initialRisk: ensureRisk(h.initialRisk),
        residualRisk: ensureRisk(h.residualRisk),
        photos: Array.isArray(h.photos) ? h.photos : (h.photos ? [h.photos] : [])
      } as HazardLike;
      return created;
    }
    const mergedBase: HazardLike = {
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
    const merged: HazardLike = {
      ...mergedBase,
      initialRisk: ensureRisk(mergedBase.initialRisk),
      residualRisk: ensureRisk(mergedBase.residualRisk),
    };
    return merged;
  });
};
