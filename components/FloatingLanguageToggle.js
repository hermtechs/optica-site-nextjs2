"use client";
import { useEffect, useRef, useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";

/**
 * Mobile-only floating language toggle that hides on scroll down
 * and shows on scroll up. Stays above content and respects safe areas.
 */
export default function FloatingLanguageToggle() {
  const [visible, setVisible] = useState(true); // starts visible
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Initialize last scroll position after mount
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      const curr = window.scrollY || 0;

      // Use rAF to avoid running logic too often
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = curr - lastY.current;

          // Hide when scrolling down (beyond the very top)
          if (delta > 6 && curr > 64) {
            setVisible(false);
          }
          // Show when scrolling up
          else if (delta < -6) {
            setVisible(true);
          }

          lastY.current = curr;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const opts = { passive: true };
    window.addEventListener("scroll", onScroll, opts);
    return () => window.removeEventListener("scroll", onScroll, opts);
  }, []);

  // Styles: slide & fade when hidden, clicks disabled while hidden
  const hiddenClasses = "translate-y-6 opacity-0 pointer-events-none";
  const shownClasses = "translate-y-0 opacity-100";

  return (
    <div
      className={`md:hidden fixed right-4 z-[70] transition-all duration-250 ease-out ${
        visible ? shownClasses : hiddenClasses
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)", // iOS safe area
      }}
      aria-hidden={false}
    >
      <div className="rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <LanguageToggle size="sm" />
      </div>
    </div>
  );
}
