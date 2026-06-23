'use client';

import { useEffect } from 'react';
import {
  SANITAS_CANDIDATE_LEAD_EVENT,
  SANITAS_CONVERSION_LABEL,
  SANITAS_GOOGLE_ADS_ID,
  trackAnalyticsEvent,
  trackCandidateLeadConversion,
} from '@/lib/analytics';

const DEFAULT_EVENT_NAME = SANITAS_CANDIDATE_LEAD_EVENT;
const DEFAULT_CONVERSION_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || SANITAS_GOOGLE_ADS_ID;
const DEFAULT_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || SANITAS_CONVERSION_LABEL;

export default function GoogleAdsConversionEvent({
  eventName = DEFAULT_EVENT_NAME,
  conversionId = DEFAULT_CONVERSION_ID,
  conversionLabel = DEFAULT_CONVERSION_LABEL,
  transactionId,
}: {
  eventName?: string;
  conversionId?: string;
  conversionLabel?: string;
  transactionId?: string | null;
}) {
  useEffect(() => {
    if (!transactionId) {
      trackAnalyticsEvent('candidate_application_thank_you_missing_transaction', {
        source_event: eventName,
      });
      return;
    }

    const fired = trackCandidateLeadConversion({
      transactionId,
      eventName,
      conversionId,
      conversionLabel,
      params: { source: 'thank_you_page' },
    });
    trackAnalyticsEvent('candidate_application_thank_you', {
      application_id: transactionId,
      transaction_id: transactionId,
      source_event: eventName,
      conversion_fired: fired,
    });
  }, [conversionId, conversionLabel, eventName, transactionId]);

  return null;
}
