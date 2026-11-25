begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

alter table public.jobs
  add column if not exists application_deadline date,
  add column if not exists published_at timestamptz;

alter table public.establishment_requests
  add column if not exists mandate_type text;

create or replace function public.set_job_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'active' and new.published_at is null then
    if tg_op = 'UPDATE' and old.status = 'active' then
      new.published_at := old.created_at;
    else
      new.published_at := now();
    end if;
  end if;
  return new;
end;
$$;

create or replace trigger trg_jobs_published_at before insert or update on public.jobs
for each row execute function public.set_job_published_at();

alter policy "public read active jobs" on public.jobs
  to anon, authenticated
  using (
    status = 'active' and (
      application_deadline is null or application_deadline >= (now() at time zone 'America/Toronto')::date
    )
  );

insert into public.jobs (
  id, title, title_en, description, description_en, profession, region, salary, salary_en,
  requirements, requirements_en, required_documents, status
)
values
  (
    'e4c3d41d-b983-4209-86c5-e6d063377d96',
    'Pharmacien(ne) en pharmacie communautaire', 'Community pharmacist',
    'Poste en pharmacie communautaire. Le lieu et les conditions seront précisés pour le besoin confirmé.',
    'Community pharmacy position. The location and terms will be added when the opening is confirmed.',
    'Pharmacien(ne)', 'Plusieurs régions du Québec', 'Jusqu’à 150 $/h, selon le mandat', 'Up to $150/hour, depending on the assignment',
    'Permis d’exercice valide et inscription au tableau de l’Ordre des pharmaciens du Québec.',
    'Valid licence and current registration with the Ordre des pharmaciens du Québec.',
    array['CV'], 'draft'
  ),
  (
    '3e42b083-d341-4f11-9404-b62293e8de0f',
    'Assistant(e) technique en pharmacie (ATP)', 'Pharmacy assistant (ATP)',
    'Poste d’assistance technique auprès de l’équipe d’une pharmacie communautaire. Le lieu et les conditions seront précisés pour le besoin confirmé.',
    'Support the pharmacy team in a community pharmacy. The location and terms will be added when the opening is confirmed.',
    'Assistant(e) technique en pharmacie (ATP)', 'Plusieurs régions du Québec', 'Jusqu’à 50 $/h, selon le mandat', 'Up to $50/hour, depending on the assignment',
    'Indiquer la formation en assistance technique et l’expérience pertinente en pharmacie.',
    'Provide details on pharmacy assistant training and relevant pharmacy experience.',
    array['CV'], 'draft'
  )
on conflict (id) do nothing;

commit;
