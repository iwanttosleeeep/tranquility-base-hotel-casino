import { Music2, Martini, Wrench } from "lucide-react";

export default function CocktailBarView() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 04 • Room 04</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Cocktail Bar</h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          A low-lit service counter for learning the arrangements: tutorials, instrumental details, and the changing mechanics of the record.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#c5a059]"><Martini size={21} /><span className="font-serif italic text-xl text-[#f5f2ed]">Tutorial Pour</span></div>
          <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60">A curated shelf of external performance and instrument tutorials for guests who want to learn their way around the bar.</p>
          <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60">Menu being prepared</span>
        </div>
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#c5a059]"><Music2 size={21} /><span className="font-serif italic text-xl text-[#f5f2ed]">Arrangement Service</span></div>
          <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/60">Future analysis of rhythm, melody, vocals, instruments, and the way each part changes the whole arrangement.</p>
          <div className="flex items-center gap-2 font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/60"><Wrench size={12} /> Signal calibration in progress</div>
        </div>
      </div>
    </div>
  );
}
