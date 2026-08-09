'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  QUEBEC_REGIONS,
  PROFESSIONS,
  SHIFTS,
  MANDATE_TYPES,
  ALL_DEPARTMENTS,
  JOB_COUNTRIES,
  DEFAULT_JOB_COUNTRY,
  isInternationalCountry,
} from '@/lib/constants';
import { PUBLIC_COPY, displayValue, localizedPath, optionLabel, type Locale } from '@/lib/i18n';
import { useLocale } from './I18nProvider';

const URGENCIES = [
  { value: '', label: { fr: 'Toutes', en: 'All' } },
  { value: 'urgent', label: { fr: 'Urgent', en: 'Urgent' } },
  { value: 'high', label: { fr: 'Prioritaire', en: 'Priority' } },
  { value: 'normal', label: { fr: 'Normal', en: 'Regular' } },
];

interface FilterState {
  profession: string;
  country: string;
  region: string;
  city: string;
  establishment: string;
  department: string;
  shift: string;
  mandate_type: string;
  urgency: string;
}

export default function JobFilters({ locale: localeProp }: { locale?: Locale }) {
  const contextLocale = useLocale();
  const locale = localeProp || contextLocale;
  const router = useRouter();
  const params = useSearchParams();
  const copy = PUBLIC_COPY[locale];

  const [filters, setFilters] = useState<FilterState>({
    profession: params.get('profession') || '',
    country: params.get('country') || '',
    region: params.get('region') || '',
    city: params.get('city') || '',
    establishment: params.get('establishment') || '',
    department: params.get('department') || '',
    shift: params.get('shift') || '',
    mandate_type: params.get('mandate_type') || '',
    urgency: params.get('urgency') || '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setFilters({
      profession: params.get('profession') || '',
      country: params.get('country') || '',
      region: params.get('region') || '',
      city: params.get('city') || '',
      establishment: params.get('establishment') || '',
      department: params.get('department') || '',
      shift: params.get('shift') || '',
      mandate_type: params.get('mandate_type') || '',
      urgency: params.get('urgency') || '',
    });
  }, [params]);

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function apply() {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v) sp.set(k, v);
    }
    router.push(
      `${localizedPath(locale, 'jobs')}${sp.toString() ? `?${sp.toString()}` : ''}#resultats`
    );
  }

  function reset() {
    setFilters({
      profession: '',
      country: '',
      region: '',
      city: '',
      establishment: '',
      department: '',
      shift: '',
      mandate_type: '',
      urgency: '',
    });
    router.push(localizedPath(locale, 'jobs'));
  }

  const selectedCountry = filters.country || DEFAULT_JOB_COUNTRY;
  const internationalFilter = isInternationalCountry(selectedCountry);
  const advancedFilterCount = [
    filters.country,
    filters.city,
    filters.establishment,
    filters.shift,
    filters.mandate_type,
    filters.urgency,
  ].filter(Boolean).length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="card p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between md:hidden">
        <div>
          <h2 className="text-[17px] font-semibold text-fg">
            {locale === 'en' ? 'Refine your search' : 'Affinez votre recherche'}
          </h2>
          <p className="mt-0.5 text-[14px] text-fg-muted">
            {locale === 'en'
              ? 'Start with a profession, region or department.'
              : 'Commencez par une profession, une région ou un département.'}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-4 text-[14px] font-medium text-fg transition-colors hover:border-accent/40 hover:text-accent"
          aria-expanded={showAdvanced}
          aria-controls="advanced-job-filters"
          onClick={() => setShowAdvanced((value) => !value)}
        >
          {showAdvanced
            ? locale === 'en'
              ? 'Fewer filters'
              : 'Moins de filtres'
            : locale === 'en'
              ? `More filters${advancedFilterCount ? ` (${advancedFilterCount})` : ''}`
              : `Plus de filtres${advancedFilterCount ? ` (${advancedFilterCount})` : ''}`}
        </button>
      </div>

      <div id="advanced-job-filters" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label" htmlFor="f-profession">
            {locale === 'en' ? 'Profession' : 'Profession'}
          </label>
          <select
            id="f-profession"
            className="input"
            value={filters.profession}
            onChange={(e) => update('profession', e.target.value)}
          >
            <option value="">{copy.common.allFem}</option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {optionLabel(locale, p)}
              </option>
            ))}
          </select>
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-country">
            {copy.jobs.country}
          </label>
          <select
            id="f-country"
            className="input"
            value={filters.country}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">{copy.common.all}</option>
            {JOB_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {displayValue(locale, country)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="f-region">
            {internationalFilter ? copy.jobs.territory : copy.jobs.region}
          </label>
          {internationalFilter ? (
            <input
              id="f-region"
              className="input"
              type="text"
              placeholder={locale === 'en' ? 'Riyadh, Jeddah...' : 'Riyad, Djeddah...'}
              value={filters.region}
              onChange={(e) => update('region', e.target.value)}
            />
          ) : (
            <select
              id="f-region"
              className="input"
              value={filters.region}
              onChange={(e) => update('region', e.target.value)}
            >
              <option value="">{copy.common.allFem}</option>
              {QUEBEC_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-city">
            {copy.jobs.city}
          </label>
          <input
            id="f-city"
            className="input"
            type="text"
            placeholder="Laval"
            value={filters.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-establishment">
            {copy.jobs.establishment}
          </label>
          <input
            id="f-establishment"
            className="input"
            type="text"
            placeholder={locale === 'en' ? 'Facility name' : "Nom de l’établissement"}
            value={filters.establishment}
            onChange={(e) => update('establishment', e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-department">
            {copy.jobs.department}
          </label>
          <select
            id="f-department"
            className="input"
            value={filters.department}
            onChange={(e) => update('department', e.target.value)}
          >
            <option value="">{copy.common.all}</option>
            {ALL_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {displayValue(locale, d)}
              </option>
            ))}
          </select>
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-shift">
            {copy.jobs.shift}
          </label>
          <select
            id="f-shift"
            className="input"
            value={filters.shift}
            onChange={(e) => update('shift', e.target.value)}
          >
            <option value="">{copy.common.all}</option>
            {SHIFTS.map((s) => (
              <option key={s} value={s}>
                {displayValue(locale, s)}
              </option>
            ))}
          </select>
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-mandate">
            {copy.jobs.mandateType}
          </label>
          <select
            id="f-mandate"
            className="input"
            value={filters.mandate_type}
            onChange={(e) => update('mandate_type', e.target.value)}
          >
            <option value="">{copy.common.all}</option>
            {MANDATE_TYPES.map((m) => (
              <option key={m} value={m}>
                {displayValue(locale, m)}
              </option>
            ))}
          </select>
        </div>

        <div className={showAdvanced ? 'block' : 'hidden md:block'}>
          <label className="label" htmlFor="f-urgency">
            {locale === 'en' ? 'Urgency' : 'Urgence'}
          </label>
          <select
            id="f-urgency"
            className="input"
            value={filters.urgency}
            onChange={(e) => update('urgency', e.target.value)}
          >
            {URGENCIES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 sm:flex sm:flex-wrap">
        <button type="submit" className="btn-primary">
          {locale === 'en' ? 'Show jobs' : 'Afficher les postes'}
        </button>
        <button type="button" onClick={reset} className="btn-secondary">
          {locale === 'en' ? 'Reset' : 'Réinitialiser'}
        </button>
      </div>
    </form>
  );
}
