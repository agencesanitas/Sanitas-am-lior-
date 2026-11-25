import 'server-only';
import { PHARMACIST } from './pharmacy';
import { createSupabaseAdminClient } from './supabase/admin';
import type { SubmissionAnswers } from '@/types';

export type PharmacistApplicationAnswers = Pick<SubmissionAnswers, 'pharmacist_dsq' | 'pharmacy_software'>;

export async function getPharmacistApplicationAnswers(candidateId: string): Promise<PharmacistApplicationAnswers> {
  const { data } = await createSupabaseAdminClient()
    .from('applications')
    .select('answers')
    .eq('candidate_id', candidateId)
    .eq('answers->>profession', PHARMACIST)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const answers = data?.answers as SubmissionAnswers | undefined;
  return {
    pharmacist_dsq: answers?.pharmacist_dsq,
    pharmacy_software: answers?.pharmacy_software,
  };
}
