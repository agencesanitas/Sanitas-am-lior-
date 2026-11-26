import Image from 'next/image';
import Link from 'next/link';
import HomeSearch from './HomeSearch';
import JobCard from './JobCard';
import HomeSpotlightCarousel from './HomeSpotlightCarousel';
import { PharmacySpotlight } from './PharmacyLinks';
import { COMPANY, QUEBEC_REGIONS, REMOTE_JOB_REGIONS } from '@/lib/constants';
import { localizedPath, type Locale } from '@/lib/i18n';
import type { Job } from '@/types';

export function HomeEntry({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <section className="container-page pb-8 pt-9 sm:pb-12 sm:pt-14">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-accent">{en ? 'Healthcare staffing in Quebec' : 'Placement en santé au Québec'}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.65rem,6.3vw,5rem)] leading-[0.99] tracking-[-0.045em] text-fg">
            {en ? 'Find your next role in healthcare.' : 'Votre prochain poste en santé.'}
          </h1>
          <p className="mt-4 max-w-xl text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-fg-muted">
            {en ? 'Explore nursing, pharmacy and other healthcare jobs across Quebec.' : 'Découvrez des postes en soins infirmiers, en pharmacie et dans d’autres métiers de la santé.'}
          </p>
        </div>
        <nav aria-label={en ? 'Choose what you need' : 'Accès directs'} className="grid gap-2">
          <Link href={localizedPath(locale, 'jobs')} className="group flex min-h-14 items-center justify-between gap-4 rounded-lg bg-[oklch(0.29_0.047_232)] px-4 py-3 text-[0.98rem] font-semibold text-bg transition-colors hover:bg-accent sm:px-5" data-analytics-event="home_cta_click" data-analytics-label="hero_jobs">
            {en ? 'I’m looking for a job' : 'Je cherche un poste'}
            <span aria-hidden="true" className="text-xl">↗</span>
          </Link>
          <Link href={localizedPath(locale, 'facilities')} className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 text-[0.98rem] font-semibold text-fg transition-colors hover:border-accent hover:text-accent sm:px-5" data-analytics-event="home_cta_click" data-analytics-label="hero_facilities">
            {en ? 'I’m hiring' : 'Je cherche du personnel'}
            <span aria-hidden="true" className="text-xl">↗</span>
          </Link>
          <a href="#offres-en-vedette" className="w-fit py-1 text-sm font-semibold text-accent underline-offset-4 hover:underline">
            {en ? 'Featured opportunities ↓' : 'Offres en vedette ↓'}
          </a>
        </nav>
      </div>
    </section>
  );
}

export function HomeSpotlight({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const nurse = { profession: 'Infirmier(ère)' };
  const nursingJobs = localizedPath(locale, 'jobs');
  const nursingLinks = [
    {
      title: en ? 'Nursing assignments' : 'Mandats infirmiers',
      description: en ? 'General and specialized care' : 'Soins généraux et spécialisés',
      href: `${nursingJobs}?${new URLSearchParams(nurse)}`,
      action: en ? 'See jobs' : 'Voir les postes',
    },
    {
      title: en ? 'Remote regions' : 'Régions éloignées',
      description: en ? 'Gaspésie, Côte-Nord, Northern Quebec and more' : 'Gaspésie, Côte-Nord, Nord-du-Québec et plus',
      href: `${nursingJobs}?${new URLSearchParams({ ...nurse, region: REMOTE_JOB_REGIONS })}`,
      action: en ? 'See assignments' : 'Voir les mandats',
    },
  ];

  const nursing = (
    <div className="grid h-full overflow-hidden rounded-2xl bg-[oklch(0.265_0.055_245)] text-white [&_a:focus-visible]:outline-white lg:grid-cols-[2fr_3fr]">
      <div className="relative order-last aspect-[16/9] lg:order-first lg:aspect-auto">
        <Image
          src="/images/sanitas-soins-infirmiers.webp"
          alt={en ? 'A nurse preparing a blood pressure monitor in an exam room' : 'Un infirmier prépare un tensiomètre dans une salle de consultation'}
          fill
          priority
          sizes="(min-width: 1152px) 436px, (min-width: 1024px) 38vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="flex flex-col p-5 sm:p-9 lg:justify-center lg:p-10">
        <p className="text-sm font-semibold text-[oklch(0.91_0.055_232)]">{en ? 'Featured jobs' : 'Offres en vedette'}</p>
        <h2 className="mt-2 font-serif text-[clamp(2rem,4.35vw,3.75rem)] leading-none tracking-[-0.035em]">
          {en ? 'Nursing' : 'Soins infirmiers'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
          {en ? 'Find assignments that match your specialty and availability.' : 'Trouvez des mandats selon votre spécialité et vos disponibilités.'}
        </p>
        <ul className="mt-6 divide-y divide-white/25 border-y border-white/25">
          {nursingLinks.map(({ title, description, href, action }) => (
            <li key={href} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5">
              <div>
                <h3 className="text-base font-semibold leading-tight sm:text-lg">{title}</h3>
                <p className="mt-1 text-sm leading-snug text-white/75">{description}</p>
              </div>
              <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[oklch(0.94_0.043_232)] px-3.5 text-sm font-bold text-[oklch(0.265_0.055_245)] transition-colors hover:bg-white">
                {action} <span aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <Link href={localizedPath(locale, 'apply')} className="inline-flex min-h-11 items-center text-sm text-white/80 underline decoration-white/50 underline-offset-4 hover:text-white">
            {en ? 'Send my profile' : 'Envoyer mon profil'}
          </Link>
          <Link href={localizedPath(locale, 'facilities')} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:text-[oklch(0.91_0.055_232)]">
            {en ? 'Hire nursing staff' : 'Recruter en soins infirmiers'} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return <HomeSpotlightCarousel locale={locale} nursing={nursing} pharmacy={<PharmacySpotlight locale={locale} />} />;
}

export function HomeJobs({ locale, jobs }: { locale: Locale; jobs: Job[] }) {
  const en = locale === 'en';
  return (
    <section className="container-page py-12 sm:py-16" aria-labelledby="home-jobs">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="home-jobs" className="font-serif text-4xl tracking-tight text-fg sm:text-5xl">{en ? 'Find a job' : 'Trouvez un poste'}</h2>
          <p className="mt-2 text-fg-muted">{en ? 'Search by profession or region.' : 'Cherchez par profession ou par région.'}</p>
        </div>
        <Link href={localizedPath(locale, 'jobs')} className="font-semibold text-accent underline underline-offset-4" data-analytics-event="home_cta_click" data-analytics-label="urgent_jobs_all">
          {en ? 'See all jobs' : 'Voir tous les postes'}
        </Link>
      </div>
      <div className="mt-5"><HomeSearch locale={locale} /></div>
      {jobs.length > 0 && (
        <>
          <h3 className="mb-4 mt-9 text-xl font-semibold text-fg">{en ? 'Priority openings' : 'Postes à pourvoir rapidement'}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} locale={locale} />)}
          </div>
        </>
      )}
      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-fg-muted">
        <span>{en ? 'Want us to contact you about suitable openings?' : 'Vous souhaitez être contacté pour un poste compatible ?'}</span>
        <Link href={localizedPath(locale, 'apply')} className="font-semibold text-accent underline underline-offset-4" data-analytics-event="home_cta_click" data-analytics-label="hero_apply">
          {en ? 'Send my profile' : 'Envoyer mon profil'}
        </Link>
      </div>
    </section>
  );
}

export function HomeAgencyProof({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <dl className="container-page grid gap-3 pt-5 text-sm text-fg-muted sm:grid-cols-3">
      <div className="flex flex-wrap gap-x-2"><dt>{en ? 'Service area' : 'Territoire'}</dt><dd className="font-semibold text-fg">{en ? `${QUEBEC_REGIONS.length} regions in Quebec` : `${QUEBEC_REGIONS.length} régions du Québec`}</dd></div>
      <div className="flex flex-wrap gap-x-2"><dt>{en ? 'Sanitas office' : 'Bureau Sanitas'}</dt><dd className="font-semibold text-fg">{COMPANY.address.city}</dd></div>
      <div className="flex flex-wrap gap-x-2"><dt>{en ? 'CNESST permit' : 'Permis CNESST'}</dt><dd className="font-semibold text-fg">{COMPANY.cnesstPermit}</dd></div>
    </dl>
  );
}
