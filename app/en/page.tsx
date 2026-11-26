import { unstable_noStore as noStore } from 'next/cache';
import { HomeAgencyProof, HomeEntry, HomeJobs, HomeSpotlight } from '@/components/HomeEntry';
import PublicLayout from '@/components/PublicLayout';
import SeoJsonLd from '@/components/SeoJsonLd';
import { withJobDeadline } from '@/lib/job-availability';
import { publicPageMetadata, webPageJsonLd } from '@/lib/seo';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { urgencyOrder } from '@/lib/utils';
import type { Job } from '@/types';

export const metadata = publicPageMetadata({
  title: 'Healthcare staffing in Quebec | Sanitas',
  description:
    'Find pharmacy and nursing jobs across Quebec or ask Agence Sanitas for help staffing your pharmacy or healthcare facility.',
  path: '/en',
  locale: 'en',
  frPath: '/',
  enPath: '/en',
});

const PARTNERS = [
  { name: 'McKesson', logo: '/logos/mckesson.svg' },
  { name: 'LGI Healthcare Solutions', logo: '/logos/lgi.png' },
  { name: 'Santé Québec', logo: '/logos/sante-quebec.svg' },
  { name: 'AmerisourceBergen', logo: '/logos/amerisourcebergen.svg' },
  { name: 'Groupe Santé Arbec', logo: '/logos/arbec.png' },
  { name: 'Groupe Champlain', logo: '/logos/champlain.png' },
  { name: 'CHSLD Saint-Lambert sur le Golf', logo: '/logos/chsld-saint-lambert.svg' },
  { name: 'Résidence Soleil', logo: '/logos/residence-soleil.png' },
];

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating?: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I am satisfied with the services of Agence Sanitas. The agents are welcoming, helpful and professional. They respond to my needs quickly and listen before proposing assignments.',
    author: 'Souad N.',
    role: 'Clinical nurse',
    rating: 5,
  },
  {
    quote:
      'Professional, flexible and human, with excellent ethical values. They listen to employees and respect availability. You really feel considered and respected.',
    author: 'Sisi D.',
    role: 'Beneficiary attendant',
    rating: 5,
  },
  {
    quote:
      'Very good agency. The supervisors handling schedules are polite, courteous, understanding and patient. I recommend them.',
    author: 'Charlotte M.',
    role: 'Nurse',
    rating: 5,
  },
  {
    quote:
      'It is the first agency where I feel they truly listen before offering me an assignment. The options match my availability.',
    author: 'Tamara F.',
    role: 'Clinical nurse',
    rating: 5,
  },
];

async function fetchUrgentJobs(): Promise<Job[]> {
  noStore();
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await withJobDeadline(supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active'))
      .in('urgency', ['urgent', 'high'])
      .order('created_at', { ascending: false })
      .limit(3);
    const jobs = (data || []) as Job[];
    return jobs.sort((a, b) => urgencyOrder(a.urgency) - urgencyOrder(b.urgency));
  } catch {
    return [];
  }
}

export default async function EnglishHomePage() {
  const urgentJobs = await fetchUrgentJobs();

  return (
    <PublicLayout locale="en">
      <SeoJsonLd
        id="home-page-schema-en"
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageJsonLd({
              name: 'Healthcare staffing agency in Quebec',
              description:
                'Find pharmacy and nursing jobs across Quebec or ask Agence Sanitas for help staffing your pharmacy or healthcare facility.',
              url: '/en',
              locale: 'en',
            }),
          ],
        }}
      />
      <HomeEntry locale="en" />
      <HomeSpotlight locale="en" />
      <HomeAgencyProof locale="en" />
      <HomeJobs locale="en" jobs={urgentJobs} />

      <section className="border-y border-border bg-surface py-10 sm:py-12">
        <div className="container-page">
          <h2 className="text-center text-sm font-semibold text-fg-muted">Trusted by healthcare organizations</h2>
          <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 items-center gap-x-5 gap-y-5 sm:grid-cols-4">
            {PARTNERS.map((partner) => <PartnerLogo key={partner.name} {...partner} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <h2 className="font-serif text-3xl tracking-tight text-fg sm:text-4xl">What candidates say about us</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial) => <TestimonialCard key={testimonial.author} testimonial={testimonial} />)}
        </div>
      </section>
    </PublicLayout>
  );
}

function PartnerLogo({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex h-14 w-full items-center justify-center px-3">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} loading="lazy" className="max-h-full max-w-full object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
      ) : (
        <span className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-fg-subtle leading-tight">
          {name}
        </span>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const rating = testimonial.rating ?? 5;
  return (
    <figure className="card p-5 flex flex-col h-full">
      <div className="flex items-center gap-0.5 text-accent" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} filled={index < rating} />
        ))}
      </div>
      <blockquote className="mt-4 text-[14.5px] leading-relaxed text-fg flex-1">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-5 pt-4 border-t border-border">
        <p className="text-[14px] font-medium text-fg">{testimonial.author}</p>
        <p className="text-[12.5px] text-fg-muted">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-3.5 w-3.5"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.3 2.8 1-5.9L1.5 7.7l5.9-.9z" />
    </svg>
  );
}
