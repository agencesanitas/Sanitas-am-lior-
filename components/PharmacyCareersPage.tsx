import Link from 'next/link';
import PublicLayout from './PublicLayout';
import JobCard from './JobCard';
import { PharmacyLinks } from './PharmacyLinks';
import { COMPANY } from '@/lib/constants';
import { localizedPath, type Locale } from '@/lib/i18n';
import { withJobDeadline } from '@/lib/job-availability';
import { PHARMACIST, PHARMACY_ASSISTANT, PHARMACY_PAGES, PHARMACY_PAY_MAX } from '@/lib/pharmacy';
import { publicPageMetadata } from '@/lib/seo';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Job } from '@/types';

const CAREERS = {
  pharmacist: {
    profession: PHARMACIST,
    rate: PHARMACY_PAY_MAX.pharmacist,
    fr: {
      title: 'Emplois de pharmacien au Québec',
      description: 'Postulez auprès de Sanitas pour des remplacements ou des postes permanents en pharmacie communautaire dans plusieurs régions du Québec.',
      qualification: 'Indiquez votre expérience, votre statut auprès de l’Ordre des pharmaciens du Québec et les régions où vous souhaitez exercer.',
    },
    en: {
      title: 'Pharmacist jobs in Quebec',
      description: 'Apply with Sanitas for relief or permanent positions in community pharmacies across Quebec.',
      qualification: 'Tell us about your experience, your registration status with the Ordre des pharmaciens du Québec and where you are available to work.',
    },
  },
  assistant: {
    profession: PHARMACY_ASSISTANT,
    rate: PHARMACY_PAY_MAX.assistant,
    fr: {
      title: 'Emplois d’assistant technique en pharmacie au Québec',
      description: 'Postulez comme assistant(e) technique en pharmacie (ATP) pour des remplacements ou des postes permanents dans plusieurs régions du Québec.',
      qualification: 'Précisez votre formation en assistance technique, votre expérience en pharmacie et les régions où vous souhaitez travailler.',
    },
    en: {
      title: 'Pharmacy assistant jobs in Quebec',
      description: 'Apply for relief work or permanent pharmacy assistant (ATP) positions in community pharmacies across Quebec.',
      qualification: 'Share your pharmacy assistant training, pharmacy experience and the regions where you are available to work.',
    },
  },
} as const;

type Career = keyof typeof CAREERS;

export function pharmacyCareerMetadata(career: Career, locale: Locale) {
  const { title, description } = CAREERS[career][locale];
  const { fr, en } = PHARMACY_PAGES[career];
  return publicPageMetadata({ title, description, path: PHARMACY_PAGES[career][locale], locale, frPath: fr, enPath: en });
}

export async function PharmacyCareersPage({ career, locale }: { career: Career; locale: Locale }) {
  const info = CAREERS[career];
  const copy = info[locale];
  const en = locale === 'en';
  const applyHref = localizedPath(locale, 'apply', `?profession=${encodeURIComponent(info.profession)}`);
  const supabase = createSupabaseAdminClient();
  const { data } = await withJobDeadline(supabase.from('jobs').select('*')
    .eq('status', 'active'))
    .eq('profession', info.profession).eq('country', 'Canada')
    .order('created_at', { ascending: false });
  const jobs = (data || []) as Job[];

  return (
    <PublicLayout locale={locale}>
      <section className="section border-b border-border bg-accent-soft">
        <div className="container-page grid gap-10 py-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end lg:py-12">
          <div>
            <Link href={localizedPath(locale, 'jobs')} className="text-sm font-medium text-accent hover:text-fg">
              {en ? 'All jobs' : 'Tous les postes'}
            </Link>
            <h1 className="mt-4 max-w-4xl text-display-lg text-fg">{copy.title}</h1>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-fg-muted">{copy.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href={applyHref} className="btn-primary" data-analytics-event="pharmacy_apply_click" data-analytics-label={career}>
                {en ? 'Apply for opportunities' : 'Postuler pour les mandats'}
              </Link>
              <a href={COMPANY.phoneHref} className="font-medium text-accent hover:underline">{COMPANY.phone}</a>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
            <p className="text-2xl font-semibold text-fg">
              {en ? `Up to $${info.rate}/hour` : `Jusqu’à ${info.rate} $/h`}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {en ? 'Maximum for select assignments. The rate, location, schedule and start date vary by opening.' : 'Maximum pour certains mandats. Le taux, le lieu, l’horaire et la date de début varient selon le besoin.'}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <h2 className="text-display-md text-fg">{en ? 'Open positions' : 'Offres par pharmacie'}</h2>
          {jobs.length === 0 ? (
            <p className="mt-3 max-w-prose leading-relaxed text-fg-muted">
              {en
                ? 'Send us your profile. Our team will discuss the location, hours and terms of opportunities that fit your availability.'
                : 'Envoyez-nous votre profil. Notre équipe discutera avec vous du lieu, de l’horaire et des conditions des mandats qui correspondent à vos disponibilités.'}
            </p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} locale={locale} />)}
            </div>
          )}
          <div className="mt-9 max-w-prose border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-fg">{en ? 'What to include in your profile' : 'Quoi indiquer dans votre profil'}</h2>
            <p className="mt-2 leading-relaxed text-fg-muted">{copy.qualification}</p>
          </div>
          <PharmacyLinks locale={locale} />
        </div>
      </section>
    </PublicLayout>
  );
}
