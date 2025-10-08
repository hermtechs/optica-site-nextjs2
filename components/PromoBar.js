"use client";
import { X } from "lucide-react";

export default function PromoBar({ onClose }) {
  return (
    <div className="relative z-[60] h-10 w-full bg-brand text-white text-center text-xs flex items-center justify-center">
      <span className="px-8">Today’s best offer! BUY NOW!</span>
      <button
        onClick={onClose}
        aria-label="Close promotion"
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded hover:bg-white/15"
      >
        <X size={16} />
      </button>
    </div>
  );
}
