'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PROFESSIONS, QUEBEC_REGIONS } from '@/lib/constants';
import { localizedPath, optionLabel, type Locale } from '@/lib/i18n';
import { useLocale } from './I18nProvider';

export default function HomeSearch({ locale: localeProp }: { locale?: Locale }) {
  const contextLocale = useLocale();
  const locale = localeProp || contextLocale;
  const router = useRouter();
  const [profession, setProfession] = useState('');
  const [region, setRegion] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (profession) sp.set('profession', profession);
    if (region) sp.set('region', region);
    router.push(`${localizedPath(locale, 'jobs')}${sp.toString() ? `?${sp.toString()}` : ''}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-2 rounded-xl border border-border bg-muted/60 p-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:p-3"
    >
      <select
        className="input"
        aria-label="Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
      >
        <option value="">{locale === 'en' ? 'All professions' : 'Toutes les professions'}</option>
        {PROFESSIONS.map((p) => (
          <option key={p} value={p}>
            {optionLabel(locale, p)}
          </option>
        ))}
      </select>
      <select
        className="input"
        aria-label={locale === 'en' ? 'Region' : 'Région'}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">{locale === 'en' ? 'All regions' : 'Toutes les régions'}</option>
        {QUEBEC_REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-primary rounded-lg px-6">
        {locale === 'en' ? 'Search' : 'Rechercher'}
      </button>
    </form>
  );
}
