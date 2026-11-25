import Image from 'next/image';
import PublicLayout from './PublicLayout';
import EstablishmentRequestForm from './EstablishmentRequestForm';
import { COMPANY } from '@/lib/constants';
import { PHARMACY_PAGES } from '@/lib/pharmacy';
import { publicPageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';

const REGISTRY = 'https://www.cnesst.gouv.qc.ca/fr/demarches-formulaires/agences-placement-personnel-recrutement/permis-agences/registre-titulaires-permis-agence';
const OPQ = 'https://www.opq.org/trouver-un-pharmacien/';

const COPY = {
  fr: {
    title: 'Recrutement pour les pharmacies du Québec',
    description: 'Pharmaciens et assistants techniques en pharmacie (ATP) pour vos remplacements et vos postes permanents. Parlez de votre besoin à l’équipe Sanitas à Laval.',
    temp: 'Remplacement temporaire',
    tempDetail: 'Précisez le lieu, les quarts à couvrir et la durée. Nous recherchons des profils disponibles pour votre horaire.',
    permanent: 'Recrutement permanent',
    permanentDetail: 'Décrivez le poste, votre équipe et l’expérience recherchée. Nous convenons avec vous du profil et des étapes de recrutement.',
    process: 'Ce que nous vérifions avant de présenter un profil',
    checks: 'Nous validons les disponibilités et l’expérience utile à votre pharmacie. Pour les pharmaciens, nous vérifions le statut auprès de l’Ordre. Pour les ATP, nous passons en revue la formation et l’expérience en pharmacie.',
    followup: 'Après la prise de poste, notre équipe communique avec votre pharmacie pour faire le point.',
    request: 'Parlez-nous de votre besoin',
    licence: 'Vérifier le permis CNESST',
    register: 'Consulter le bottin de l’Ordre',
  },
  en: {
    title: 'Staffing for Quebec pharmacies',
    description: 'Pharmacists and pharmacy assistants (ATPs) for relief coverage and permanent positions. Tell the Sanitas team in Laval what you need.',
    temp: 'Relief coverage',
    tempDetail: 'Tell us the location, shifts and length of coverage. We look for candidates who are available for your schedule.',
    permanent: 'Permanent recruitment',
    permanentDetail: 'Tell us about the role, your team and the experience you need. We agree on the candidate profile and hiring steps with you.',
    process: 'What we verify before introducing a candidate',
    checks: 'We check availability and experience relevant to your pharmacy. We verify pharmacists’ registration with the Ordre and review pharmacy assistants’ training and pharmacy experience.',
    followup: 'Our team checks in with your pharmacy after the candidate starts.',
    request: 'Tell us what you need',
    licence: 'Check the CNESST permit',
    register: 'View the Ordre’s directory',
  },
} as const;

export function pharmacyStaffingMetadata(locale: Locale) {
  const { title, description } = COPY[locale];
  const { fr, en } = PHARMACY_PAGES.employer;
  return publicPageMetadata({ title, description, path: PHARMACY_PAGES.employer[locale], locale, frPath: fr, enPath: en });
}

export function PharmacyStaffingPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  return (
    <PublicLayout locale={locale}>
      <section className="section border-b border-border bg-accent-soft">
        <div className="container-page grid items-center gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <h1 className="text-display-lg text-fg">{copy.title}</h1>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-fg-muted">{copy.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#demande" className="btn-primary" data-analytics-event="pharmacy_request_click">
                {locale === 'en' ? 'Request staff' : 'Demander du personnel'}
              </a>
              <a href={COMPANY.phoneHref} className="font-medium text-accent hover:underline">{COMPANY.phone}</a>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image src="/images/sanitas-partenariat.jpg" alt="" fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-fg">{copy.temp}</h2>
              <p className="mt-2 max-w-prose leading-relaxed text-fg-muted">{copy.tempDetail}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-fg">{copy.permanent}</h2>
              <p className="mt-2 max-w-prose leading-relaxed text-fg-muted">{copy.permanentDetail}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-fg">{copy.process}</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">{copy.checks}</p>
            <p className="mt-3 leading-relaxed text-fg-muted">{copy.followup}</p>
            <p className="mt-4 text-sm text-fg">{COMPANY.address.line2}, {COMPANY.address.line1}, {COMPANY.address.city}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={REGISTRY} className="font-medium text-accent underline">{copy.licence} ({COMPANY.cnesstPermit})</a>
              <a href={OPQ} className="font-medium text-accent underline">{copy.register}</a>
            </div>
          </div>
        </div>
      </section>
      <section id="demande" className="section scroll-mt-24 border-t border-border bg-muted">
        <div className="container-page max-w-4xl">
          <h2 className="mb-6 text-display-md text-fg">{copy.request}</h2>
          <EstablishmentRequestForm locale={locale} pharmacy />
        </div>
      </section>
    </PublicLayout>
  );
}
