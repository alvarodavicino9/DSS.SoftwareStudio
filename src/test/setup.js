import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement IntersectionObserver — every section uses
// useReveal(), which needs a stub to mount in tests.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub;

// jsdom doesn't implement matchMedia either — useReducedMotion() (used by
// useReveal(), which every section calls) reads it on mount.
window.matchMedia = window.matchMedia || function matchMedia(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener() {}, // deprecated, kept for older libs
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  };
};
