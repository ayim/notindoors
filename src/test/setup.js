import '@testing-library/jest-dom/vitest';

// Recharts needs ResizeObserver and non-zero container sizes in JSDOM.
if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  if (!global.ResizeObserver) {
    global.ResizeObserver = ResizeObserver;
  }

  if (!HTMLElement.prototype.getBoundingClientRect._patchedForVitest) {
    const fixedBox = {
      width: 1200,
      height: 800,
      top: 0,
      left: 0,
      right: 1200,
      bottom: 800,
    };
    HTMLElement.prototype.getBoundingClientRect = () => fixedBox;
    HTMLElement.prototype.getBoundingClientRect._patchedForVitest = true;
  }

  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')?.get) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1200,
    });
  }

  if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')?.get) {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 800,
    });
  }
}

