import { unstable_noStore as noStore } from 'next/cache';
import { isInternationalCountry, isRemoteRegion, REMOTE_JOB_REGIONS } from '@/lib/constants';
import { withJobDeadline } from '@/lib/job-availability';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { urgencyOrder } from '@/lib/utils';
import type { Job } from '@/types';

export type JobSearchParams = Record<string, string | string[] | undefined>;

const MAX_JOBS = 60;
const REMOTE_SCAN_SIZE = 120;

export function jobSearchParam(params: JobSearchParams, key: string): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) || '';
}

export async function fetchPublicJobs(params: JobSearchParams): Promise<Job[]> {
  noStore();
  try {
    const supabase = createSupabaseAdminClient();
    let query = withJobDeadline(supabase.from('jobs').select('*').eq('status', 'active'));

    const profession = jobSearchParam(params, 'profession');
    const country = jobSearchParam(params, 'country');
    const region = jobSearchParam(params, 'region');
    const city = jobSearchParam(params, 'city');
    const establishment = jobSearchParam(params, 'establishment');
    const department = jobSearchParam(params, 'department');
    const shift = jobSearchParam(params, 'shift');
    const mandateType = jobSearchParam(params, 'mandate_type');
    const urgency = jobSearchParam(params, 'urgency');
    const remoteOnly = region === REMOTE_JOB_REGIONS;

    if (profession) query = query.eq('profession', profession);
    if (country) query = query.eq('country', country);
    if (region && !remoteOnly) query = query.eq('region', region);
    if (city) query = query.ilike('city', `%${city}%`);
    if (establishment) query = query.ilike('establishment', `%${establishment}%`);
    if (department) query = query.eq('department', department);
    if (shift) query = query.eq('shift', shift);
    if (mandateType) query = query.eq('mandate_type', mandateType);
    if (urgency) query = query.eq('urgency', urgency);
    query = query.order('created_at', { ascending: false });

    let jobs: Job[];
    if (remoteOnly) {
      // Use the same rules as the badge, including free-text regions such as « Baie-James ».
      // Apply the result limit after filtering so older remote jobs can still surface.
      jobs = [];
      const pagedQuery = query.order('id', { ascending: true });

      for (let offset = 0; jobs.length < MAX_JOBS; offset += REMOTE_SCAN_SIZE) {
        const { data, error } = await pagedQuery.range(offset, offset + REMOTE_SCAN_SIZE - 1);
        if (error) return [];
        const page = (data || []) as Job[];
        jobs.push(...page.filter((job) => !isInternationalCountry(job.country) && isRemoteRegion(job.region)));
        if (page.length < REMOTE_SCAN_SIZE) break;
      }

      jobs = jobs.slice(0, MAX_JOBS);
    } else {
      const { data } = await query.limit(MAX_JOBS);
      jobs = (data || []) as Job[];
    }

    return jobs.sort((a, b) => {
      const urgency = urgencyOrder(a.urgency) - urgencyOrder(b.urgency);
      return urgency || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch {
    return [];
  }
}
