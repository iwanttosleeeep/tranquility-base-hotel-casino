import { useEffect, useMemo, useState } from "react";
import { BookOpen, ExternalLink, Film, Mic2, Quote } from "lucide-react";
import { INTERVIEWS_DATA } from "../data/interviews";
import { CINEMA_REFERENCES } from "../data/references";
import { SONGS_DATA } from "../data/songs";

export default function LibraryView() {
  const [selectedSongIndex, setSelectedSongIndex] = useState(() => {
    const parts = window.location.hash.replace(/^#\/?/, "").split("/");
    const index = SONGS_DATA.findIndex((song) => song.id === parts[1]);
    return index >= 0 ? index : 0;
  });
  const song = SONGS_DATA[selectedSongIndex];
  const references = useMemo(() => CINEMA_REFERENCES.filter((reference) => reference.connectedSongs.includes(song.id)), [song.id]);
  const interviews = useMemo(() => INTERVIEWS_DATA.filter((interview) => interview.connectedSongs.includes(song.id)), [song.id]);
  const topics = useMemo(() => [...new Set([...references.flatMap((item) => item.topics), ...interviews.flatMap((item) => item.topics)])], [references, interviews]);
  const isBside = song.releaseCategory === "B-side";

  useEffect(() => {
    const target = `#/library/${song.id}`;
    if (window.location.hash !== target) window.history.replaceState(null, "", target);
  }, [song.id]);

  return <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
    <div>
      <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 05 • Room 05</span>
      <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">The Library</h2>
      <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-3xl leading-relaxed">A source-led reading desk for the album songs and their companion B-side. Every note below comes from the verified reference catalogue or the interview archive; the Library does not reproduce full lyrics.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <aside className="lg:col-span-3 flex flex-col gap-2">
        <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60 px-2">Song index</span>
        <div className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">{SONGS_DATA.map((track, index) => <button key={track.id} onClick={() => setSelectedSongIndex(index)} className={`group flex items-baseline gap-3 p-3 rounded border text-left transition-all ${selectedSongIndex === index ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]" : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"}`}><span className="font-panel text-[10px] opacity-45 shrink-0">{track.releaseCategory === "B-side" ? "B-SIDE" : String(index + 1).padStart(2, "0")}</span><span className="font-serif italic font-semibold text-sm leading-tight">{track.title}</span></button>)}</div>
      </aside>

      <main className="lg:col-span-6 flex flex-col gap-5">
        <section className="p-6 md:p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-4"><div className="flex items-start justify-between gap-4 border-b border-[#c5a059]/20 pb-4"><div><span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]">{isBside ? "B-Side • Companion release" : `Track ${String(selectedSongIndex + 1).padStart(2, "0")} • Source dossier`}</span><h3 className="text-2xl md:text-3xl font-serif italic text-glow text-[#f5f2ed] mt-1">{song.title}</h3></div><BookOpen className="text-[#c5a059]/60 shrink-0" size={20}/></div><p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60">{references.length + interviews.length} verified source{references.length + interviews.length === 1 ? "" : "s"} currently linked to this song.</p>{topics.length > 0 && <div className="flex flex-wrap gap-1.5">{topics.map((topic) => <span key={topic} className="font-panel text-[9px] uppercase tracking-wide border border-[#c5a059]/15 text-[#c5a059]/75 px-2 py-1 rounded">{topic}</span>)}</div>}</section>

        <section className="flex flex-col gap-3"><div className="flex items-center gap-2"><Film size={15} className="text-[#c5a059]"/><span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60">Verified references</span></div>{references.length > 0 ? references.map((reference) => <article key={reference.id} className="p-5 rounded border border-[#c5a059]/15 bg-black/20 flex flex-col gap-3"><div className="flex flex-wrap justify-between gap-2"><div><h4 className="font-serif italic text-lg text-[#f5f2ed]">{reference.title}</h4><p className="font-panel text-[9px] uppercase tracking-wide text-[#c5a059]/65 mt-1">{reference.creator} • {reference.year} • {reference.medium}</p></div><span className="font-panel text-[10px] border border-[#c5a059]/40 text-[#c5a059] px-2 py-1 h-fit rounded">{reference.evidenceGrade}</span></div><p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/65">{reference.connection}</p><p className="font-serif text-xs leading-relaxed text-[#f5f2ed]/40">{reference.evidence}</p><a href={reference.sourceUrl} target="_blank" rel="noreferrer" className="font-panel text-[10px] uppercase tracking-wide text-[#c5a059] hover:text-[#f5f2ed] inline-flex items-center gap-1 self-start">{reference.confirmingSource} <ExternalLink size={11}/></a></article>) : <div className="p-5 rounded border border-dashed border-[#c5a059]/15 font-serif text-sm italic text-[#f5f2ed]/45">No song-specific verified reference has been catalogued yet.</div>}</section>

        <section className="flex flex-col gap-3"><div className="flex items-center gap-2"><Mic2 size={15} className="text-[#c5a059]"/><span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60">Interview register</span></div>{interviews.length > 0 ? interviews.map((interview) => <article key={interview.id} className="p-5 rounded border border-[#c5a059]/15 bg-black/20 flex flex-col gap-2"><h4 className="font-serif italic text-lg text-[#f5f2ed]">{interview.title}</h4><span className="font-panel text-[9px] uppercase tracking-wide text-[#c5a059]/65">{interview.publication} • {interview.date}{interview.interviewer ? ` • ${interview.interviewer}` : ""}</span><div className="flex flex-wrap gap-1.5 mt-1">{interview.topics.map((topic) => <span key={topic} className="font-panel text-[9px] text-[#f5f2ed]/45">{topic}</span>)}</div><a href={interview.sourceUrl} target="_blank" rel="noreferrer" className="font-panel text-[10px] uppercase tracking-wide text-[#c5a059] hover:text-[#f5f2ed] inline-flex items-center gap-1 self-start mt-1">Open source <ExternalLink size={11}/></a></article>) : <div className="p-5 rounded border border-dashed border-[#c5a059]/15 font-serif text-sm italic text-[#f5f2ed]/45">No interview is directly indexed to this song yet.</div>}</section>
      </main>

      <aside className="lg:col-span-3 p-5 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-4"><div className="flex items-center gap-2 text-[#c5a059]"><Quote size={15}/><span className="font-panel text-[10px] uppercase tracking-widest">Reading protocol</span></div><p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60">The Library preserves a distinction between a confirmed connection and an interpretation. Evidence grades carry over from the Hotel Cinema catalogue.</p><div className="border-t border-[#c5a059]/15 pt-4 flex flex-col gap-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/45"><p><span className="text-[#c5a059]">A</span> direct artist or primary-source connection.</p><p><span className="text-[#c5a059]">B</span> strong reported context, without a direct causal claim.</p><p><span className="text-[#c5a059]">C</span> documented association, not proof of influence.</p></div><p className="font-serif italic text-xs leading-relaxed text-[#f5f2ed]/35 border-t border-[#c5a059]/15 pt-4">New readings can be added later, but this desk begins with traceable sources.</p></aside>
    </div>
  </div>;
}
