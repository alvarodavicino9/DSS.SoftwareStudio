// Minimal stroke icons for the nav dock — hand-drawn, no icon library
// dependency. Consistent 24x24 viewBox, currentColor stroke.
const common = { viewBox: '0 0 24 24', width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function HomeIcon() {
  return (
    <svg {...common}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg {...common}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <circle cx="17.5" cy="9" r="2.3" />
      <path d="M15.7 15.3c2.6.4 4.3 2.1 4.3 4.7" />
    </svg>
  );
}

export function WrenchIcon() {
  return (
    <svg {...common}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
    </svg>
  );
}

export function StepsIcon() {
  return (
    <svg {...common}>
      <path d="M4 6h2" />
      <path d="M9 6h11" />
      <path d="M4 12h2" />
      <path d="M9 12h11" />
      <path d="M4 18h2" />
      <path d="M9 18h11" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg {...common}>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
