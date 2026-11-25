import type { Candidate } from '@/types';

export const PHARMACIST = 'Pharmacien(ne)';
export const PHARMACY_ASSISTANT = 'Assistant(e) technique en pharmacie (ATP)';

export const PHARMACY_PROFESSIONS = [PHARMACIST, PHARMACY_ASSISTANT] as const;
export const PHARMACY_MANDATE_TYPES = ['Remplacement', 'Permanent'] as const;

export type PharmacyProfession = (typeof PHARMACY_PROFESSIONS)[number];

export function isPharmacyProfession(value: unknown): value is PharmacyProfession {
  return value === PHARMACIST || value === PHARMACY_ASSISTANT;
}

export const PHARMACY_PAY_MAX = { pharmacist: 150, assistant: 50 } as const;

export const PHARMACY_PAGES = {
  pharmacist: { fr: '/emplois-pharmaciens-quebec', en: '/en/pharmacist-jobs-quebec' },
  assistant: { fr: '/emplois-atp-quebec', en: '/en/pharmacy-assistant-jobs-quebec' },
  employer: { fr: '/recrutement-pharmacies', en: '/en/pharmacy-staffing-quebec' },
} as const;

export function prefillPharmacyCandidate(candidate: Candidate, profession: PharmacyProfession): Candidate {
  const qualifiedProfessions = Array.from(new Set([
    profession,
    ...(candidate.qualified_professions || []),
    ...(candidate.profession ? [candidate.profession] : []),
  ]));
  return {
    ...candidate,
    profession,
    qualified_professions: qualifiedProfessions,
    preference_sets: candidate.preference_sets?.map((set, index) =>
      index === 0 ? { ...set, professions: Array.from(new Set([profession, ...set.professions])) } : set
    ),
  };
}
