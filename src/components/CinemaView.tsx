import { useState } from "react";
import { CINEMA_REFERENCES } from "../data/references";
import { VIDEO_ANALYSES } from "../data/mvAnalysis";
import { ExternalLink, Clapperboard, Gauge, Palette, Eye, Link2 } from "lucide-react";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

export default function CinemaView() {
  const [selectedVideoId, setSelectedVideoId] = useState(VIDEO_ANALYSES[0].id);

  const selectedVideo = VIDEO_ANALYSES.find((video) => video.id === selectedVideoId) ?? VIDEO_ANALYSES[0];
  const maxCuts = Math.max(...selectedVideo.segments.map((segment) => segment.cuts));
  const averageBrightness = Math.round(selectedVideo.segments.reduce((total, segment) => total + segment.brightness, 0) / selectedVideo.segments.length);
  const averageSaturation = Math.round(selectedVideo.segments.reduce((total, segment) => total + segment.saturation, 0) / selectedVideo.segments.length);
  const selectedVideoReferences = selectedVideo.contextLinks.flatMap((link) => {
    const reference = CINEMA_REFERENCES.find((item) => item.id === link.referenceId);
    return reference ? [{ ...link, reference }] : [];
  });

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
          The hotel's projection room: machine-read shot rhythm and colour for the album's music videos, with timecoded viewing notes and source-linked context. The full reference catalogue now lives in the Hotel Archive.
        </p>
      </div>

      <section className="rounded-lg border border-[#c5a059]/25 bg-[#0b0a0a]/70 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#c5a059]/20 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Clapperboard size={18} className="text-[#c5a059]" />
            <div>
              <p className="font-panel text-[10px] uppercase tracking-[0.2em] text-[#c5a059]">Projection register</p>
              <p className="font-serif text-xs italic text-[#f5f2ed]/55">Machine-read shot rhythm and colour, not a substitute for viewing.</p>
            </div>
          </div>
          <span className="font-panel text-[9px] uppercase tracking-wider text-[#f5f2ed]/40">Local analysis · no video hosted</span>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {VIDEO_ANALYSES.map((video) => {
              const active = video.id === selectedVideo.id;
              return (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideoId(video.id)}
                  className={`text-left border px-3 py-2 transition-colors ${active ? "border-[#c5a059] bg-[#c5a059]/10 text-[#f5f2ed]" : "border-[#c5a059]/15 text-[#f5f2ed]/55 hover:border-[#c5a059]/50"}`}
                >
                  <span className="block font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/75">{video.format}</span>
                  <span className="block font-serif text-sm italic">{video.title}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-px border border-[#c5a059]/15 bg-[#c5a059]/15 sm:grid-cols-4">
            {[
              ["Running time", formatTime(selectedVideo.duration)],
              ["Detected shots", selectedVideo.shotCount.toString()],
              ["Mean light", `${averageBrightness} / 255`],
              ["Mean chroma", `${averageSaturation} / 255`],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#0b0a0a] px-3 py-3">
                <span className="block font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/55">{label}</span>
                <span className="font-serif text-lg text-[#f5f2ed]/85">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_180px]">
            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl italic text-[#f5f2ed]">{selectedVideo.title}</h3>
                  <p className="font-serif text-xs text-[#f5f2ed]/50">12 equal-duration intervals · hover for precise timecodes</p>
                </div>
                <span className="hidden font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/60 sm:block">Shot activity / dominant colour</span>
              </div>
              <div className="flex h-40 items-end gap-1 border-b border-[#c5a059]/30 pb-1">
                {selectedVideo.segments.map((segment) => (
                  <div key={segment.start} className="group relative flex h-full flex-1 items-end" title={`${formatTime(segment.start)}–${formatTime(segment.end)} · ${segment.cuts} detected shots overlap this interval · light ${segment.brightness}/255 · chroma ${segment.saturation}/255`}>
                    <div
                      className="w-full min-h-[6px] border-t border-white/20 transition-all duration-300 group-hover:brightness-150"
                      style={{ height: `${Math.max(8, (segment.cuts / maxCuts) * 100)}%`, backgroundColor: segment.palette }}
                    />
                    <span className="pointer-events-none absolute -top-11 left-1/2 z-20 hidden w-28 -translate-x-1/2 border border-[#c5a059]/30 bg-[#111] p-1.5 text-center font-panel text-[8px] leading-relaxed text-[#f5f2ed]/75 shadow-xl group-hover:block">
                      {formatTime(segment.start)}–{formatTime(segment.end)}<br />{segment.cuts} detected shots
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between font-panel text-[9px] text-[#f5f2ed]/35">
                <span>00:00</span>
                <span>{formatTime(selectedVideo.duration)}</span>
              </div>
            </div>

            <aside className="border-l-0 border-[#c5a059]/15 pl-0 lg:border-l lg:pl-6">
              <div className="mb-3 flex items-center gap-2 font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/70"><Gauge size={13} /> Readout</div>
              <p className="font-serif text-xs leading-relaxed text-[#f5f2ed]/60">Bar height records how many detected shots overlap each interval. Bar colour is the interval's weighted dominant colour.</p>
              <div className="mt-4 flex items-center gap-2 font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/70"><Palette size={13} /> Method</div>
              <p className="mt-1 font-serif text-xs leading-relaxed text-[#f5f2ed]/45">{selectedVideo.sourceNote}</p>
            </aside>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 border-t border-[#c5a059]/15 pt-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-2 font-panel text-[10px] uppercase tracking-[0.18em] text-[#c5a059]"><Eye size={14} /> Viewing notes</div>
              <div className="space-y-3">
                {selectedVideo.dossier.map((entry) => (
                  <article key={entry.timecode} className="border-l border-[#c5a059]/40 pl-4">
                    <span className="font-panel text-[9px] tracking-wider text-[#c5a059]/70">{entry.timecode}</span>
                    <p className="mt-1 font-serif text-sm leading-relaxed text-[#f5f2ed]/75">{entry.observation}</p>
                    <p className="mt-1 font-serif text-xs italic leading-relaxed text-[#f5f2ed]/45">{entry.formalNote}</p>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2 font-panel text-[10px] uppercase tracking-[0.18em] text-[#c5a059]"><Link2 size={14} /> Context, with boundaries</div>
              <p className="mb-4 font-serif text-xs leading-relaxed text-[#f5f2ed]/45">These links document album, song, or production context. A link marked “album context only” is deliberately not a claim of scene-level influence.</p>
              <div className="space-y-3">
                {selectedVideoReferences.map(({ reference, note, scope }) => (
                  <article key={reference.id} className="rounded border border-[#c5a059]/15 bg-black/20 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-serif text-sm italic text-[#f5f2ed]/85">{reference.title}</span>
                        <span className="ml-2 font-panel text-[9px] text-[#c5a059]/70">{reference.evidenceGrade}</span>
                      </div>
                      <a href={reference.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read source for ${reference.title}`} className="shrink-0 text-[#c5a059]/75 hover:text-[#c5a059]"><ExternalLink size={13} /></a>
                    </div>
                    <span className="mt-1 block font-panel text-[8px] uppercase tracking-wider text-[#c5a059]/55">{scope}</span>
                    <p className="mt-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/55">{note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
