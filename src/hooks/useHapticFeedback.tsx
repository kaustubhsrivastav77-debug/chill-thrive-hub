import { useCallback } from "react";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection";

interface HapticOptions {
  pattern?: HapticPattern;
  duration?: number;
}

// Vibration patterns in milliseconds
const vibrationPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: 5,
};

export function useHapticFeedback() {
  const trigger = useCallback(({ pattern = "light", duration }: HapticOptions = {}) => {
    // Check if the Vibration API is available
    if (!("vibrate" in navigator)) {
      return false;
    }

    try {
      // Get the vibration pattern
      const vibrationDuration = duration || vibrationPatterns[pattern];
      
      // Trigger the vibration
      navigator.vibrate(vibrationDuration);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Convenience methods for common patterns
  const light = useCallback(() => trigger({ pattern: "light" }), [trigger]);
  const medium = useCallback(() => trigger({ pattern: "medium" }), [trigger]);
  const heavy = useCallback(() => trigger({ pattern: "heavy" }), [trigger]);
  const success = useCallback(() => trigger({ pattern: "success" }), [trigger]);
  const warning = useCallback(() => trigger({ pattern: "warning" }), [trigger]);
  const error = useCallback(() => trigger({ pattern: "error" }), [trigger]);
  const selection = useCallback(() => trigger({ pattern: "selection" }), [trigger]);

  // Check if haptic feedback is supported
  const isSupported = "vibrate" in navigator;

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    isSupported,
  };
}

// HOC wrapper for adding haptic feedback to click handlers
export function withHaptic<T extends { onClick?: (...args: unknown[]) => void }>(
  Component: React.ComponentType<T>,
  pattern: HapticPattern = "light"
) {
  return function HapticWrapper(props: T) {
    const { trigger } = useHapticFeedback();
    
    const handleClick = (...args: unknown[]) => {
      trigger({ pattern });
      props.onClick?.(...args);
    };
    
    return <Component {...props} onClick={handleClick} />;
  };
}
