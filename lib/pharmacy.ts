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

export const DSQ_ACCESS_OPTIONS = [
  { value: 'active', fr: 'Oui, j’ai déjà un accès', en: 'Yes, I already have access' },
  { value: 'to_set_up', fr: 'Accès à obtenir ou à réactiver', en: 'Access needs to be set up or reactivated' },
  { value: 'unsure', fr: 'À confirmer', en: 'To be confirmed' },
] as const;

export type DsqAccess = (typeof DSQ_ACCESS_OPTIONS)[number]['value'];

export const PHARMACY_SOFTWARE = ['RxPro', 'Assyst Rx', 'Ubik', 'PrioRx', 'ReflexRx / XD3', 'Gesphar', 'Logipharm'] as const;
