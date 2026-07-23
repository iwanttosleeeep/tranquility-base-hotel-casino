import { useState, type ComponentType } from "react";
import {
  Moon,
  Rss,
  Cpu,
  Telescope,
  Building2,
  Star,
  ShieldAlert,
  RadioTower,
  BadgeCheck,
  Hourglass,
  Eye,
  ExternalLink,
} from "lucide-react";
import { OBSERVATORY_CONCEPTS } from "../data/observatory";
import type { ObservatoryConcept } from "../data/observatory";

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  Moon,
  Rss,
  Cpu,
  Telescope,
  Building2,
  Star,
  ShieldAlert,
  RadioTower,
  BadgeCheck,
  Hourglass,
};

export default function ObservatoryView() {
  const [activeTopic, setActiveTopic] = useState<ObservatoryConcept>(OBSERVATORY_CONCEPTS[0]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 09 • Room 09
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Observatory
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The observatory scans the conceptual deep space around retro-futurist culture. Lock the
          sector dial onto a coordinate below to read its observation report.
        </p>
        <p className="mt-3 text-xs text-[#f5f2ed]/40 font-serif italic max-w-2xl leading-relaxed">
          A note from the resident astronomer: academic correspondence is not evidence of creative
          influence. These frameworks are instruments for looking, not claims about what any artist read.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sector Dial (Left 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50 px-2">
            Target Coordinates
          </span>
          {OBSERVATORY_CONCEPTS.map((topic, index) => {
            const IconComponent = ICONS[topic.icon] ?? Telescope;
            const isActive = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-4 rounded border text-left transition-all flex items-start gap-4 group ${
                  isActive
                    ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                    : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                }`}
              >
                <div className={`p-2 rounded ${isActive ? "bg-[#c5a059]/20" : "bg-white/5"} mt-0.5`}>
                  <IconComponent size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-panel text-[10px] opacity-40">
                    SECTOR {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="font-serif italic font-semibold">{topic.title}</span>
                  <span className="font-panel text-[11px] opacity-50 truncate">{topic.cluster}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Observatory Panel (Right 7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6 relative min-h-[400px] lg:sticky lg:top-8">
            {/* Visual background radar scan */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02)_0%,transparent_70%)] pointer-events-none" />

            {/* Topic Header */}
            <div className="flex justify-between items-baseline border-b border-[#c5a059]/20 pb-4">
              <div className="flex flex-col">
                <span className="font-serif italic text-2xl text-glow text-[#f5f2ed]">
                  {activeTopic.title}
                </span>
                <span className="font-panel text-[10px] text-[#c5a059]/70">
                  {activeTopic.academicName}
                </span>
              </div>
              <Eye className="text-[#c5a059]/40 animate-pulse shrink-0" size={20} />
            </div>

            {/* Core Definition */}
            <div className="flex flex-col gap-2">
              <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50">
                Core Definition
              </span>
              <p className="font-serif italic text-sm text-[#f5f2ed]/90 leading-relaxed">
                {activeTopic.definition}
              </p>
            </div>

            {/* Observation Report */}
            <div className="flex flex-col gap-2">
              <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50">
                Observation Report
              </span>
              <p className="font-serif text-sm text-[#f5f2ed]/75 leading-relaxed">
                {activeTopic.explanation}
              </p>
            </div>

            {/* Academic References */}
            <div className="p-4 rounded border border-[#c5a059]/15 bg-black/40 flex flex-col gap-3">
              <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/50">
                Academic References
              </span>
              <ol className="flex flex-col gap-2 list-none">
                {activeTopic.references.map((ref) => (
                  <li key={ref.citation} className="font-serif text-xs text-[#f5f2ed]/60 leading-relaxed">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#c5a059] transition-colors inline"
                      >
                        {ref.citation}
                        <ExternalLink size={10} className="inline ml-1 mb-0.5 opacity-50" />
                      </a>
                    ) : (
                      ref.citation
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
