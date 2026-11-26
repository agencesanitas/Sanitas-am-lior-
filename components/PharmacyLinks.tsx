import Image from 'next/image';
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

function pharmacyRoles(locale: Locale) {
  const en = locale === 'en';
  return [
    {
      profession: PHARMACIST,
      href: PHARMACY_PAGES.pharmacist[locale],
      title: en ? 'Pharmacist' : 'Pharmacien(ne)',
      rate: PHARMACY_PAY_MAX.pharmacist,
    },
    {
      profession: PHARMACY_ASSISTANT,
      href: PHARMACY_PAGES.assistant[locale],
      title: en ? 'Pharmacy assistant (ATP)' : 'Assistant(e) technique en pharmacie (ATP)',
      rate: PHARMACY_PAY_MAX.assistant,
    },
  ].map((role) => ({
    ...role,
    applyHref: localizedPath(locale, 'apply', `?profession=${encodeURIComponent(role.profession)}`),
    applyLabel: en ? `Apply for the ${role.title} role` : `Postuler comme ${role.title}`,
    rateLabel: en ? `$${role.rate}/h` : `${role.rate} $/h`,
  }));
}

export function PharmacySpotlight({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  return (
    <div className="grid h-full overflow-hidden rounded-2xl bg-[oklch(0.245_0.05_196)] text-white [&_a:focus-visible]:outline-white lg:grid-cols-[2fr_3fr]">
      <div className="relative order-last aspect-[16/9] lg:order-first lg:aspect-auto">
        <Image
          src="/images/sanitas-pharmacie-communautaire.webp"
          alt={en ? 'A pharmacist and an assistant in a community pharmacy' : 'Un pharmacien et un assistant dans une pharmacie communautaire'}
          fill
          sizes="(min-width: 1152px) 436px, (min-width: 1024px) 38vw, 100vw"
          className="object-cover object-[47%_46%]"
        />
      </div>
      <div className="p-5 sm:p-9 lg:p-10">
        <p className="text-sm font-semibold text-[oklch(0.91_0.072_173)]">{en ? 'Featured jobs' : 'Offres en vedette'}</p>
        <h2 className="mt-2 font-serif text-[clamp(2rem,4.35vw,3.75rem)] leading-none tracking-[-0.035em]">
          {en ? 'Community pharmacy' : 'Pharmacie communautaire'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
          {en ? 'Relief and permanent positions across Quebec.' : 'Remplacements et postes permanents dans plusieurs régions du Québec.'}
        </p>
        <ul className="mt-6 divide-y divide-white/25 border-y border-white/25">
          {pharmacyRoles(locale).map(({ href, title, rateLabel, applyHref, applyLabel }) => (
            <li key={href} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-5">
              <h3 className="text-base font-semibold leading-tight sm:text-lg">
                <Link href={href} className="underline decoration-white/45 underline-offset-4 transition-colors hover:text-[oklch(0.91_0.072_173)]">{title}</Link>
              </h3>
              <p className="flex flex-col items-end whitespace-nowrap leading-tight text-[oklch(0.91_0.072_173)]">
                <span className="text-xs">{en ? 'Up to' : 'Jusqu’à'}</span>
                <strong className="text-[1.55rem] font-bold tabular-nums sm:text-3xl">{rateLabel}</strong>
              </p>
              <Link href={applyHref} aria-label={applyLabel} className="col-span-2 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-[oklch(0.94_0.043_174)] px-3.5 text-sm font-bold text-[oklch(0.245_0.05_196)] transition-colors hover:bg-white sm:col-span-1">
                {en ? 'Apply' : 'Postuler'} <span aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-xs text-white/75">{en ? 'Rates vary by assignment.' : 'Taux selon le mandat.'}</p>
          <Link href={PHARMACY_PAGES.employer[locale]} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/50 underline-offset-4 hover:text-[oklch(0.91_0.072_173)]">
            {en ? 'Staff your pharmacy' : 'Recruter en pharmacie'} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PharmacyRecruitmentListings({ locale, profession }: { locale: Locale; profession?: string }) {
  const en = locale === 'en';
  const roles = pharmacyRoles(locale).filter((role) => !profession || role.profession === profession);
  if (!roles.length) return null;

  return (
    <section aria-labelledby="pharmacy-recruitment">
      <h2 id="pharmacy-recruitment" className="font-serif text-3xl tracking-tight text-fg">
        {en ? 'Recruiting for pharmacies' : 'Recrutement en pharmacie'}
      </h2>
      <p className="mt-2 text-sm text-fg-muted">{en ? 'Multiple regions in Quebec. Rates vary by assignment.' : 'Plusieurs régions du Québec. Taux selon le mandat.'}</p>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {roles.map(({ href, title, rateLabel, applyHref, applyLabel }) => (
          <li key={href} className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
            <h3 className="min-w-0 basis-full text-lg font-semibold text-fg sm:basis-auto sm:flex-1">
              <Link href={href} className="underline decoration-accent/40 underline-offset-4 hover:text-accent">{title}</Link>
            </h3>
            <p className="whitespace-nowrap text-sm text-fg-muted">{en ? 'Up to' : 'Jusqu’à'} <strong className="text-lg text-accent">{rateLabel}</strong></p>
            <Link href={applyHref} aria-label={applyLabel} className="btn-primary btn-sm ml-auto sm:ml-0">
              {en ? 'Apply' : 'Postuler'}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
