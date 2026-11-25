'use client';

import { useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import DocumentUploadChoice from '@/components/DocumentUploadChoice';
import { PERMIT_STATUSES, QUEBEC_REGIONS, START_AVAILABILITY } from '@/lib/constants';
import { displayValue, localizedPath, type Locale } from '@/lib/i18n';
import { DSQ_ACCESS_OPTIONS, PHARMACY_MANDATE_TYPES, PHARMACY_SOFTWARE, type DsqAccess } from '@/lib/pharmacy';
import { emptyRegionChoice, type FormState } from './form-state';

type Props = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  locale: Locale;
  jobTitle?: string | null;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
  draftBanner?: ReactNode;
};

export default function PharmacistQuickForm({
  form, setForm, locale, jobTitle, onSubmit, submitting, submitError, draftBanner,
}: Props) {
  const en = locale === 'en';
  const t = (fr: string, enText: string) => en ? enText : fr;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const selectedRegions = form.region_choices.filter(({ region }) => QUEBEC_REGIONS.includes(region));
  const mandateTypes = form.pharmacy_mandate_types || [];
  const software = form.pharmacy_software || [];
  const cv = form.documents.CV;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggle(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || uploading) return;
    setError('');
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError(t('Indiquez votre prénom et votre nom.', 'Enter your first and last name.'));
    } else if (!jobTitle && selectedRegions.length === 0) {
      setError(t('Choisissez au moins une région ou tout le Québec.', 'Choose at least one region or all of Quebec.'));
      event.currentTarget.querySelector('details[data-regions] summary')?.scrollIntoView({ block: 'center' });
    } else if (cv?.status !== 'Reçu' || !cv.file_path) {
      setError(t('Ajoutez votre CV pour envoyer la candidature.', 'Add your resume to send the application.'));
    } else {
      onSubmit();
    }
  }

  return (
    <section className="section pt-10 sm:pt-14">
      <div className="container-page max-w-3xl">
        <h1 className="text-display-md text-fg">
          {t('Postuler comme pharmacien(ne)', 'Apply as a pharmacist')}
        </h1>
        <p className="mt-2 text-fg-muted">
          {jobTitle || t('Remplacements et postes permanents en pharmacie communautaire au Québec.', 'Relief and permanent work in community pharmacies across Quebec.')}
        </p>
        {draftBanner && <div className="mt-5">{draftBanner}</div>}

        <form onSubmit={submit} className="mt-6 space-y-7 rounded-2xl border border-border bg-surface p-4 sm:p-7">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-lg font-semibold text-fg">{t('Vos coordonnées', 'Contact details')}</legend>
            <label className="block">
              <span className="label">{t('Prénom', 'First name')}</span>
              <input className="input" autoComplete="given-name" value={form.first_name} required maxLength={120} onChange={(e) => update('first_name', e.target.value)} />
            </label>
            <label className="block">
              <span className="label">{t('Nom', 'Last name')}</span>
              <input className="input" autoComplete="family-name" value={form.last_name} required maxLength={120} onChange={(e) => update('last_name', e.target.value)} />
            </label>
            <label className="block">
              <span className="label">{t('Courriel', 'Email')}</span>
              <input className="input" type="email" autoComplete="email" value={form.email} required maxLength={200} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label className="block">
              <span className="label">{t('Téléphone (facultatif)', 'Phone (optional)')}</span>
              <input className="input" type="tel" autoComplete="tel" value={form.phone} maxLength={40} onChange={(e) => update('phone', e.target.value)} />
            </label>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-lg font-semibold text-fg">{t('Permis et accès', 'Licence and access')}</legend>
            <label className="block">
              <span className="label">{t('Statut de votre permis à l’OPQ', 'OPQ licence status')}</span>
              <select className="input" required value={form.permit_status} onChange={(e) => update('permit_status', e.target.value)}>
                <option value="">{t('Choisir', 'Select')}</option>
                {PERMIT_STATUSES.map((status) => <option key={status} value={status}>{displayValue(locale, status)}</option>)}
              </select>
            </label>
            {form.permit_status !== 'Non' && (
              <label className="block">
                <span className="label">{t('Numéro de permis (facultatif)', 'Licence number (optional)')}</span>
                <input className="input" maxLength={40} value={form.permit_number} onChange={(e) => update('permit_number', e.target.value)} />
              </label>
            )}
            <label className="block sm:col-span-2">
              <span className="label">{t('Avez-vous déjà accès au Dossier santé Québec (DSQ) ?', 'Do you already have access to the Dossier santé Québec (DSQ)?')}</span>
              <select className="input" value={form.pharmacist_dsq || 'unsure'} onChange={(e) => update('pharmacist_dsq', e.target.value as DsqAccess)}>
                {DSQ_ACCESS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option[locale]}</option>)}
              </select>
              <span className="mt-2 block text-sm text-fg-muted">
                {t('La pharmacie confirme les autorisations nécessaires pour le lieu de pratique.', 'The pharmacy confirms the permissions needed for the practice location.')}
              </span>
            </label>
            <details className="rounded-lg border border-border p-3 sm:col-span-2">
              <summary className="cursor-pointer font-medium text-fg">
                {t('Logiciels de pharmacie maîtrisés (facultatif)', 'Pharmacy software you know (optional)')}
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PHARMACY_SOFTWARE.map((name) => (
                  <label key={name} className="flex min-h-10 items-center gap-2 text-sm">
                    <input type="checkbox" checked={software.includes(name)} onChange={() => update('pharmacy_software', toggle(software, name))} />
                    {name}
                  </label>
                ))}
              </div>
              <label className="mt-2 block">
                <span className="label">{t('Autre logiciel', 'Other software')}</span>
                <input className="input" maxLength={120} value={form.pharmacy_other_software || ''} onChange={(e) => update('pharmacy_other_software', e.target.value)} />
              </label>
            </details>
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="mb-3 text-lg font-semibold text-fg">{t('Vos disponibilités', 'Availability')}</legend>
            {!jobTitle && (
              <>
                <details data-regions className="rounded-lg border border-border p-3">
                  <summary className="cursor-pointer font-medium">
                    {t('Régions où vous souhaitez travailler', 'Regions where you want to work')}
                    {selectedRegions.length ? ` (${selectedRegions.length})` : ''}
                  </summary>
                  <label className="mt-3 flex min-h-10 items-center gap-2 font-medium">
                    <input type="checkbox" checked={selectedRegions.length === QUEBEC_REGIONS.length} onChange={(e) => update('region_choices', e.target.checked ? QUEBEC_REGIONS.map(emptyRegionChoice) : [])} />
                    {t('Partout au Québec', 'Anywhere in Quebec')}
                  </label>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {QUEBEC_REGIONS.map((region) => (
                      <label key={region} className="flex min-h-9 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedRegions.some((choice) => choice.region === region)}
                          onChange={(e) => update('region_choices', e.target.checked
                            ? [...selectedRegions, emptyRegionChoice(region)]
                            : selectedRegions.filter((choice) => choice.region !== region))}
                        />
                        {region}
                      </label>
                    ))}
                  </div>
                </details>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {PHARMACY_MANDATE_TYPES.map((type) => (
                    <label key={type} className="flex min-h-10 items-center gap-2 text-sm">
                      <input type="checkbox" checked={mandateTypes.includes(type)} onChange={() => update('pharmacy_mandate_types', toggle(mandateTypes, type))} />
                      {type === 'Permanent' ? t('Poste permanent', 'Permanent position') : t('Remplacement', 'Relief work')}
                    </label>
                  ))}
                </div>
              </>
            )}
            <label className="block">
              <span className="label">{t('Disponible à partir de (facultatif)', 'Available from (optional)')}</span>
              <select className="input" value={form.start_availability} onChange={(e) => update('start_availability', e.target.value)}>
                <option value="">{t('Choisir ou préciser plus tard', 'Select or share later')}</option>
                {START_AVAILABILITY.map((option) => <option key={option} value={option}>{displayValue(locale, option)}</option>)}
              </select>
            </label>
          </fieldset>

          <DocumentUploadChoice
            documentType="CV"
            required
            reused={!!cv?.file_path}
            value={cv}
            onUploadingChange={setUploading}
            onChange={(document) => update('documents', { ...form.documents, CV: document })}
            locale={locale}
          />

          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input className="mt-1" type="checkbox" required checked={form.consent_data} onChange={(e) => update('consent_data', e.target.checked)} />
            <span>
              {t('J’autorise Sanitas à utiliser mes renseignements pour traiter ma candidature et me contacter.', 'I agree that Sanitas may use my information to review my application and contact me.')}{' '}
              <a href={localizedPath(locale, 'privacy')} className="text-accent underline" target="_blank" rel="noreferrer">{t('Politique de confidentialité', 'Privacy policy')}</a>
            </span>
          </label>
          {(error || submitError) && <p role="alert" className="text-sm font-medium text-danger">{error || submitError}</p>}
          <button className="btn-primary w-full sm:w-auto" type="submit" disabled={submitting || uploading}>
            {submitting ? t('Envoi…', 'Sending…') : t('Envoyer ma candidature', 'Send my application')}
          </button>
        </form>
      </div>
    </section>
  );
}
