begin;

set local lock_timeout = '5s';
set local statement_timeout = '30s';

-- Publish the two multiregional recruitment campaigns created by migration v11.
-- Keep already published or withdrawn records under the recruiter's control.
update public.jobs
set
  status = 'active',
  description = $copy$Sanitas recrute pour des pharmacies communautaires dans plusieurs régions du Québec. Indiquez vos régions et vos disponibilités en postulant. L’équipe vous présentera les remplacements ou postes permanents qui correspondent à votre profil. Le lieu, l’horaire, la date de début et la rémunération sont confirmés pour chaque mandat.$copy$,
  description_en = $copy$Sanitas is recruiting for community pharmacies across Quebec. Tell us your preferred regions and availability when you apply. Our team will share relief assignments or permanent opportunities that match your profile. Location, hours, start date and pay are confirmed for each assignment.$copy$
where id in ('e4c3d41d-b983-4209-86c5-e6d063377d96', '3e42b083-d341-4f11-9404-b62293e8de0f')
  and status = 'draft'
  and region = 'Plusieurs régions du Québec'
  and city is null
  and published_at is null
  and application_deadline is null;

commit;
