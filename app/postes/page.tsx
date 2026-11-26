import { PharmacyRecruitmentListings } from '@/components/PharmacyLinks';
import PublicLayout from '@/components/PublicLayout';
import SeoJsonLd from '@/components/SeoJsonLd';
import JobFilters from '@/components/JobFilters';
import { REMOTE_JOB_REGIONS } from '@/lib/constants';
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
  title: 'Mandats infirmiers au Québec | Emplois en santé Sanitas',
  description:
    'Consultez les mandats infirmiers et emplois en santé actifs avec Agence Sanitas. Filtrez par profession, région, département, quart, pays et type de mandat.',
  path: '/postes',
  frPath: '/postes',
  enPath: '/en/jobs',
});

export const dynamic = 'force-dynamic';

export default async function PostesPage({ searchParams }: { searchParams: JobSearchParams }) {
  const jobs = await fetchPublicJobs(searchParams);
  const remoteOnly = jobSearchParam(searchParams, 'region') === REMOTE_JOB_REGIONS;

  return (
    <PublicLayout>
      <SeoJsonLd
        id="jobs-list-schema"
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            collectionPageJsonLd({
              name: 'Mandats infirmiers et emplois en santé',
              description:
                'Mandats actifs au Québec et à l’international pour infirmières, infirmières cliniciennes et autres professionnels de la santé.',
              url: '/postes',
            }),
            serviceJsonLd({
              name: 'Recherche de mandats infirmiers et emplois en santé',
              description:
                'Service de mise en relation entre professionnels de la santé et mandats actifs au Québec ou à l’international.',
              url: '/postes',
              serviceType: 'Healthcare job matching',
              audience: 'candidates',
            }),
            breadcrumbJsonLd([
              { name: 'Accueil', url: '/' },
              { name: 'Postes', url: '/postes' },
            ]),
            itemListJsonLd(
              jobs.slice(0, 30).map((job) => ({
                name: job.title,
                url: `/postes/${job.id}`,
                description: jobMetaDescription(job, 'fr'),
              })),
            ),
          ],
        }}
      />
      <section className="container-page pb-6 pt-9 sm:pb-8 sm:pt-12">
        <h1 className="text-display-lg text-fg">{remoteOnly ? 'Emplois en régions éloignées' : 'Emplois en santé'}</h1>
        <p className="mt-3 max-w-2xl text-fg-muted">{remoteOnly ? 'Consultez les offres actives en régions éloignées du Québec.' : 'Trouvez un poste en soins infirmiers, en pharmacie ou dans un autre métier de la santé.'}</p>
        <div className="mt-6"><JobFilters /></div>
      </section>

      <section className="pb-12">
        <div className="container-page">
          {jobs.length === 0 ? (
            <div className="card p-10 text-center">
              <h2 className="text-[20px] font-semibold text-fg">Aucun poste ne correspond.</h2>
              <p className="mt-3 max-w-prose mx-auto text-fg-muted leading-relaxed">
                Essayez d'élargir vos critères, ou envoyez-nous votre profil. Nous vous contacterons
                lorsqu'un mandat compatible sera disponible.
              </p>
              <div className="mt-6 flex justify-center gap-3 flex-wrap">
                <a
                  href="/postuler"
                  className="btn-primary"
                  data-analytics-event="jobs_empty_state_click"
                  data-analytics-label="apply"
                >
                  Envoyer mon profil
                </a>
                <a
                  href="/postes"
                  className="btn-secondary"
                  data-analytics-event="jobs_empty_state_click"
                  data-analytics-label="reset"
                >
                  Réinitialiser
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13.5px] text-fg-muted mb-5">
                {jobs.length} poste{jobs.length > 1 ? 's' : ''} disponible{jobs.length > 1 ? 's' : ''}
              </p>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <div className="container-page space-y-10 pb-14">
        <PharmacyRecruitmentListings locale="fr" profession={jobSearchParam(searchParams, 'profession')} />
        <PopularSearchLinks />
      </div>
    </PublicLayout>
  );
}
