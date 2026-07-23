import { useMemo, useState } from "react";
import { Calendar, CircleAlert, ExternalLink, MapPin, Music, Radio } from "lucide-react";
import { LIVE_ARCHIVE_SHOWS, TBHC_LIVE_SONG_STATISTICS } from "../data/liveArchive";

const formatDate = (date: string) => new Intl.DateTimeFormat("en", {
  day: "numeric", month: "long", year: "numeric"
}).format(new Date(`${date}T12:00:00`));

export default function BallroomView() {
  const [activeShowId, setActiveShowId] = useState(LIVE_ARCHIVE_SHOWS[0].id);
  const activeShow = useMemo(
    () => LIVE_ARCHIVE_SHOWS.find((show) => show.id === activeShowId) ?? LIVE_ARCHIVE_SHOWS[0],
    [activeShowId]
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 06 • Room 06</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Grand Ballroom</h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-3xl leading-relaxed">
          A live archive of the <i>Tranquility Base Hotel + Casino</i> era: debut nights, changing arrangements, covers, sessions, and the final signal from the ballroom.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["96", "Identifiable performances"], ["89", "Tour-tagged dates"], ["7", "Broadcasts & sessions"], ["2018—19", "Archive window"]
        ].map(([value, label]) => (
          <div key={label} className="rounded border border-[#c5a059]/15 bg-black/20 px-4 py-4">
            <div className="font-tbhc text-2xl text-[#c5a059]">{value}</div>
            <div className="font-panel text-[9px] text-[#f5f2ed]/45 uppercase tracking-widest mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#c5a059]/20 bg-[#120e0a]/30 p-4 md:p-5 flex gap-3 text-xs leading-relaxed text-[#f5f2ed]/60 font-serif">
        <CircleAlert size={16} className="text-[#c5a059] shrink-0 mt-0.5" />
        <p><span className="text-[#c5a059]">Archive note.</span> Dates and venues are corroborated where possible; recovered ordered setlists are explicitly labelled with their evidence grade. Soundchecks and prerecorded walk-on music are not counted as performances.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Radio size={14} className="text-[#c5a059]" />
            <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/60">Era milestones</span>
          </div>
          <div className="max-h-[560px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
            {LIVE_ARCHIVE_SHOWS.map((show) => {
              const selected = show.id === activeShow.id;
              return <button key={show.id} onClick={() => setActiveShowId(show.id)} className={`w-full p-3.5 rounded border text-left transition-colors ${selected ? "border-[#c5a059] bg-[#c5a059]/10" : "border-[#c5a059]/10 bg-black/20 hover:border-[#c5a059]/35"}`}>
                <div className="font-serif italic leading-tight text-[#f5f2ed]">{show.venue}</div>
                <div className="font-panel text-[9px] tracking-wide mt-1 text-[#f5f2ed]/45">{formatDate(show.date)} • {show.city}</div>
                <div className="flex flex-wrap gap-1 mt-2">{show.flags.slice(0, 2).map((flag) => <span key={flag} className="font-panel text-[8px] uppercase tracking-wide text-[#c5a059]/80">{flag}</span>)}</div>
              </button>;
            })}
          </div>
        </div>

        <div className="lg:col-span-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/30 p-5 md:p-7 flex flex-col gap-5 min-w-0">
          <div className="border-b border-[#c5a059]/20 pb-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-serif italic text-2xl md:text-3xl text-[#f5f2ed] text-glow">{activeShow.venue}</h3>
                <div className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/70 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><MapPin size={11} />{activeShow.city}, {activeShow.country}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(activeShow.date)}</span>
                </div>
              </div>
              <span className="shrink-0 font-panel text-[9px] uppercase tracking-wide px-2 py-1 border border-[#c5a059]/30 text-[#c5a059] rounded">{activeShow.evidenceGrade}</span>
            </div>
            <p className="font-serif text-sm text-[#f5f2ed]/60 leading-relaxed">{activeShow.note}</p>
            <div className="flex flex-wrap gap-2">{activeShow.flags.map((flag) => <span key={flag} className="font-panel text-[9px] uppercase tracking-wide px-2 py-1 rounded border border-[#c5a059]/15 text-[#c5a059]/80">{flag}</span>)}</div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60">Recovered programme • {activeShow.setLength} songs</span>
            <div className="flex gap-3 font-panel text-[9px] uppercase tracking-wide">
              <a className="text-[#c5a059] hover:text-[#f5f2ed] inline-flex items-center gap-1" href={activeShow.sourceUrl} target="_blank" rel="noreferrer">Setlist source <ExternalLink size={10} /></a>
              {activeShow.corroborationUrl && <a className="text-[#f5f2ed]/50 hover:text-[#f5f2ed] inline-flex items-center gap-1" href={activeShow.corroborationUrl} target="_blank" rel="noreferrer">Corroboration <ExternalLink size={10} /></a>}
            </div>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeShow.setlist.map((track, index) => <li key={`${track.title}-${index}`} className={`min-w-0 flex gap-3 rounded border px-3 py-2.5 ${track.encore ? "border-[#c5a059]/25 bg-[#c5a059]/[0.06]" : "border-[#c5a059]/10 bg-[#120e0a]/30"}`}>
              <span className="font-panel text-[10px] text-[#c5a059]/65 pt-0.5">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0"><div className="font-serif text-sm text-[#f5f2ed]/85 flex items-center gap-1.5">{track.encore && <Music size={11} className="text-[#c5a059] shrink-0" />}{track.title}</div>{track.note && <div className="font-serif text-xs text-[#f5f2ed]/45 mt-0.5 leading-relaxed">{track.note}</div>}</div>
            </li>)}
          </ol>
        </div>
      </section>

      <section className="rounded-lg glass-panel border border-[#c5a059]/20 bg-black/25 p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-5">
          <div><span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60">TBHC on stage</span><h3 className="font-serif italic text-2xl text-[#f5f2ed] mt-1">Song frequency register</h3></div>
          <span className="font-serif text-xs text-[#f5f2ed]/45">Documented performances across the complete archive</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {TBHC_LIVE_SONG_STATISTICS.map((song) => <div key={song.title} className="border border-[#c5a059]/10 bg-[#120e0a]/30 rounded p-3.5 min-w-0">
            <div className="flex items-start justify-between gap-3"><span className="font-serif text-sm text-[#f5f2ed]/85 leading-tight">{song.title}</span><span className="font-tbhc text-xl text-[#c5a059] shrink-0">{song.performances}</span></div>
            <div className="font-panel text-[9px] uppercase tracking-widest text-[#c5a059]/65 mt-2">{song.rarity}</div>
            {song.firstDate && <div className="font-serif text-[11px] text-[#f5f2ed]/40 mt-1">{formatDate(song.firstDate)} — {formatDate(song.lastDate!)}</div>}
            {song.note && <div className="font-serif text-[11px] leading-relaxed text-[#f5f2ed]/40 mt-1">{song.note}</div>}
          </div>)}
        </div>
      </section>
    </div>
  );
}
