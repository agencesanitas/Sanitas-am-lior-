import { PharmacyCareersPage, pharmacyCareerMetadata } from '@/components/PharmacyCareersPage';

export const dynamic = 'force-dynamic';
export const metadata = pharmacyCareerMetadata('assistant', 'en');

export default function Page() {
  return <PharmacyCareersPage career="assistant" locale="en" />;
}
