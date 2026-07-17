import React, { useState } from "react";
import { ESSAYS_DATA } from "../data/essays";
import { Book, Star, Calendar, User } from "lucide-react";

export default function RooftopGardenView() {
  const [selectedEssay, setSelectedEssay] = useState(
    ESSAYS_DATA.length > 0 ? ESSAYS_DATA[0] : null
  );

  const hasEssays = ESSAYS_DATA.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 09 • Room 09
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Rooftop Garden
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The Rooftop Garden holds original, long-form literary essays analyzing the album's complex lyrical layers, physical architecture, and cultural subtexts.
        </p>
      </div>

      {!hasEssays ? (
        <div className="w-full p-8 md:p-12 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse">
            <Book size={24} className="text-[#c5a059]" />
          </div>
          <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">
            Room Being Prepared
          </span>
          <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">
            "We are currently reviewing and formatting analytical essays. Once authorized, the table of essays will become accessible to registered residents."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Essay index (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="font-serif italic text-[11px] uppercase tracking-widest text-[#c5a059]/50 px-2">
              Table of Essays
            </span>
            {ESSAYS_DATA.map((essay) => {
              const isActive = selectedEssay?.id === essay.id;
              return (
                <button
                  key={essay.id}
                  onClick={() => setSelectedEssay(essay)}
                  className={`p-4 rounded border text-left transition-all flex flex-col gap-2 ${
                    isActive
                      ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                      : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-serif italic font-semibold text-sm leading-tight">
                      {essay.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#f5f2ed]/40 font-serif leading-relaxed line-clamp-2">
                    {essay.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right column: Interactive Reading Desk (8 cols) */}
          <div className="lg:col-span-8">
            {selectedEssay && (
              <div className="p-8 md:p-10 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6 relative min-h-[500px]">
                {/* Visual starlit background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.03)_0%,transparent_60%)] pointer-events-none" />

                {/* Essay Header Info */}
                <div className="flex flex-col gap-4 border-b border-[#c5a059]/20 pb-5">
                  <h3 className="text-3xl md:text-4xl font-serif italic text-glow text-[#f5f2ed] leading-tight">
                    {selectedEssay.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#c5a059]/70 uppercase">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {selectedEssay.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {selectedEssay.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#d97706]">
                      <Star size={12} className="animate-spin" />
                      Rooftop Release
                    </span>
                  </div>
                </div>

                {/* Essay Core Reading Area */}
                <div className="font-serif text-[#f5f2ed]/80 leading-relaxed text-sm max-h-[450px] overflow-y-auto pr-2 custom-scrollbar whitespace-pre-line prose prose-invert prose-amber max-w-none">
                  {selectedEssay.content}
                </div>

                {/* Related Tracks */}
                {selectedEssay.relatedSongs.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-[#c5a059]/10 flex flex-col gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#c5a059]/50">
                      Connected Album Tracks
                    </span>
                    <div className="flex gap-2">
                      {selectedEssay.relatedSongs.map((songId) => (
                        <span
                          key={songId}
                          className="font-mono text-[9px] border border-[#c5a059]/30 text-[#c5a059] px-2.5 py-0.5 rounded uppercase"
                        >
                          {songId.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
