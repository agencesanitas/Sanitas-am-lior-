'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

const PANELS = ['nursing', 'pharmacy'] as const;
const INTERVAL_MS = 10000;

type Panel = (typeof PANELS)[number];
type Rotation = 'auto' | 'playing' | 'paused';

export default function HomeSpotlightCarousel({ locale, nursing, pharmacy }: {
  locale: Locale;
  nursing: ReactNode;
  pharmacy: ReactNode;
}) {
  const en = locale === 'en';
  const region = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Panel>('nursing');
  const [rotation, setRotation] = useState<Rotation>('auto');
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const playing = rotation === 'playing' || (rotation === 'auto' && motionAllowed);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const syncPreference = () => setMotionAllowed(preference.matches);
    const syncHash = () => {
      if (window.location.hash === '#pharmacie') {
        setActive('pharmacy');
        setRotation('paused');
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.25),
      { threshold: 0.25 },
    );

    syncPreference();
    syncHash();
    if (region.current) observer.observe(region.current);
    preference.addEventListener('change', syncPreference);
    window.addEventListener('hashchange', syncHash);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', syncPreference);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  useEffect(() => {
    if (!playing || !visible || hovered) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((panel) => panel === 'nursing' ? 'pharmacy' : 'nursing');
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing, visible, hovered]);

  function select(panel: Panel) {
    setActive(panel);
    setRotation('paused');
    if (panel === 'nursing' && window.location.hash === '#pharmacie') {
      window.history.replaceState(window.history.state, '', '#offres-en-vedette');
    }
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>) {
    const next = {
      Home: 'nursing',
      End: 'pharmacy',
      ArrowLeft: active === 'nursing' ? 'pharmacy' : 'nursing',
      ArrowRight: active === 'nursing' ? 'pharmacy' : 'nursing',
    } as const;
    const panel = next[event.key as keyof typeof next];
    if (!panel) return;
    event.preventDefault();
    select(panel);
    document.getElementById(`spotlight-tab-${panel}`)?.focus();
  }

  const label = en ? 'Featured opportunities' : 'Offres en vedette';
  const rotationLabel = playing
    ? (en ? 'Pause automatic rotation' : 'Mettre le défilement en pause')
    : (en ? 'Start automatic rotation' : 'Démarrer le défilement');
  const slides = {
    nursing: { title: en ? 'Nursing' : 'Soins infirmiers', content: nursing },
    pharmacy: { title: en ? 'Pharmacy' : 'Pharmacie', content: pharmacy },
  };

  return (
    <section
      ref={region}
      id="offres-en-vedette"
      aria-label={label}
      aria-roledescription={en ? 'carousel' : 'carrousel'}
      className="container-page relative scroll-mt-20"
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setRotation('paused');
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <span id="pharmacie" className="absolute top-0 scroll-mt-20" />
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={rotationLabel}
          title={rotationLabel}
          onClick={() => setRotation(playing ? 'paused' : 'playing')}
          className="order-last inline-grid size-11 shrink-0 place-items-center rounded-full border border-border bg-bg text-fg-muted transition-colors hover:bg-muted hover:text-fg"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-current">
            <path d={playing ? 'M5 4h3v12H5zm7 0h3v12h-3z' : 'M6 3.5v13l10-6.5z'} />
          </svg>
        </button>
        <div role="tablist" aria-label={label} className="flex items-center gap-1">
          {PANELS.map((panel) => (
            <button
              key={panel}
              type="button"
              role="tab"
              id={`spotlight-tab-${panel}`}
              aria-selected={active === panel}
              aria-controls={`spotlight-panel-${panel}`}
              tabIndex={active === panel ? 0 : -1}
              onClick={() => select(panel)}
              onKeyDown={navigateTabs}
              className={cn(
                'min-h-11 rounded-full px-3 text-sm font-semibold transition-colors sm:px-5',
                active === panel ? 'bg-fg text-bg' : 'text-fg-muted hover:bg-muted hover:text-fg',
              )}
            >
              {slides[panel].title}
            </button>
          ))}
        </div>
      </div>
      <div className="grid">
        {PANELS.map((panel) => (
          <div
            key={panel}
            id={`spotlight-panel-${panel}`}
            role="tabpanel"
            aria-labelledby={`spotlight-tab-${panel}`}
            aria-hidden={active !== panel}
            tabIndex={active === panel ? 0 : -1}
            className={cn('col-start-1 row-start-1 min-w-0', active !== panel && 'invisible')}
          >
            {slides[panel].content}
          </div>
        ))}
      </div>
    </section>
  );
}
