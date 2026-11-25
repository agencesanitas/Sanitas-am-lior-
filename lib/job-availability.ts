import type { Job } from '@/types';

const QUEBEC_TIME_ZONE = 'America/Toronto';

export function quebecDate(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: QUEBEC_TIME_ZONE }).format(now);
}

// Enable after the pharmacy migration has been applied to this deployment.
export function pharmacySchemaReady() {
  return process.env.PHARMACY_SCHEMA_READY === 'true';
}

export function withJobDeadline<Query extends { or(filters: string): Query }>(query: Query) {
  return pharmacySchemaReady()
    ? query.or(`application_deadline.is.null,application_deadline.gte.${quebecDate()}`)
    : query;
}

export function isOpenJob(job: Pick<Job, 'status' | 'application_deadline'>, now = new Date()) {
  return job.status === 'active' && (!job.application_deadline || job.application_deadline >= quebecDate(now));
}

export function deadlineTimestamp(date: string) {
  const noon = new Date(`${date}T12:00:00Z`);
  const offset = new Intl.DateTimeFormat('en-CA', {
    timeZone: QUEBEC_TIME_ZONE,
    timeZoneName: 'longOffset',
  }).formatToParts(noon).find((part) => part.type === 'timeZoneName')?.value.slice(3);

  return `${date}T23:59:59${offset || 'Z'}`;
}
