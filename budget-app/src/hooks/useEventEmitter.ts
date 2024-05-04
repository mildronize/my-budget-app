import { useEffect } from "react";

export interface UseEventEmitterOptions {
  onReceive?: () => void;
  eventName?: string;
}

export function useEventEmitter(options?: UseEventEmitterOptions) {
  const eventName =
    "eventEmitterFor" + options?.eventName || "defaultEventName";

  useEffect(() => {
    // Add event listener
    if (typeof window === "undefined") return;
    if (!options?.onReceive) return;
    window.addEventListener(eventName, options?.onReceive);

    // Cleanup function to remove the event listener
    return () => {
      if (typeof window === "undefined") return;
      if (!options?.onReceive) return;
      window.removeEventListener(eventName, options?.onReceive);
    };
  }, []); // Empty dependency array means this effect runs once on mount and once on unmount

  const emit = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(eventName));
  };

  return {
    emit,
  };
}
