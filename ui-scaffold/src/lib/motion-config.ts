// Motion and animation configuration
// Respects prefers-reduced-motion and device capabilities

export interface MotionConfig {
  enableCursorBackground: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
}

let motionConfig: MotionConfig | null = null;

export function getMotionConfig(): MotionConfig {
  if (motionConfig) return motionConfig;

  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return {
      enableCursorBackground: false,
      prefersReducedMotion: false,
      isTouchDevice: false,
    };
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check if device supports touch
  const isTouchDevice = () => {
    return (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      ((navigator as any).msMaxTouchPoints > 0)
    );
  };

  motionConfig = {
    enableCursorBackground: !prefersReducedMotion && !isTouchDevice(),
    prefersReducedMotion,
    isTouchDevice: isTouchDevice(),
  };

  return motionConfig;
}

export function shouldReduceMotion(): boolean {
  return getMotionConfig().prefersReducedMotion;
}

export function isCursorBackgroundEnabled(): boolean {
  return getMotionConfig().enableCursorBackground;
}

export function disableCursorBackground(): void {
  if (motionConfig) {
    motionConfig.enableCursorBackground = false;
  }
}

export function enableCursorBackground(): void {
  if (motionConfig) {
    motionConfig.enableCursorBackground = true;
  }
}

// Animation variant helpers - use these to conditionally apply animations
export const animationVariants = {
  fadeIn: (disabled: boolean = false) => ({
    initial: { opacity: disabled ? 1 : 0 },
    animate: { opacity: 1 },
    transition: { duration: disabled ? 0 : 0.3 },
  }),
  slideUp: (disabled: boolean = false) => ({
    initial: { opacity: disabled ? 1 : 0, y: disabled ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: disabled ? 0 : 0.3 },
  }),
  slideDown: (disabled: boolean = false) => ({
    initial: { opacity: disabled ? 1 : 0, y: disabled ? 0 : -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: disabled ? 0 : 0.3 },
  }),
  scaleIn: (disabled: boolean = false) => ({
    initial: { opacity: disabled ? 1 : 0, scale: disabled ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: disabled ? 0 : 0.2 },
  }),
};

// Cursor background animation control (global toggle)
export let globalCursorBackgroundEnabled = true;

export function setCursorBackgroundGlobal(enabled: boolean): void {
  globalCursorBackgroundEnabled = enabled;
}

export function getCursorBackgroundGlobal(): boolean {
  return globalCursorBackgroundEnabled;
}
