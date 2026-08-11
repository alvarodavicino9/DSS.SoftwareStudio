/**
 * Brand lockup, recreated in SVG from the client's logo file — the
 * "<DSS/>" mark in the violet -> cyan gradient, plus the wordmark and
 * tagline.
 * - `variant="full"` (default): full horizontal lockup, used in the nav.
 * - `variant="mark"`: just the bracket mark, transparent background
 *   (footer, inline usage).
 * - `variant="icon"`: mark on a rounded square badge — app-icon / social
 *   avatar context (matches public/icon.svg).
 *
 * `light`: render the "full" lockup in white — for use on the brand-gradient
 * nav bar, where the default dark wordmark and gradient-fill mark (which is
 * the same violet/cyan as the background) would be unreadable.
 */
export default function Logo({ variant = 'full', height = 30, style, light = false }) {
  const gradId = 'dss-mark-gradient';

  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 64 64" height={height} width={height} style={{ display: 'block', ...style }} role="img" aria-label="DS.SoftwareStudio">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent, #8b7cf6)" />
            <stop offset="1" stopColor="var(--color-accent-2, #2fc8db)" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="var(--color-text, #14151f)" />
        <text x="32" y="41" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="21" fill={`url(#${gradId})`}>
          &lt;DSS/&gt;
        </text>
      </svg>
    );
  }

  if (variant === 'mark') {
    return (
      // viewBox widened to 170 (was 120 — way too narrow for "<DSS/>" at
      // fontSize 38, which was clipping the closing ">" off entirely).
      // overflow:visible is a defensive backstop on top of that.
      <svg
        viewBox="0 0 170 60"
        height={height}
        style={{ display: 'block', overflow: 'visible', ...style }}
        role="img"
        aria-label="DS.SoftwareStudio"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent, #8b7cf6)" />
            <stop offset="1" stopColor="var(--color-accent-2, #2fc8db)" />
          </linearGradient>
        </defs>
        <text x="0" y="42" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="38" fill={`url(#${gradId})`} letterSpacing="-1">
          &lt;DSS/&gt;
        </text>
      </svg>
    );
  }

  return (
    // viewBox widened to 375, tagline bumped from fontSize 9 to 11 (was
    // illegible at real nav render size) with letterSpacing trimmed to
    // compensate so it still fits without clipping. overflow:visible as a
    // backstop in case any future copy runs long again.
    <svg
      viewBox="0 0 375 60"
      height={height}
      style={{ display: 'block', overflow: 'visible', ...style }}
      role="img"
      aria-label="DS.SoftwareStudio"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-accent, #8b7cf6)" />
          <stop offset="1" stopColor="var(--color-accent-2, #2fc8db)" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="42"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="38"
        fill={light ? '#ffffff' : `url(#${gradId})`}
        letterSpacing="-1"
      >
        &lt;DSS/&gt;
      </text>
      <text
        x="172"
        y="31"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="21"
        fill={light ? '#ffffff' : 'var(--color-text, #14151f)'}
      >
        SoftwareStudio
      </text>
      <text
        x="172"
        y="48"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="1"
        fill={light ? 'rgba(255,255,255,0.85)' : 'var(--text-tertiary, #7a7f92)'}
      >
        SOFTWARE ENGINEERING STUDIO
      </text>
      <rect x="172" y="52" width="14" height="1.4" fill={light ? '#ffffff' : 'var(--color-accent-2, #2fc8db)'} />
    </svg>
  );
}
