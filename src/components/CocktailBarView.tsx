import { ExternalLink, Music2, Martini, Wrench } from "lucide-react";

const TUTORIAL_PLAYLISTS = [
  {
    name: "Piano",
    listId: "PLY-HuGVAXY1koMpNamtePjuSD5al1JN5w",
    url: "https://youtube.com/playlist?list=PLY-HuGVAXY1koMpNamtePjuSD5al1JN5w&si=aKmZZmvgtQBttHFo"
  },
  {
    name: "Guitar",
    listId: "PL4nYsJ3tuKTkbvyNoDBpAAevWX4mx5jUz",
    url: "https://youtube.com/playlist?list=PL4nYsJ3tuKTkbvyNoDBpAAevWX4mx5jUz&si=BhxhmYK1vIbQ4w9F",
    note: "Compiled from multiple creators; tutorial formats and difficulty vary by song."
  },
  {
    name: "Bass",
    listId: "PLda-GhTIiuF1ul_A-Al0rrQBAwuh6AdGK",
    url: "https://youtube.com/playlist?list=PLda-GhTIiuF1ul_A-Al0rrQBAwuh6AdGK&si=zZadqfhghxHTsgIZ"
  },
  {
    name: "Drums",
    listId: "PL2QGx4SN31i_VDf4Lk6JGZAt88vmVfiRC",
    url: "https://youtube.com/playlist?list=PL2QGx4SN31i_VDf4Lk6JGZAt88vmVfiRC&si=Mv62xURgTolM6m8i",
    note: "Recreated drum tracks for practice; not official isolated stems or Matt Helders’ original drum recordings."
  }
];

export default function CocktailBarView() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 04 • Room 04</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Cocktail Bar</h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          A low-lit service counter for learning the arrangements: tutorials, instrumental details, and the changing mechanics of the record.
        </p>
      </div>

      <section className="p-5 md:p-7 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[#c5a059]"><Martini size={21} /><span className="font-serif italic text-xl text-[#f5f2ed]">Tutorial Pour</span></div>
          <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60 max-w-2xl">A curated shelf of external performance and instrument tutorials for guests who want to learn their way around the bar.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {TUTORIAL_PLAYLISTS.map((playlist) => (
            <article key={playlist.listId} className="rounded border border-[#c5a059]/15 bg-black/25 overflow-hidden flex flex-col">
              <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                <h3 className="font-serif italic text-lg text-[#f5f2ed]">{playlist.name}</h3>
                <a href={playlist.url} target="_blank" rel="noreferrer" className="font-panel text-[9px] uppercase tracking-wide text-[#c5a059] hover:text-[#f5f2ed] inline-flex items-center gap-1 shrink-0">Open on YouTube <ExternalLink size={10} /></a>
              </div>
              <iframe
                className="w-full aspect-video border-y border-[#c5a059]/10 bg-black"
                src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlist.listId}`}
                title={`${playlist.name} tutorial playlist`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {playlist.note && <p className="px-4 py-3 font-serif text-xs leading-relaxed text-[#f5f2ed]/50">{playlist.note}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-[#c5a059]"><Music2 size={21} /><span className="font-serif italic text-xl text-[#f5f2ed]">Arrangement Service</span></div>
        <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60">Future analysis of rhythm, melody, vocals, instruments, and the way each part changes the whole arrangement.</p>
        <div className="flex items-center gap-2 font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60"><Wrench size={12} /> Signal calibration in progress</div>
      </section>
    </div>
  );
}
