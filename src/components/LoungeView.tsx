import React, { useState } from "react";
import { INTERVIEWS_DATA } from "../data/interviews";
import { Radio, Search, Play, Volume2, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function LoungeView() {
  const [selectedInterview, setSelectedInterview] = useState(
    INTERVIEWS_DATA.length > 0 ? INTERVIEWS_DATA[0] : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayingQuote, setIsPlayingQuote] = useState<string | null>(null);

  const hasInterviews = INTERVIEWS_DATA.length > 0;

  const filteredInterviews = INTERVIEWS_DATA.filter((item) => {
    const searchString = `${item.publication} ${item.interviewer || ""} ${item.transcript || ""} ${item.topics.join(" ")}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* View Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 02 • Room 02
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Lounge
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          Settle down with the easy listening and the free-flowing honey. This press archive captures verified interviews, quotes, and cultural reflections of the era.
        </p>
      </div>

      {!hasInterviews ? (
        <div className="w-full p-8 md:p-12 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse">
            <Radio size={24} className="text-[#c5a059]" />
          </div>
          <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">
            Room Being Prepared
          </span>
          <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">
            "The Lounge press clipping indexes are being updated. Checked-in guests can access historical transcripts once verification is complete."
          </p>
        </div>
      ) : (
        /* Main Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Filter & Interview List */}
          <div className="flex flex-col gap-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#c5a059]/50" size={16} />
              <input
                type="text"
                placeholder="Search quotes or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-[#c5a059]/20 rounded pl-10 pr-4 py-2 font-mono text-xs text-[#f5f2ed] focus:outline-none focus:border-[#c5a059]/50"
              />
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredInterviews.map((item) => {
                const isSelected = selectedInterview?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedInterview(item);
                      setIsPlayingQuote(null);
                    }}
                    className={`p-4 rounded border text-left transition-all ${
                      isSelected
                        ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                        : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-serif italic font-semibold">{item.publication}</span>
                      <span className="font-mono text-[9px] opacity-50">{item.date}</span>
                    </div>
                    {item.interviewer && (
                      <p className="text-xs text-[#f5f2ed]/40 font-sans truncate mb-3">
                        Interviewer: {item.interviewer}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="font-mono text-[8px] bg-white/5 text-[#c5a059]/70 px-1.5 py-0.5 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Columns: Immersive Document Reader & Virtual Tape Deck */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {selectedInterview && (
              <>
                {/* Virtual Reel-To-Reel Recorder */}
                <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {/* Spinning Reels */}
                    <div className="flex gap-4">
                      <motion.div
                        animate={isPlayingQuote ? { rotate: 360 } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-14 h-14 rounded-full border border-[#c5a059]/40 flex items-center justify-center relative bg-gradient-to-tr from-[#120e0a] to-[#26201a]"
                      >
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#c5a059]/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#c5a059]/40" />
                        </div>
                      </motion.div>
                      <motion.div
                        animate={isPlayingQuote ? { rotate: -360 } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-14 h-14 rounded-full border border-[#c5a059]/40 flex items-center justify-center relative bg-gradient-to-tr from-[#120e0a] to-[#26201a]"
                      >
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#c5a059]/20 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#c5a059]/40" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]">
                        Interactive Audiograph
                      </span>
                      <span className="font-serif italic text-sm text-[#f5f2ed]">
                        {isPlayingQuote ? "Transmitting audio tape..." : "Tape Deck Idle"}
                      </span>
                    </div>
                  </div>

                  {/* Tap player controls */}
                  {selectedInterview.quotes.length > 0 && (
                    <div className="flex gap-2">
                      {selectedInterview.quotes.map((quote, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsPlayingQuote(isPlayingQuote === quote ? null : quote);
                          }}
                          className={`p-2 rounded border font-mono text-[10px] flex items-center gap-2 transition-all ${
                            isPlayingQuote === quote
                              ? "bg-[#d97706]/20 border-[#d97706] text-[#d97706]"
                              : "bg-white/5 border-white/10 text-[#f5f2ed]/60 hover:text-[#f5f2ed]"
                          }`}
                        >
                          <Play size={12} />
                          Tape {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Transcript/Document Page */}
                <div className="p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6 relative min-h-[400px]">
                  {isPlayingQuote && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded border border-[#d97706]/30 bg-[#d97706]/5 text-[#d97706] font-serif italic text-sm relative"
                    >
                      <div className="absolute top-2 right-2 animate-pulse">
                        <Volume2 size={16} />
                      </div>
                      "{isPlayingQuote}"
                    </motion.div>
                  )}

                  <div className="flex justify-between items-center border-b border-[#c5a059]/20 pb-4">
                    <div className="flex flex-col">
                      <span className="font-serif italic text-2xl text-glow text-[#f5f2ed]">
                        {selectedInterview.publication} Archive
                      </span>
                      <span className="font-mono text-[10px] text-[#c5a059]/60">
                        {selectedInterview.interviewer ? `By ${selectedInterview.interviewer} • ` : ""}{selectedInterview.date}
                      </span>
                    </div>
                    <BookOpen size={24} className="text-[#c5a059]/40" />
                  </div>

                  {/* Transcript Area */}
                  {selectedInterview.transcript ? (
                    <div className="font-serif text-[#f5f2ed]/80 leading-relaxed text-sm max-h-[350px] overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap">
                      {selectedInterview.transcript}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-[#f5f2ed]/40 font-serif italic text-sm">
                      <p>"Full transcript not indexed. View original source or use tape deck."</p>
                      {selectedInterview.sourceUrl && selectedInterview.sourceUrl !== "[PLACEHOLDER]" && (
                        <a
                          href={selectedInterview.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 font-mono text-[10px] uppercase text-[#c5a059] border border-[#c5a059]/30 hover:border-[#c5a059]/60 px-3 py-1 rounded transition-colors"
                        >
                          [ View Original Source ]
                        </a>
                      )}
                    </div>
                  )}

                  {/* Linked Songs */}
                  {selectedInterview.connectedSongs.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-[#c5a059]/10 flex flex-col gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#c5a059]/50">
                        Connected Tracks
                      </span>
                      <div className="flex gap-2">
                        {selectedInterview.connectedSongs.map((songId) => (
                          <span
                            key={songId}
                            className="font-mono text-[9px] border border-[#c5a059]/30 text-[#c5a059] px-2 py-0.5 rounded uppercase"
                          >
                            {songId.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
