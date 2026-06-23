export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export const SANITAS_GOOGLE_ADS_ID = 'AW-16550539966';
export const SANITAS_CONVERSION_LABEL = 'gsbXCNI-wLgaEL7l9NM9';
export const SANITAS_CANDIDATE_LEAD_EVENT = 'ads_conversion_Envoi_de_formulaire_pou_1';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[][];
  }
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  const defaultParams: AnalyticsParams = {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
  };

  const cleanedParams = Object.fromEntries(
    Object.entries({ ...defaultParams, ...params }).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  window.gtag('event', eventName, cleanedParams);
}

function normalizeGoogleAdsId(conversionId?: string) {
  const cleanedConversionId = conversionId?.trim() || SANITAS_GOOGLE_ADS_ID;
  return cleanedConversionId.startsWith('AW-') ? cleanedConversionId : `AW-${cleanedConversionId}`;
}

function normalizeGoogleAdsLabel(conversionLabel?: string) {
  const cleanedConversionLabel = conversionLabel?.trim() || SANITAS_CONVERSION_LABEL;
  return cleanedConversionLabel.toLowerCase() === SANITAS_CONVERSION_LABEL.toLowerCase()
    ? SANITAS_CONVERSION_LABEL
    : cleanedConversionLabel;
}

function markConversionDedupe(dedupeKey: string) {
  try {
    if (window.sessionStorage.getItem(dedupeKey) || window.localStorage.getItem(dedupeKey)) {
      return false;
    }
    window.sessionStorage.setItem(dedupeKey, '1');
    window.localStorage.setItem(dedupeKey, '1');
    return true;
  } catch {
    return true;
  }
}

export function trackCandidateLeadConversion({
  transactionId,
  eventName = SANITAS_CANDIDATE_LEAD_EVENT,
  conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || SANITAS_GOOGLE_ADS_ID,
  conversionLabel =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || SANITAS_CONVERSION_LABEL,
  params = {},
}: {
  transactionId?: string | null;
  eventName?: string;
  conversionId?: string;
  conversionLabel?: string;
  params?: AnalyticsParams;
}) {
  if (typeof window === 'undefined' || !transactionId) return false;

  const dedupeKey = `sanitas-conversion:${eventName}:${transactionId}`;
  if (!markConversionDedupe(dedupeKey)) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  const eventParams = {
    transaction_id: transactionId,
    ...Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ),
  };

  window.gtag('event', 'conversion', {
    send_to: `${normalizeGoogleAdsId(conversionId)}/${normalizeGoogleAdsLabel(conversionLabel)}`,
    ...eventParams,
  });

  window.gtag('event', eventName, eventParams);
  return true;
}
