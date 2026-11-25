import Link from 'next/link';
import { PHARMACIST, PHARMACY_ASSISTANT, PHARMACY_PAGES, PHARMACY_PAY_MAX } from '@/lib/pharmacy';
import type { Locale } from '@/lib/i18n';

export function PharmacyLinks({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <nav aria-label={en ? 'Pharmacy opportunities' : 'Emplois en pharmacie'} className="my-5 flex flex-wrap gap-2">
      <Link className="chip-link" href={PHARMACY_PAGES.pharmacist[locale]}>
        {en ? 'Pharmacist jobs' : 'Emplois de pharmacien'}
      </Link>
      <Link className="chip-link" href={PHARMACY_PAGES.assistant[locale]}>
        {en ? 'Pharmacy assistant jobs' : 'Emplois d’ATP'}
      </Link>
      <Link className="chip-link" href={PHARMACY_PAGES.employer[locale]}>
        {en ? 'Staffing for pharmacies' : 'Recrutement pour les pharmacies'}
      </Link>
    </nav>
  );
}

export function PharmacyRecruitmentListings({ locale, profession }: { locale: Locale; profession?: string }) {
  const en = locale === 'en';
  const roles = [
    {
      profession: PHARMACIST,
      href: PHARMACY_PAGES.pharmacist[locale],
      title: en ? 'Community pharmacist' : 'Pharmacien(ne) en pharmacie communautaire',
      rate: PHARMACY_PAY_MAX.pharmacist,
    },
    {
      profession: PHARMACY_ASSISTANT,
      href: PHARMACY_PAGES.assistant[locale],
      title: en ? 'Pharmacy assistant (ATP)' : 'Assistant(e) technique en pharmacie (ATP)',
      rate: PHARMACY_PAY_MAX.assistant,
    },
  ].filter((role) => !profession || role.profession === profession);

  if (!roles.length) return null;

  return (
    <section className="my-6" aria-labelledby="pharmacy-recruitment">
      <h2 className="mb-3 text-xl font-semibold text-fg" id="pharmacy-recruitment">
        {en ? 'Recruiting for pharmacies' : 'Recrutement en pharmacie'}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map(({ href, title, rate }) => (
          <Link key={href} href={href} className="card-interactive p-4 block">
            <h3 className="font-semibold text-fg">{title} <span aria-hidden="true">→</span></h3>
            <p className="mt-1 text-sm text-accent">
              {en ? `Up to $${rate}/h on select assignments` : `Jusqu’à ${rate} $/h pour certains mandats`}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{en ? 'Multiple regions in Quebec' : 'Plusieurs régions du Québec'}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
