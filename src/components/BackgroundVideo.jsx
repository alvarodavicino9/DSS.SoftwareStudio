import { useEffect, useRef } from 'react';

const SENSITIVITY = 1.4;
// Hosted locally (public/videos/) instead of the external CDN — re-encoded
// at 720p with a short keyframe interval (every ~15 frames) so arbitrary
// seeks during scrubbing decode fast instead of chaining from a distant
// keyframe. See public/videos/README for the ffmpeg command used.
const VIDEO_SRC = '/videos/aria-hero.mp4';
// Floor between actual seeks. Seeking a video decodes a fresh frame, which is
// the expensive part — this caps how often we ask for one, independent of
// how fast the mouse (or the display's refresh rate) is moving. The lighter
// re-encoded video buys headroom for a tighter interval than before.
const MIN_SEEK_INTERVAL_MS = 28; // ~35 seeks/sec
// Skip seeks that would move less than this — not perceptible, not worth a decode.
const MIN_TIME_DELTA = 0.012;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * A.R.I.A's hero backdrop — never autoplays, instead it's "scrubbed" by
 * mouse movement (any direction, not just left/right), like a filmstrip.
 * Confined to the Hero section (absolute, not viewport-fixed) since the
 * rest of the page has its own light background and sections below
 * shouldn't show it through.
 *
 * Perf: raw `mousemove` can fire far faster than the screen can repaint
 * (100–1000+ times/sec depending on the mouse). Seeking a video is
 * expensive — it decodes a new frame — so reacting to every single event
 * is what made this feel heavy. Instead we accumulate movement and settle
 * on one seek per animation frame (~60/sec, matched to what the browser
 * can actually show), which is both smoother and far lighter on the CPU.
 *
 * It also only does any of this while the video is actually on screen — an
 * IntersectionObserver detaches the mousemove listener and stops the
 * animation-frame loop entirely once you scroll past the Hero, so it isn't
 * competing with scroll compositing for the rest of the page.
 */
export default function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetTime = 0;
    let seeking = false;
    let durationReady = false;
    let pendingDx = 0;
    let pendingDy = 0;
    let rafId = null;
    let lastSeekAt = 0;
    let active = false;

    const seekTo = (time) => {
      targetTime = time;
      lastSeekAt = performance.now();
      if (!seeking) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    const handleLoadedMetadata = () => {
      durationReady = Number.isFinite(video.duration) && video.duration > 0;
      targetTime = video.currentTime;
    };

    const handleSeeked = () => {
      // If the target moved again while this seek was in flight, chase it —
      // but only once we're past the minimum interval, otherwise wait for
      // the next scheduled flush.
      const readyForNext = performance.now() - lastSeekAt >= MIN_SEEK_INTERVAL_MS;
      if (readyForNext && Math.abs(video.currentTime - targetTime) > MIN_TIME_DELTA) {
        video.currentTime = targetTime;
        lastSeekAt = performance.now();
      } else {
        seeking = false;
      }
    };

    const flush = () => {
      rafId = requestAnimationFrame(flush);

      if (!durationReady || (pendingDx === 0 && pendingDy === 0)) return;
      if (performance.now() - lastSeekAt < MIN_SEEK_INTERVAL_MS) return;

      // Any direction scrubs — horizontal and vertical movement both add up.
      const delta = pendingDx + pendingDy;
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const base = seeking ? targetTime : video.currentTime;
      const next = clamp(base + offset, 0, video.duration);

      // Below the threshold — leave pendingDx/Dy accumulating rather than
      // discarding this movement, so slow/tiny drags aren't just dropped.
      if (Math.abs(next - base) < MIN_TIME_DELTA) return;

      pendingDx = 0;
      pendingDy = 0;
      seekTo(next);
    };

    const handleMouseMove = (event) => {
      if (!durationReady) return;
      pendingDx += event.movementX;
      pendingDy += event.movementY;
    };

    const start = () => {
      if (active) return;
      active = true;
      window.addEventListener('mousemove', handleMouseMove);
      rafId = requestAnimationFrame(flush);
    };

    const stop = () => {
      if (!active) return;
      active = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingDx = 0;
      pendingDy = 0;
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    visibilityObserver.observe(video);

    return () => {
      visibilityObserver.disconnect();
      stop();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      poster="/videos/aria-hero-poster.jpg"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: '70% center',
      }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  );
}
