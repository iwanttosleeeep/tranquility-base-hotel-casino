import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const MOON_LINES = [
  "Meet me beneath the moon, don’t go too soon.",
  "Paraselene woman, I’m your man in the moon.",
  "Library pictures of the quickening canoe. The first of its kind to get to the moon.",
  "Blue moon girls from once upon a Shangri-La. How I often wonder where you are.",
  "The full moon’s glowing yellow and the floorboards creak. C’est horrifique!",
  "You’d do the moon and back twice easy. Just to kiss half of her mouth.",
  "No more moons. Who Built the Moon?",
] as const;

type NotePosition = {
  left: number;
  top: number;
  width: number;
};

export default function MoonEgg() {
  const [open, setOpen] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const ref = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<NotePosition | null>(null);

  const positionNote = () => {
    const button = buttonRef.current;
    if (!button) return;

    const edge = 12;
    const gap = 12;
    const width = Math.min(320, window.innerWidth - edge * 2);
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

  const revealNextLine = () => {
    setLineIndex((current) => (current + 1) % MOON_LINES.length);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !noteRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const reposition = () => positionNote();

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
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
  }, [open, lineIndex]);

  const line = MOON_LINES[Math.max(0, lineIndex)];

  return (
    <span ref={ref} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={revealNextLine}
        aria-label="Play the next lunar transmission"
        aria-expanded={open}
        aria-controls="moon-transmission-note"
        className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit
                   transition-[color,text-shadow] duration-300 hover:text-[#c5a059]
                   hover:[text-shadow:0_0_10px_rgba(197,160,89,0.45)]"
      >
        The Moon
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.span
              ref={noteRef}
              id="moon-transmission-note"
              role="note"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              style={{
                left: position?.left ?? 12,
                top: position?.top ?? 12,
                width: position?.width ?? Math.min(320, window.innerWidth - 24),
                visibility: position ? "visible" : "hidden",
              }}
              className="pointer-events-none fixed z-[100] border border-[#c5a059]/40 bg-[#0b0906]/95 px-4 py-3 text-left
                         whitespace-normal break-words shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                         backdrop-blur-sm normal-case"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={lineIndex}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18 }}
                  className="block font-serif text-sm italic leading-relaxed tracking-normal text-[#f5f2ed]/90"
                >
                  {line}
                </motion.span>
              </AnimatePresence>
              <span className="mt-2 block font-panel text-[9px] tracking-[0.14em] text-[#c5a059]/80">
                Lunar transmission {lineIndex + 1} / {MOON_LINES.length}
              </span>
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}
