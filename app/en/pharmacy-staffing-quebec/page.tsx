import { PharmacyStaffingPage, pharmacyStaffingMetadata } from '@/components/PharmacyStaffingPage';

export const metadata = pharmacyStaffingMetadata('en');

export default function Page() {
  return <PharmacyStaffingPage locale="en" />;
}
