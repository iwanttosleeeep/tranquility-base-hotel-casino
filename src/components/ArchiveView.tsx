import React, { useState } from "react";
import { TIMELINE_DATA } from "../data/timeline";
import { Terminal, ChevronLeft, ChevronRight, Bookmark, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ArchiveView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasEvents = TIMELINE_DATA.length > 0;
  const event = hasEvents ? TIMELINE_DATA[currentIndex] : null;

  const handleNext = () => {
    if (!hasEvents) return;
    setCurrentIndex((prev) => (prev + 1) % TIMELINE_DATA.length);
  };

  const handlePrev = () => {
    if (!hasEvents) return;
    setCurrentIndex((prev) => (prev - 1 + TIMELINE_DATA.length) % TIMELINE_DATA.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 08 • Room 08
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Hotel Archive
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The Hotel Archive houses the detailed chronological timeline of Tranquility Base—mapping everything from early writing sessions to massive tours.
        </p>
      </div>

      {!hasEvents ? (
        <div className="w-full p-8 md:p-12 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse">
            <Terminal size={24} className="text-[#c5a059]" />
          </div>
          <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">
            Room Being Prepared
          </span>
          <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">
            "Chronology databanks are undergoing audit verification. Logs will populate once external citations are processed."
          </p>
        </div>
      ) : (
        /* Main Terminal Shell */
        <div className="rounded-xl border border-[#c5a059]/30 bg-[#070707] p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden min-h-[450px]">
          {/* Radar scan-lines and CRT glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.01)_0%,transparent_80%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none" />

          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-4">
            <div className="flex items-center gap-2 text-[#c5a059]">
              <Terminal size={18} />
              <span className="font-panel text-xs uppercase tracking-widest">
                LUNAR_TERMINAL_V6.0
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-panel text-[9px] text-[#f5f2ed]/30 uppercase hidden sm:inline">
                SYS STATUS: CLASSIFIED
              </span>
              <span className="font-panel text-xs text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-0.5 rounded">
                EVENT {currentIndex + 1} OF {TIMELINE_DATA.length}
              </span>
            </div>
          </div>

          {/* Main interactive Timeline slider */}
          {event && (
            <div className="relative flex-1 flex flex-col gap-6 justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  {/* Date banner */}
                  <div className="flex items-center gap-3">
                    <span className="font-panel text-xs font-semibold text-[#d97706] bg-[#d97706]/10 px-3 py-1 rounded border border-[#d97706]/20">
                      {event.date}
                    </span>
                    <span className="font-panel text-[9px] text-[#c5a059]/60 uppercase tracking-widest border border-[#c5a059]/20 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-serif italic text-glow text-[#f5f2ed]">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="font-serif text-[#f5f2ed]/70 text-sm leading-relaxed max-w-3xl">
                    {event.description}
                  </p>

                  {/* Quote block */}
                  {event.quote && event.quote !== "[PLACEHOLDER]" && (
                    <div className="p-4 rounded border border-[#c5a059]/15 bg-black/40 flex flex-col gap-1 max-w-2xl mt-2">
                      <span className="font-panel text-[8px] uppercase tracking-widest text-[#c5a059]/50 flex items-center gap-1">
                        <Bookmark size={10} />
                        Archival Quote
                      </span>
                      <p className="font-serif italic text-[#c5a059] text-xs leading-relaxed">
                        "{event.quote}"
                      </p>
                    </div>
                  )}

                  {/* Source link */}
                  {event.sourceUrl && event.sourceUrl !== "[PLACEHOLDER]" && (
                    <a
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-panel text-[10px] text-[#c5a059] hover:underline flex items-center gap-1.5 self-start mt-2"
                    >
                      <ExternalLink size={12} />
                      <span>Verified Source Document</span>
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Terminal Nav buttons */}
          <div className="flex items-center justify-between border-t border-[#c5a059]/10 pt-4 mt-auto">
            <button
              onClick={handlePrev}
              className="font-panel text-[10px] uppercase text-[#c5a059]/60 hover:text-[#c5a059] transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              [ Prev Archive ]
            </button>

            {/* Dots timeline tracker */}
            <div className="hidden md:flex gap-1.5">
              {TIMELINE_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === idx ? "bg-[#c5a059] scale-125" : "bg-white/10 hover:bg-white/25"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="font-panel text-[10px] uppercase text-[#c5a059]/60 hover:text-[#c5a059] transition-colors flex items-center gap-1"
            >
              [ Next Archive ]
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
