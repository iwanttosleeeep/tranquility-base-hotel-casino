import React, { useState, useRef, useEffect } from "react";
import { SONGS_DATA } from "../data/songs";
import { Music, ChevronLeft, ChevronRight, Info, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LibraryView() {
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const song = SONGS_DATA[selectedSongIndex];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setSelectedLineIndex(null);
  }, [selectedSongIndex]);

  const handleNextSong = () => {
    setSelectedSongIndex((prev) => (prev + 1) % SONGS_DATA.length);
  };

  const handlePrevSong = () => {
    setSelectedSongIndex((prev) => (prev - 1 + SONGS_DATA.length) % SONGS_DATA.length);
  };

  const isPlaceholder =
    !song.annotatedLines ||
    song.annotatedLines.length === 0 ||
    (song.annotatedLines.length === 1 && song.annotatedLines[0].line === "[PLACEHOLDER]");

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 05 • Room 05
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Library
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The central archive for the album's 11 songs. Read through select verified annotations and trace cultural references.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List Pane (Track Selector) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <span className="font-serif italic text-[11px] uppercase tracking-widest text-[#c5a059]/50 px-2">
            Songs Index
          </span>
          <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {SONGS_DATA.map((track, index) => {
              const isActive = selectedSongIndex === index;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedSongIndex(index)}
                  className={`group flex items-baseline gap-4 p-3 rounded border text-left transition-all ${
                    isActive
                      ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                      : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                  }`}
                >
                  <span className="font-mono text-[9px] opacity-40">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="font-serif italic font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    {track.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Lyrics / Annotations Reading Stand */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 relative flex flex-col min-h-[350px]">
            {/* Song Navigation Header */}
            <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-4 mb-6">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]">
                  TRACK {(selectedSongIndex + 1).toString().padStart(2, "0")} OF 11
                </span>
                <h3 className="text-2xl md:text-3xl font-serif italic text-glow text-[#f5f2ed]">
                  {song.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevSong}
                  className="p-1.5 rounded border border-white/10 hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextSong}
                  className="p-1.5 rounded border border-white/10 hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {isPlaceholder ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border border-[#c5a059]/10 bg-black/20 rounded-lg">
                <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4">
                  <Music size={24} className="text-[#c5a059]" />
                </div>
                <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">
                  Room Being Prepared
                </span>
                <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-sm mb-4">
                  "This song's annotated lines are currently being compiled and verified. Official lyrics link will be active shortly."
                </p>
                {song.officialLyricsUrl && song.officialLyricsUrl !== "[PLACEHOLDER]" && (
                  <a
                    href={song.officialLyricsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#c5a059] hover:text-[#d97706] border border-[#c5a059]/30 hover:border-[#d97706]/40 px-3 py-1.5 rounded transition-all"
                  >
                    <ExternalLink size={12} />
                    <span>View Official Lyrics</span>
                  </a>
                )}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-4"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]/50 mb-2">
                  Select an annotated line to view notes:
                </span>
                {song.annotatedLines.map((annotated, idx) => {
                  const isActive = selectedLineIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedLineIndex(idx)}
                      className={`p-4 rounded border text-left transition-all flex flex-col gap-2 ${
                        isActive
                          ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                          : "bg-black/10 border-white/5 text-[#f5f2ed]/80 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                      }`}
                    >
                      <p className="font-serif italic text-base leading-snug">
                        "{annotated.line}"
                      </p>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-right self-end opacity-60">
                        [ Read Annotation ]
                      </span>
                    </button>
                  );
                })}

                {song.officialLyricsUrl && song.officialLyricsUrl !== "[PLACEHOLDER]" && (
                  <a
                    href={song.officialLyricsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 self-start text-xs font-mono text-[#c5a059] hover:text-[#d97706] border border-[#c5a059]/30 hover:border-[#d97706]/40 px-3 py-1.5 rounded transition-all"
                  >
                    <ExternalLink size={12} />
                    <span>View Official Lyrics</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Reference & Annotation Card Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedLineIndex !== null && song.annotatedLines[selectedLineIndex] ? (
              <motion.div
                key={selectedLineIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 rounded-lg glass-panel border border-[#d97706]/40 bg-[#d97706]/5 flex flex-col gap-5"
              >
                <div className="flex items-center gap-2 text-[#d97706]">
                  <Info size={16} />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Lyrical Annotation
                  </span>
                </div>

                <div className="border-b border-[#d97706]/20 pb-3">
                  <h4 className="font-serif italic text-sm text-[#f5f2ed]/60">
                    Line Reference:
                  </h4>
                  <p className="font-serif italic text-base text-glow text-[#f5f2ed] mt-1">
                    "{song.annotatedLines[selectedLineIndex].line}"
                  </p>
                </div>

                <p className="font-serif text-xs text-[#f5f2ed]/80 leading-relaxed whitespace-pre-wrap">
                  {song.annotatedLines[selectedLineIndex].annotation}
                </p>

                {song.annotatedLines[selectedLineIndex].sourceUrl && (
                  <a
                    href={song.annotatedLines[selectedLineIndex].sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase text-[#d97706] hover:underline flex items-center gap-1 mt-1"
                  >
                    <ExternalLink size={10} />
                    <span>Source Document</span>
                  </a>
                )}

                {song.annotatedLines[selectedLineIndex].references &&
                  song.annotatedLines[selectedLineIndex].references!.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#d97706]/60">
                        Cross References
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {song.annotatedLines[selectedLineIndex].references!.map((ref) => (
                          <span
                            key={ref}
                            className="font-mono text-[8px] bg-black/40 border border-[#d97706]/20 text-[#d97706] px-1.5 py-0.5 rounded"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => setSelectedLineIndex(null)}
                  className="font-mono text-[9px] uppercase text-[#d97706]/60 hover:text-[#d97706] text-left transition-colors"
                >
                  [ Close annotation ]
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="default-refs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-6"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]/50">
                  Lyrical Context & References
                </span>

                {/* Film/Literary References */}
                <div className="grid grid-cols-1 gap-4">
                  {song.filmReferences && song.filmReferences.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#c5a059]/40">
                        Film References
                      </span>
                      <div className="flex flex-col gap-1 font-serif italic text-xs text-[#c5a059]">
                        {song.filmReferences.map((film) => (
                          <span key={film} className="truncate">
                            {film}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 text-[#f5f2ed]/30 font-serif italic text-xs">
                      <span>No linked films registered yet.</span>
                    </div>
                  )}

                  {song.literaryReferences && song.literaryReferences.length > 0 ? (
                    <div className="flex flex-col gap-1.5 border-t border-[#c5a059]/10 pt-4">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#c5a059]/40">
                        Literature
                      </span>
                      <div className="flex flex-col gap-1 font-serif text-xs text-[#f5f2ed]/60">
                        {song.literaryReferences.map((lit) => (
                          <span key={lit} className="truncate">
                            {lit}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Related Essays */}
                {song.relatedEssays && song.relatedEssays.length > 0 ? (
                  <div className="flex flex-col gap-2 border-t border-[#c5a059]/10 pt-4">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#c5a059]/40">
                      Related Essays
                    </span>
                    <div className="flex items-center gap-1.5 font-serif italic text-xs text-[#c5a059]">
                      <ExternalLink size={12} />
                      <span>{song.relatedEssays[0]}</span>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
