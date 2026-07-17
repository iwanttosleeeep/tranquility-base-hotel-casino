import { useState } from "react";
import { Sparkles, Calendar, MapPin, Music } from "lucide-react";

interface TourShow {
  date: string;
  venue: string;
  city: string;
  country: string;
  setlistHighlights: string[];
}

const TOUR_SHOWS: TourShow[] = [
  {
    date: "June 7, 2018",
    venue: "Royal Albert Hall",
    city: "London",
    country: "UK",
    setlistHighlights: ["Four Out of Five", "Star Treatment", "The Ultracheese", "Crying Lightning"]
  },
  {
    date: "July 28, 2018",
    venue: "Forest Hills Stadium",
    city: "New York",
    country: "USA",
    setlistHighlights: ["One Point Perspective", "Four Out of Five", "Tranquility Base", "Cornerstone"]
  },
  {
    date: "October 16, 2018",
    venue: "Hollywood Bowl",
    city: "Los Angeles",
    country: "USA",
    setlistHighlights: ["Star Treatment", "Science Fiction", "Batphone", "Do I Wanna Know?"]
  }
];

export default function BallroomView() {
  const [activeShow, setActiveShow] = useState(TOUR_SHOWS[0]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 06 • Room 06
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Grand Ballroom
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          The Grand Ballroom registers the band's massive 2018 global world tour. Admire vintage-styled gig journals, tour dates, and virtual polaroids capturing live performances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Tour Itinerary List (Left 5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]/50 px-2">
            Tour Logs (Selected Dates)
          </span>
          {TOUR_SHOWS.map((show) => {
            const isActive = activeShow.date === show.date;
            return (
              <button
                key={show.date}
                onClick={() => setActiveShow(show)}
                className={`p-4 rounded border text-left transition-all flex items-start gap-4 ${
                  isActive
                    ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                    : "bg-black/20 border-[#c5a059]/10 text-[#f5f2ed]/60 hover:border-[#c5a059]/30 hover:text-[#f5f2ed]"
                }`}
              >
                <Calendar size={18} className="mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-serif italic font-semibold">{show.venue}</span>
                  <span className="font-mono text-[9px] opacity-60">{show.city}, {show.country} • {show.date}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Performance Journal / Polaroid (Right 7 cols) */}
        <div className="md:col-span-7">
          <div className="p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/30 flex flex-col gap-6 relative min-h-[380px]">
            {/* Gig Info Header */}
            <div className="flex justify-between items-baseline border-b border-[#c5a059]/20 pb-4">
              <div className="flex flex-col">
                <span className="font-serif italic text-2xl text-glow text-[#f5f2ed]">
                  {activeShow.venue} Live Set
                </span>
                <span className="font-mono text-[10px] text-[#c5a059]/70 flex items-center gap-1">
                  <MapPin size={12} />
                  {activeShow.city}, {activeShow.country} • {activeShow.date}
                </span>
              </div>
              <Sparkles size={18} className="text-[#c5a059]/50" />
            </div>

            {/* Setlist Details */}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]/50">
                Lounge-era Setlist Highlights
              </span>
              <ul className="grid grid-cols-2 gap-3">
                {activeShow.setlistHighlights.map((track, idx) => (
                  <li
                    key={track}
                    className="flex items-center gap-2 p-3 rounded bg-[#120e0a]/40 border border-[#c5a059]/10 font-serif text-sm text-[#f5f2ed]/80 hover:text-[#f5f2ed] transition-colors"
                  >
                    <Music size={12} className="text-[#c5a059]" />
                    <span>{track}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Virtual Polaroid Gig Photo (Using Picsum Placeholder formatted as Polaroid) */}
            <div className="mt-4 flex justify-center">
              <div className="bg-white p-4 pb-8 rotate-[-2deg] hover:rotate-0 transition-transform shadow-2xl rounded max-w-[240px] border border-neutral-200">
                <img
                  src={`https://picsum.photos/seed/tbhc-${activeShow.city.toLowerCase()}/400/300?blur=1`}
                  alt={`${activeShow.venue} Live Performance`}
                  referrerPolicy="no-referrer"
                  className="w-full h-32 object-cover filter grayscale sepia opacity-80"
                />
                <span className="block text-center font-mono text-[8px] tracking-wider text-black/60 uppercase mt-4">
                  {activeShow.city} • Tour '18
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
