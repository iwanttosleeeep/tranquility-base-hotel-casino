import React, { useState } from "react";
import { Search, MoveRight, Music, HelpCircle, FileText, Film } from "lucide-react";
import { SONGS_DATA } from "../data/songs";
import { INTERVIEWS_DATA } from "../data/interviews";
import { FILMS_DATA } from "../data/films";
import { ESSAYS_DATA } from "../data/essays";
import { HotelRoom } from "../types";

interface SearchResult {
  title: string;
  category: string;
  type: "Song" | "Interview" | "Film" | "Essay";
  room: HotelRoom;
  snippet: string;
}

interface GlobalSearchProps {
  onNavigateToRoom: (room: HotelRoom) => void;
  onClose: () => void;
}

export default function GlobalSearch({ onNavigateToRoom, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  const getResults = (): SearchResult[] => {
    if (!query.trim() || query.length < 2) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search Songs
    SONGS_DATA.forEach((song) => {
      const titleMatch = song.title.toLowerCase().includes(lowerQuery);
      const lineMatch = song.annotatedLines.find(
        (al) =>
          al.line.toLowerCase().includes(lowerQuery) ||
          al.annotation.toLowerCase().includes(lowerQuery)
      );

      if (titleMatch || lineMatch) {
        results.push({
          title: song.title,
          category: "Lyrics & Annotations",
          type: "Song",
          room: "LIBRARY",
          snippet: lineMatch
            ? `"...${lineMatch.line.trim()}..." — ${lineMatch.annotation.substring(0, 60)}...`
            : "Explore track pages and commentary."
        });
      }
    });

    // Search Interviews
    INTERVIEWS_DATA.forEach((interview) => {
      const pubMatch = interview.publication.toLowerCase().includes(lowerQuery);
      const transMatchLine = interview.transcript
        ? interview.transcript.split("\n").find((line) => line.toLowerCase().includes(lowerQuery))
        : null;

      if (pubMatch || transMatchLine) {
        results.push({
          title: `${interview.publication} (${interview.date})`,
          category: "Lounge Archive",
          type: "Interview",
          room: "LOUNGE",
          snippet: transMatchLine ? `"...${transMatchLine.trim()}..."` : "Press clippings and transcripts."
        });
      }
    });

    // Search Films
    FILMS_DATA.forEach((film) => {
      const titleMatch = film.title.toLowerCase().includes(lowerQuery);
      const synMatch = film.synopsis && film.synopsis.toLowerCase().includes(lowerQuery);
      const mattersMatch = film.whyItMatters && film.whyItMatters.toLowerCase().includes(lowerQuery);

      if (titleMatch || synMatch || mattersMatch) {
        results.push({
          title: film.title,
          category: "Cinematic Database",
          type: "Film",
          room: "CINEMA",
          snippet: `Directed by ${film.director}. ${film.synopsis ? film.synopsis.substring(0, 80) : ""}...`
        });
      }
    });

    // Search Essays
    ESSAYS_DATA.forEach((essay) => {
      const titleMatch = essay.title.toLowerCase().includes(lowerQuery);
      const contentMatchLine = essay.content
        ? essay.content.split("\n").find((line) => line.toLowerCase().includes(lowerQuery))
        : null;

      if (titleMatch || contentMatchLine) {
        results.push({
          title: essay.title,
          category: "Rooftop Readings",
          type: "Essay",
          room: "ROOFTOP_GARDEN",
          snippet: contentMatchLine ? `"...${contentMatchLine.trim()}..."` : essay.summary
        });
      }
    });

    return results;
  };

  const results = getResults();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-xl border border-[#c5a059]/30 bg-[#0a0a0a] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#c5a059]/20 flex items-center gap-3 bg-black/40">
          <Search className="text-[#c5a059]" size={20} />
          <input
            type="text"
            placeholder="Search songs, quotes, films, themes, essays..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-base font-serif text-[#f5f2ed] placeholder-[#f5f2ed]/30"
            autoFocus
          />
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase text-[#c5a059]/60 hover:text-[#c5a059] px-2 py-1 border border-[#c5a059]/20 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results listing */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[#0f0f0f]/50">
          {query.trim().length < 2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#f5f2ed]/30">
              <HelpCircle size={48} strokeWidth={1} className="mb-4" />
              <p className="font-serif italic text-sm">
                Begin typing (at least 2 characters) to scan hotel databases.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#f5f2ed]/30">
              <span className="font-mono text-xs uppercase tracking-widest text-red-500/70 mb-2">
                Coordinates Lost
              </span>
              <p className="font-serif italic text-sm">
                "We're sorry, this room or reference is currently unavailable. Please ask Reception for assistance."
              </p>
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigateToRoom(res.room);
                  onClose();
                }}
                className="w-full p-4 rounded border border-[#c5a059]/10 bg-black/40 hover:border-[#c5a059]/40 hover:bg-[#c5a059]/5 text-left transition-all flex items-start gap-4 group"
              >
                {/* Result category Icon */}
                <div className="p-2 rounded bg-white/5 text-[#c5a059] mt-0.5">
                  {res.type === "Song" && <Music size={16} />}
                  {res.type === "Interview" && <HelpCircle size={16} />}
                  {res.type === "Film" && <Film size={16} />}
                  {res.type === "Essay" && <FileText size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-serif italic font-semibold text-sm text-[#f5f2ed] truncate group-hover:text-[#c5a059] transition-colors">
                      {res.title}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#c5a059]/50 shrink-0">
                      {res.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#f5f2ed]/50 font-serif leading-relaxed line-clamp-2">
                    {res.snippet}
                  </p>
                </div>

                <MoveRight size={16} className="text-[#c5a059]/20 group-hover:text-[#c5a059] transition-all self-center shrink-0 group-hover:translate-x-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
