import { PharmacyCareersPage, pharmacyCareerMetadata } from '@/components/PharmacyCareersPage';

export const dynamic = 'force-dynamic';
export const metadata = pharmacyCareerMetadata('pharmacist', 'en');

export default function Page() {
  return <PharmacyCareersPage career="pharmacist" locale="en" />;
}
