import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type NotePosition = {
  left: number;
  top: number;
  width: number;
};

export default function AmpersandEgg() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<NotePosition | null>(null);

  const positionNote = () => {
    const button = buttonRef.current;
    if (!button) return;

    const edge = 12;
    const gap = 12;
    const width = Math.min(288, window.innerWidth - edge * 2);
    const buttonRect = button.getBoundingClientRect();
    const noteHeight = noteRef.current?.getBoundingClientRect().height ?? 0;
    const centredLeft = buttonRect.left + buttonRect.width / 2 - width / 2;
    const left = Math.min(Math.max(centredLeft, edge), window.innerWidth - width - edge);
    const fitsBelow = buttonRect.bottom + gap + noteHeight <= window.innerHeight - edge;
    const top = fitsBelow
      ? buttonRect.bottom + gap
      : Math.max(edge, buttonRect.top - noteHeight - gap);

    setPosition({ left, top, width });
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !noteRef.current?.contains(target)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const reposition = () => positionNote();
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    positionNote();
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="A note from the management"
        aria-expanded={open}
        aria-controls="ampersand-management-note"
        className="font-serif italic normal-case text-[#c5a059] mx-1.5 cursor-pointer
                   transition-[text-shadow] duration-300 hover:[text-shadow:0_0_12px_rgba(197,160,89,0.6)]
                   bg-transparent border-0 p-0"
      >
        &amp;
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.span
              ref={noteRef}
              id="ampersand-management-note"
              role="note"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              style={{
                left: position?.left ?? 12,
                top: position?.top ?? 12,
                width: position?.width ?? Math.min(288, window.innerWidth - 24),
                visibility: position ? "visible" : "hidden",
              }}
              className="fixed z-[100] border border-[#c5a059]/40 bg-[#0b0906]/95 px-4 py-3 text-left
                         whitespace-normal break-words shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                         backdrop-blur-sm normal-case"
            >
              <span className="block font-serif italic text-sm leading-relaxed text-[#f5f2ed]/90 tracking-normal">
                I hope technological advances don&rsquo;t really bloody get you in the mood.
              </span>
              <span className="mt-2 block font-panel text-[9px] tracking-[0.14em] text-[#c5a059]/80">
                Dedicated to Alexander David Turner.
              </span>
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}
