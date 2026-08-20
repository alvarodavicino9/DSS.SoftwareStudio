// Icons for the Servicios cards — same hand-drawn minimal style as NavIcons.
const common = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export function ServerIcon() {
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="6" rx="1.6" />
      <rect x="3" y="14" width="18" height="6" rx="1.6" />
      <circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 7h7M11 17h7" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9Z" />
    </svg>
  );
}

export function RocketIcon() {
  return (
    <svg {...common}>
      <path d="M13.5 3.5c3 1 5 3 6 6-3 .3-5 1.3-6.5 2.8L9 15.3 8.7 12c1.5-1.5 2.5-3.5 2.8-6.5.9-.7 1.3-1.3 2-2Z" />
      <path d="M9 15.3 4.5 19.5 6 14M9 15.3l3-3" />
      <circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BotIcon() {
  return (
    <svg {...common}>
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
      <rect x="4" y="8" width="16" height="12" rx="2.4" />
      <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 17.3h6" />
      <path d="M2 12.5h2M20 12.5h2" />
    </svg>
  );
}
