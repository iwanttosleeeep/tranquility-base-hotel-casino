import { useState } from "react";
import { Moon, Eye, ShieldAlert, Cpu, Heart } from "lucide-react";

interface ThemeTopic {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  concept: string;
  lyricsQuote: string;
  songTitle: string;
  analysis: string;
}

const CONCEPTS: ThemeTopic[] = [
  {
    id: "lunar-resort",
    icon: Moon,
    title: "The Moon Resort",
    subtitle: "Apollo 11 & Tranquility Base",
    concept: "Using the iconic Apollo 11 lunar landing site ('Tranquility Base') as a tacky, mid-century lounge resort metaphor to satirize the corporate takeover of humanity's greatest achievements.",
    lyricsQuote: "Jesus in the day spa, filling out information forms / Mama got her hair done, just like a woman in a movie",
    songTitle: "Tranquility Base Hotel & Casino",
    analysis: "Rather than treating the moon as a noble, pristine environment for scientific progress, Alex Turner visualizes it as an overdeveloped commercial grid filled with luxury spas, review cultures, and a mediocre Yelp rating. This estrangement allows him to critique how late capitalism commodifies everything sacred."
  },
  {
    id: "information-overload",
    icon: ShieldAlert,
    title: "Information Action Ratio",
    subtitle: "Neil Postman's Media Theory",
    concept: "Explores the paralysis of consuming endless digital content without any physical agency to act upon it, a core concept borrowed directly from Neil Postman's 1985 book 'Amusing Ourselves to Death'.",
    lyricsQuote: "Information action ratio / Only time that I can feel it / Four out of five / And that's unheard of",
    songTitle: "Four Out of Five",
    analysis: "Postman argued that telecommunications severed the link between receiving information and being able to act on it. Turner translates this into a lunar feeling—isolation within a loop where screens tell you everything but leave you completely powerless, creating a numbing but comfortable existential loop."
  },
  {
    id: "virtual-isolation",
    icon: Cpu,
    title: "The Virtual Simulation",
    subtitle: "Fassbinder & Avatars",
    concept: "The transition of identity from physical reality to simulated online personalities, where human connection is reduced to superficial feeds ('She looks like fun') and actions are highly automated.",
    lyricsQuote: "You push a button and a million people die / She looks like fun / Singsong 'round the money tree",
    songTitle: "She Looks Like Fun",
    analysis: "With references to Fassbinder's 'World on a Wire', the album questions whether we are already living inside our own feedback loops. In this simulated casino, physical contact is rare. Interactions occur via 'Batphone' or by reviewing others, highlighting a deep-seated spiritual alienation."
  },
  {
    id: "sincerity-nostalgia",
    icon: Heart,
    title: "Physical Sincerity",
    subtitle: "The Anchor of Nostalgia",
    concept: "The underlying yearning for real, analog human touch, physical photograph prints, and face-to-face dialogue amidst a flat, digital landscape.",
    lyricsQuote: "Still got pictures of friends on the wall / I suppose we aren't really friends anymore / But I haven't stopped loving you once",
    songTitle: "The Ultracheese",
    analysis: "The final track, 'The Ultracheese', serves as a grounding wire. After ten tracks of high-concept deep space science fiction, corporate hotels, and digital screens, Turner strips away the sci-fi armor. He reveals a deeply human, emotional space of regret, love, and real physical memory."
  }
];

export default function ObservatoryView() {
  const [activeTopic, setActiveTopic] = useState(CONCEPTS[0]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 04 • Room 04
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Observatory
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The observatory scans deep space and technological themes. Click a sector dial below to lock coordinates on different philosophical concepts guiding Tranquility Base.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sector Dial (Left 4 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50 px-2">
            Target Coordinates
          </span>
          {CONCEPTS.map((topic) => {
            const IconComponent = topic.icon;
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
                <div className="flex flex-col">
                  <span className="font-serif italic font-semibold">{topic.title}</span>
                  <span className="font-panel text-[11px] opacity-50">{topic.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Observatory Panel (Right 7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col gap-6 relative min-h-[400px]">
            {/* Visual background radar scan */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.02)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Topic Header */}
            <div className="flex justify-between items-baseline border-b border-[#c5a059]/20 pb-4">
              <div className="flex flex-col">
                <span className="font-serif italic text-2xl text-glow text-[#f5f2ed]">
                  {activeTopic.title}
                </span>
                <span className="font-panel text-[10px] text-[#c5a059]/70">
                  {activeTopic.subtitle}
                </span>
              </div>
              <Eye className="text-[#c5a059]/40 animate-pulse" size={20} />
            </div>

            {/* Core Concept Brief */}
            <div className="flex flex-col gap-2">
              <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50">
                Core Concept
              </span>
              <p className="font-serif italic text-sm text-[#f5f2ed]/90 leading-relaxed">
                "{activeTopic.concept}"
              </p>
            </div>

            {/* Fictional/Lyrical quote card */}
            <div className="p-4 rounded border border-[#c5a059]/15 bg-black/40 flex flex-col gap-2">
              <span className="font-panel text-[10px] uppercase tracking-widest text-[#c5a059]/50">
                Lyrical Reference • Song: {activeTopic.songTitle}
              </span>
              <p className="font-serif italic text-[#c5a059] text-sm tracking-tight leading-normal whitespace-pre-line">
                {activeTopic.lyricsQuote}
              </p>
            </div>

            {/* Analytical Commentary */}
            <div className="flex flex-col gap-2">
              <span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]/50">
                Observatory Report Analysis
              </span>
              <p className="font-serif text-xs text-[#f5f2ed]/70 leading-relaxed">
                {activeTopic.analysis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
