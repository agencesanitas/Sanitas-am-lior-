import { PharmacyStaffingPage, pharmacyStaffingMetadata } from '@/components/PharmacyStaffingPage';

export const metadata = pharmacyStaffingMetadata('fr');

export default function Page() {
  return <PharmacyStaffingPage locale="fr" />;
}
