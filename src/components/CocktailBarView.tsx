import { useMemo, useState } from "react";
import { ExternalLink, Music2, Martini, Wrench, Gauge, CircleDot } from "lucide-react";
import {
  ARRANGEMENT_SCORES,
  SEPARATION_CONFIDENCE,
  STEM_ORDER,
  type SeparationConfidence,
  type StemName,
} from "../data/audioAnalysis";
import { buildReadout, READOUT_METHOD_NOTE, type ReadoutTag } from "../data/readout";

const TUTORIAL_PLAYLISTS = [
  { name: "Piano", listId: "PLY-HuGVAXY1koMpNamtePjuSD5al1JN5w", url: "https://youtube.com/playlist?list=PLY-HuGVAXY1koMpNamtePjuSD5al1JN5w&si=aKmZZmvgtQBttHFo" },
  { name: "Guitar", listId: "PL4nYsJ3tuKTkbvyNoDBpAAevWX4mx5jUz", url: "https://youtube.com/playlist?list=PL4nYsJ3tuKTkbvyNoDBpAAevWX4mx5jUz&si=BhxhmYK1vIbQ4w9F", note: "Compiled from multiple creators; tutorial formats and difficulty vary by song." },
  { name: "Bass", listId: "PLda-GhTIiuF1ul_A-Al0rrQBAwuh6AdGK", url: "https://youtube.com/playlist?list=PLda-GhTIiuF1ul_A-Al0rrQBAwuh6AdGK&si=zZadqfhghxHTsgIZ" },
  { name: "Drums", listId: "PL2QGx4SN31i_VDf4Lk6JGZAt88vmVfiRC", url: "https://youtube.com/playlist?list=PL2QGx4SN31i_VDf4Lk6JGZAt88vmVfiRC&si=Mv62xURgTolM6m8i", note: "Recreated drum tracks for practice; not official isolated stems or Matt Helders' original drum recordings." }
];

const STEM_LABELS: Record<StemName, string> = { vocals: "Vocals", drums: "Drums", bass: "Bass", guitar: "Guitar", piano: "Piano", other: "Residual" };

const CONFIDENCE_NOTE: Record<SeparationConfidence, string> = {
  high: "Separated reliably",
  experimental: "Experimental separation, read with caution",
  residual: "Unassigned residue, excluded from the readings",
};

const CONFIDENCE_COLOUR: Record<SeparationConfidence, string> = {
  high: "text-[#c5a059]",
  experimental: "text-[#d97706]/80",
  residual: "text-[#f5f2ed]/30",
};

const CONFIDENCE_BORDER: Record<SeparationConfidence, string> = {
  high: "border-[#c5a059]/40",
  experimental: "border-[#d97706]/30",
  residual: "border-white/10",
};

const TAG_LABEL: Record<ReadoutTag, string> = {
  tempo: "Pulse",
  presence: "Presence",
  density: "Event density",
  spectrum: "Register",
  dynamics: "Dynamic range",
  structure: "Structure",
};

function clock(seconds: number) {
  return Math.floor(seconds / 60) + ":" + Math.round(seconds % 60).toString().padStart(2, "0");
}

export default function CocktailBarView() {
  const [scoreId, setScoreId] = useState(ARRANGEMENT_SCORES[0].id);
  const [ribbon, setRibbon] = useState<"shares" | "levels">("shares");

  const score = ARRANGEMENT_SCORES.find((item) => item.id === scoreId) ?? ARRANGEMENT_SCORES[0];
  const readout = useMemo(() => buildReadout(score), [score]);
  const series = ribbon === "shares" ? score.shares : score.levels;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 04 &bull; Room 04</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Cocktail Bar</h2>
        <p className="room-intro text-[#f5f2ed]/70 font-serif leading-relaxed">
          A low-lit service counter for learning the arrangements: tutorials, instrumental details, and the changing mechanics of the record.
        </p>
      </div>

      {/* Tutorials */}
      <section className="p-5 md:p-7 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[#c5a059]">
            <Martini size={21} />
            <span className="font-serif italic text-xl text-[#f5f2ed]">Tutorial Pour</span>
          </div>
          <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60 max-w-2xl">
            A curated shelf of external performance and instrument tutorials for guests who want to learn their way around the bar.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {TUTORIAL_PLAYLISTS.map((playlist) => (
            <article key={playlist.listId} className="rounded border border-[#c5a059]/15 bg-black/25 overflow-hidden flex flex-col">
              <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                <h3 className="font-serif italic text-lg text-[#f5f2ed]">{playlist.name}</h3>
                <a href={playlist.url} target="_blank" rel="noreferrer" className="font-panel text-[9px] uppercase tracking-wide text-[#c5a059] hover:text-[#f5f2ed] inline-flex items-center gap-1 shrink-0">
                  Open on YouTube <ExternalLink size={10} />
                </a>
              </div>
              <iframe className="w-full aspect-video border-y border-[#c5a059]/10 bg-black" src={"https://www.youtube-nocookie.com/embed/videoseries?list=" + playlist.listId} title={playlist.name + " tutorial playlist"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              {playlist.note && <p className="px-4 py-3 font-serif text-xs leading-relaxed text-[#f5f2ed]/50">{playlist.note}</p>}
            </article>
          ))}
        </div>
      </section>

      {/* Arrangement service */}
      <section className="p-5 md:p-7 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-[#c5a059]">
              <Music2 size={21} />
              <span className="font-serif italic text-xl text-[#f5f2ed]">Arrangement Service</span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60 mt-2 max-w-2xl">
              House measurements taken from six private analysis stems, and a written readout generated from them by fixed rule.
            </p>
          </div>
          <label className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/70">
            Select a room service
            <select value={scoreId} onChange={(event) => setScoreId(event.target.value)} className="block mt-2 bg-black/40 border border-[#c5a059]/30 rounded px-3 py-2 text-[#f5f2ed] font-serif normal-case tracking-normal">
              {ARRANGEMENT_SCORES.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
            </select>
          </label>
        </div>

        <div className="border-y border-[#c5a059]/15 py-3 flex flex-wrap gap-x-6 gap-y-2 font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/70">
          <span>{score.tempoBpm.toFixed(1)} BPM</span>
          {score.tempoAmbiguous && <span className="text-[#d97706]/70">or {score.tempoAlternatesBpm.map((value) => value.toFixed(1)).join(" / ")}</span>}
          <span>{clock(score.durationS)} duration</span>
          <span>{score.beatCount} beats &plusmn;{(score.tempoStability * 100).toFixed(1)}%</span>
          <span>{score.windowS}s windows</span>
        </div>

        {/* Written readout */}
        <div className="flex flex-col gap-4">
          {readout.map((line, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[8.5rem_minmax(0,1fr)] gap-1 sm:gap-4">
              <span className="font-panel text-[9px] uppercase tracking-widest text-[#c5a059]/55 sm:pt-1">{TAG_LABEL[line.tag]}</span>
              <p className="font-serif text-sm md:text-[15px] leading-relaxed text-[#f5f2ed]/80">{line.text}</p>
            </div>
          ))}
        </div>

        {/* Ribbon */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#c5a059]/15">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/70">
              {ribbon === "shares" ? "Share of summed stem energy" : "Signal energy"}
            </span>
            <div className="flex items-center gap-1 font-panel text-[9px] uppercase tracking-widest">
              {(["shares", "levels"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRibbon(mode)}
                  className={"px-3 py-1.5 rounded border transition-all " + (ribbon === mode ? "border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10" : "border-[#c5a059]/20 text-[#f5f2ed]/45 hover:text-[#f5f2ed]")}
                >
                  {mode === "shares" ? "Share" : "Energy"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {STEM_ORDER.map((stem) => {
              const confidence = SEPARATION_CONFIDENCE[stem];
              const summary = score.stems[stem];
              const dimmed = confidence === "residual";
              return (
                <div key={stem} className={"flex flex-col gap-1 " + (dimmed ? "opacity-40" : "")}>
                  <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 items-center">
                    <div className="flex items-center gap-1.5 min-w-0" title={CONFIDENCE_NOTE[confidence]}>
                      <CircleDot size={9} className={"shrink-0 " + CONFIDENCE_COLOUR[confidence]} />
                      <span className="font-panel text-[9px] uppercase tracking-widest text-[#f5f2ed]/55 truncate">{STEM_LABELS[stem]}</span>
                    </div>
                    <div className="h-7 flex gap-px bg-black/30">
                      {series[stem].split("").map((level, index) => (
                        <span key={index} className="flex-1 min-w-0 bg-[#c5a059]" style={{ opacity: Math.max(0.06, Number(level) / 9) }} />
                      ))}
                    </div>
                  </div>
                  <span className="pl-[8.5rem] font-panel text-[9px] tracking-wide text-[#f5f2ed]/35">
                    {summary.onsetsPerMin} onsets/min &middot; {summary.centroidHz} Hz &middot; crest {summary.crest}
                    {!dimmed && !summary.presenceRobust && <span className="text-[#d97706]/70"> &middot; presence unstable</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between font-panel text-[9px] uppercase tracking-widest text-[#f5f2ed]/35 pl-[8.5rem]">
            <span>0:00</span>
            <span>{clock(score.durationS)}</span>
          </div>
        </div>

        {/* Legend and method */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#c5a059]/15">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(["high", "experimental", "residual"] as const).map((level) => (
              <span key={level} className={"inline-flex items-center gap-1.5 font-panel text-[9px] uppercase tracking-wide border rounded px-2 py-1 " + CONFIDENCE_COLOUR[level] + " " + CONFIDENCE_BORDER[level]}>
                <CircleDot size={9} /> {CONFIDENCE_NOTE[level]}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/40">
            <Gauge size={12} className="text-[#c5a059] shrink-0 mt-0.5" />
            <span>{READOUT_METHOD_NOTE}</span>
          </div>
          <div className="flex items-start gap-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/40">
            <Wrench size={12} className="text-[#c5a059] shrink-0 mt-0.5" />
            <span>Private signal measurements only; not official stems, and not a definitive arrangement transcription. No separated audio is published.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
