import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function AmpersandEgg() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="A note from the management"
        aria-expanded={open}
        className="font-serif italic normal-case text-[#c5a059] mx-1.5 cursor-pointer
                   transition-[text-shadow] duration-300 hover:[text-shadow:0_0_12px_rgba(197,160,89,0.6)]
                   bg-transparent border-0 p-0 text-inherit"
      >
        &amp;
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="note"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 top-full z-50 mt-3 w-64 md:w-72 -translate-x-1/2
                       border border-[#c5a059]/40 bg-[#0b0906]/95 px-4 py-3 text-left
                       shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm normal-case"
          >
            <span className="block font-serif italic text-sm leading-relaxed text-[#f5f2ed]/90 tracking-normal">
              I hope technological advances don&rsquo;t really bloody get you in the mood.
            </span>
            <span className="mt-2 block font-panel text-[9px] tracking-[0.14em] text-[#c5a059]/80">
              Dedicated to Alexander David Turner.
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
