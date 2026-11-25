import Link from 'next/link';
import { PHARMACIST, PHARMACY_ASSISTANT, PHARMACY_PAGES, PHARMACY_PAY_MAX } from '@/lib/pharmacy';
import { localizedPath, type Locale } from '@/lib/i18n';

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

export function PharmacyRecruitmentListings({
  locale, profession, featured = false,
}: { locale: Locale; profession?: string; featured?: boolean }) {
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
    <section className={featured ? "my-6 rounded-2xl border border-border bg-accent-soft p-4 sm:p-6" : "my-6"} aria-labelledby="pharmacy-recruitment">
      <h2 className="mb-3 text-xl font-semibold text-fg" id="pharmacy-recruitment">
        {featured
          ? (en ? 'Featured jobs in pharmacy' : 'Annonces vedettes en pharmacie')
          : (en ? 'Recruiting for pharmacies' : 'Recrutement en pharmacie')}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map(({ href, title, rate, profession: role }) => (
          <article key={href} className="card flex flex-col items-start p-4 sm:p-5">
            <h3 className="font-semibold text-fg">
              <Link href={href} className="hover:text-accent hover:underline">{title}</Link>
            </h3>
            <p className="mt-1 text-sm text-accent">
              {en ? `Up to $${rate}/h on select assignments` : `Jusqu’à ${rate} $/h pour certains mandats`}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{en ? 'Multiple regions in Quebec' : 'Plusieurs régions du Québec'}</p>
            <Link
              href={localizedPath(locale, 'apply', `?profession=${encodeURIComponent(role)}`)}
              className="btn-primary btn-sm mt-4"
              aria-label={en ? `Apply for ${title}` : `Postuler comme ${title}`}
            >
              {en ? 'Apply' : 'Postuler'}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
