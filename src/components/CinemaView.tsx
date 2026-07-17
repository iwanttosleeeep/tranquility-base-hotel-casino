import { useState } from "react";
import { FILMS_DATA } from "../data/films";
import { Tv, Film as FilmIcon, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function CinemaView() {
  const [selectedFilm, setSelectedFilm] = useState(
    FILMS_DATA.length > 0 ? FILMS_DATA[0] : null
  );
  const [isCrtStatic, setIsCrtStatic] = useState(false);

  const handleFilmSelect = (film: typeof FILMS_DATA[0]) => {
    setIsCrtStatic(true);
    setTimeout(() => {
      setSelectedFilm(film);
      setIsCrtStatic(false);
    }, 400);
  };

  const hasFilms = FILMS_DATA.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 03 • Room 03
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Hotel Cinema
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The cinema room showcases cinema classics and literary references that Alex Turner lived and breathed while writing the album. Take a seat and tune into the CRT screen below.
        </p>
      </div>

      {!hasFilms ? (
        <div className="w-full p-8 md:p-12 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse">
            <FilmIcon size={24} className="text-[#c5a059]" />
          </div>
          <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">
            Room Being Prepared
          </span>
          <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">
            "The Cinema archives are currently being restored. Please consult Reception for future film scheduling updates."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Selector Buttons */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]/50 px-2">
              Select Channel (Film Reference)
            </span>
            {FILMS_DATA.map((film) => {
              const isSelected = selectedFilm?.id === film.id;
              return (
                <button
                  key={film.id}
                  onClick={() => handleFilmSelect(film)}
                  className={`p-4 rounded border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                      : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-serif italic font-semibold">{film.title}</span>
                    <span className="font-mono text-[8px] opacity-50">Dir: {film.director} • {film.year}</span>
                  </div>
                  <Tv size={16} className={`opacity-40 group-hover:opacity-100 ${isSelected ? "text-[#c5a059]" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* Right Columns: Retro CRT Screen Monitor */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {selectedFilm && (
              <div className="relative rounded-2xl border-8 border-neutral-800 bg-[#0d0d0d] p-6 md:p-8 overflow-hidden shadow-2xl flex flex-col gap-6 min-h-[450px]">
                {/* Curved Screen Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 rounded-xl pointer-events-none z-20" />
                
                {/* Scanlines layer */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none z-10" />

                {isCrtStatic ? (
                  /* Static Switch Animation */
                  <div className="flex-1 flex items-center justify-center bg-black animate-pulse">
                    <span className="font-mono text-xs text-[#c5a059]/50 tracking-widest uppercase">
                      Tuning Analog Receiver...
                    </span>
                  </div>
                ) : (
                  /* CRT Screen Content */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col gap-6 relative z-10 text-[#f5f2ed]/80"
                  >
                    {/* Channel Label */}
                    <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-4">
                      <div className="flex items-center gap-2">
                        <FilmIcon className="text-[#c5a059]" size={18} />
                        <span className="font-mono text-xs text-[#c5a059] uppercase tracking-widest">
                          CH {selectedFilm.year % 100} • CRT Terminal
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[#f5f2ed]/40 uppercase">
                        Signal: Locked
                      </span>
                    </div>

                    {/* Film Title & Metadata */}
                    <div>
                      <h3 className="text-3xl font-serif italic text-glow text-[#f5f2ed] mb-1">
                        {selectedFilm.title}
                      </h3>
                      <p className="text-xs font-mono text-[#c5a059]/80">
                        Directed by {selectedFilm.director} • Released in {selectedFilm.year}
                      </p>
                    </div>

                    {/* Info Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#c5a059]/60">
                          The Synopsis
                        </span>
                        <p className="font-serif text-[#f5f2ed]/70 text-xs">
                          {selectedFilm.synopsis}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#c5a059]/60">
                          Why It Matters To TBHC
                        </span>
                        <p className="font-serif text-[#f5f2ed]/70 text-xs">
                          {selectedFilm.whyItMatters}
                        </p>
                      </div>
                    </div>

                    {/* Quotes */}
                    {selectedFilm.alexQuote && selectedFilm.alexQuote !== "[PLACEHOLDER]" && (
                      <div className="p-4 rounded border border-[#c5a059]/20 bg-[#c5a059]/5 font-serif italic text-xs text-[#c5a059] leading-relaxed">
                        " {selectedFilm.alexQuote} "
                        <span className="block text-right font-mono text-[8px] uppercase tracking-widest mt-2 not-italic text-[#c5a059]/50">
                          — Alex Turner
                        </span>
                      </div>
                    )}

                    {selectedFilm.sourceUrl && selectedFilm.sourceUrl !== "[PLACEHOLDER]" && (
                      <a
                        href={selectedFilm.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-[#c5a059] hover:underline flex items-center gap-1.5 self-start mt-2"
                      >
                        <ExternalLink size={12} />
                        <span>Source Document Reference</span>
                      </a>
                    )}

                    {/* Visual Motifs & Tracks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-4 border-t border-[#c5a059]/10">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[#c5a059]/50">
                          Visual Motifs
                        </span>
                        {selectedFilm.visualMotifs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedFilm.visualMotifs.map((motif) => (
                              <span
                                key={motif}
                                className="font-mono text-[8px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#f5f2ed]/60"
                              >
                                {motif}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-serif italic text-xs text-[#f5f2ed]/30">[None]</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[#c5a059]/50">
                          Influenced Tracks
                        </span>
                        {selectedFilm.connectedSongs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedFilm.connectedSongs.map((songId) => (
                              <span
                                key={songId}
                                className="font-mono text-[8px] border border-[#c5a059]/20 text-[#c5a059] px-2 py-0.5 rounded uppercase"
                              >
                                {songId.replace(/-/g, " ")}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-serif italic text-xs text-[#f5f2ed]/30">[None]</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
