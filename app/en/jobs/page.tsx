import PublicLayout from '@/components/PublicLayout';
import SeoJsonLd from '@/components/SeoJsonLd';
import JobFilters from '@/components/JobFilters';
import { REMOTE_JOB_REGIONS } from '@/lib/constants';
import { localizedPath } from '@/lib/i18n';
import { isPharmacyProfession } from '@/lib/pharmacy';
import { fetchPublicJobs, jobSearchParam, type JobSearchParams } from '@/lib/public-jobs';
import JobCard from '@/components/JobCard';
import PopularSearchLinks from '@/components/PopularSearchLinks';
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  itemListJsonLd,
  jobMetaDescription,
  publicPageMetadata,
  serviceJsonLd,
} from '@/lib/seo';

export const metadata = publicPageMetadata({
  title: 'Healthcare jobs | Quebec and international assignments',
  description:
    'Browse active healthcare assignments with Agence Sanitas, in Quebec and internationally. Filter by profession, country, region, department, shift and assignment type.',
  path: '/en/jobs',
  locale: 'en',
  frPath: '/postes',
  enPath: '/en/jobs',
});

export const dynamic = 'force-dynamic';

export default async function EnglishJobsPage({ searchParams }: { searchParams: JobSearchParams }) {
  const jobs = await fetchPublicJobs(searchParams);
  const remoteOnly = jobSearchParam(searchParams, 'region') === REMOTE_JOB_REGIONS;
  const profession = jobSearchParam(searchParams, 'profession');
  const applyHref = localizedPath('en', 'apply',
    isPharmacyProfession(profession) ? `?profession=${encodeURIComponent(profession)}` : '');

  return (
    <PublicLayout locale="en">
      <SeoJsonLd
        id="jobs-list-schema-en"
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            collectionPageJsonLd({
              name: 'Healthcare jobs and assignments in Quebec',
              description:
                'Active healthcare assignments in Quebec for nurses, licensed practical nurses, PABs, ASSS and specialized workers.',
              url: '/en/jobs',
              locale: 'en',
            }),
            serviceJsonLd({
              name: 'Healthcare assignment search in Quebec',
              description:
                'Job matching service for healthcare professionals seeking active assignments in Quebec or international mandates.',
              url: '/en/jobs',
              locale: 'en',
              serviceType: 'Healthcare job matching',
              audience: 'candidates',
            }),
            breadcrumbJsonLd([
              { name: 'Home', url: '/en' },
              { name: 'Jobs', url: '/en/jobs' },
            ]),
            itemListJsonLd(
              jobs.slice(0, 30).map((job) => ({
                name: job.title_en || job.title,
                url: `/en/jobs/${job.id}`,
                description: jobMetaDescription(job, 'en'),
              })),
            ),
          ],
        }}
      />
      <section className="container-page pb-6 pt-9 sm:pb-8 sm:pt-12">
        <h1 className="text-display-lg text-fg">{remoteOnly ? 'Jobs in remote regions' : 'Healthcare jobs'}</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">{remoteOnly ? 'Browse active healthcare assignments in remote regions of Quebec.' : 'Find nursing, pharmacy and other healthcare positions.'}</p>
        <div className="mt-6"><JobFilters locale="en" /></div>
      </section>

      <section className="pb-12">
        <div className="container-page">
          {jobs.length === 0 ? (
            <div className="card p-10 text-center">
              <h2 className="text-[20px] font-semibold text-fg">No jobs match your search.</h2>
              <p className="mt-3 max-w-prose mx-auto text-fg-muted leading-relaxed">
                Try broadening your filters, or send us your profile. We will contact you when a compatible assignment is available.
              </p>
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                <a href={applyHref} className="btn-primary">Submit my profile</a>
                <a href="/en/jobs" className="btn-secondary">Reset</a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13.5px] text-fg-muted mb-5">
                {jobs.length} {jobs.length > 1 ? 'jobs available' : 'job available'}
              </p>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} locale="en" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <div className="container-page pb-14">
        <PopularSearchLinks locale="en" />
      </div>
    </PublicLayout>
  );
}
