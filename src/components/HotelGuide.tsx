import { useEffect } from "react";
import { BookOpen, ConciergeBell, Dices, KeyRound, X } from "lucide-react";
import { motion } from "motion/react";

const FLOORS = [
  ["G", "The Lobby", "Main entrance, hotel directory and the quickest overview of every floor."],
  ["01", "Reception Desk", "Register, change your name or room number, check out, and leave feedback for Reception."],
  ["02", "The Lounge", "A chronological archive of interviews, sourced quotations and official recordings."],
  ["03", "Hotel Cinema", "Music-video shot, colour and music-image analysis with timecoded viewing notes."],
  ["04", "Cocktail Bar", "Instrument tutorials and measured arrangement readouts from privately analysed audio."],
  ["05", "The Library", "Song dossiers, verified annotations, references and links to official lyrics."],
  ["06", "Grand Ballroom", "Tour history, performance records, setlists and live arrangement notes."],
  ["07", "Clavius Casino", "A lunar slot machine for collecting stray hotel transmissions."],
  ["08", "Hotel Archive", "The album-era timeline and evidence-graded catalogue of verified references."],
  ["09", "The Observatory", "Academic frameworks for reading the album's retro-futurist world."],
  ["10", "Rooftop Garden", "Published critical reception followed by the residents' own guest book."],
] as const;

export default function HotelGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotel-guide-title"
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        className="w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-xl border border-[#c5a059]/30 bg-[#0d0c0a] shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-[#c5a059]/20 bg-[#0d0c0a]/95 backdrop-blur-md p-5 md:p-7">
          <div className="flex items-start gap-3">
            <BookOpen size={21} className="mt-1 shrink-0 text-[#c5a059]" />
            <div>
              <span className="font-panel text-[9px] uppercase tracking-[0.28em] text-[#c5a059]/55">For residents &amp; visitors</span>
              <h2 id="hotel-guide-title" className="mt-1 font-serif italic text-2xl md:text-3xl text-[#f5f2ed]">Guest Guide</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close guest guide" className="p-2 text-[#f5f2ed]/45 hover:text-[#c5a059]"><X size={19} /></button>
        </header>

        <div className="p-5 md:p-7 flex flex-col gap-8">
          <section>
            <div className="mb-4 flex items-center gap-3"><KeyRound size={16} className="text-[#c5a059]" /><h3 className="font-serif italic text-xl text-[#f5f2ed]">Your stay</h3></div>
            <p className="max-w-3xl font-serif text-sm leading-relaxed text-[#f5f2ed]/60">
              The archive is open to everyone. Checking in by email gives you a three-digit room key, a private Suite, Room Service, Kept Receipts and permission to sign the Garden guest book. Your Suite number can be changed at Reception.
            </p>
          </section>

          <section>
            <h3 className="mb-4 border-b border-[#c5a059]/15 pb-3 font-serif italic text-xl text-[#f5f2ed]">Hotel directory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7">
              {FLOORS.map(([floor, name, description]) => (
                <div key={floor} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-white/[0.06] py-3">
                  <span className="font-tbhc text-sm tracking-wider text-[#c5a059]">{floor}</span>
                  <div><h4 className="font-serif italic text-[#f5f2ed]/85">{name}</h4><p className="mt-1 font-serif text-xs leading-relaxed text-[#f5f2ed]/45">{description}</p></div>
                </div>
              ))}
              <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-white/[0.06] py-3">
                <span className="font-tbhc text-sm tracking-wider text-[#c5a059]">KEY</span>
                <div><h4 className="font-serif italic text-[#f5f2ed]/85">Your Suite</h4><p className="mt-1 font-serif text-xs leading-relaxed text-[#f5f2ed]/45">Your night counter, private Room Service and the papers you choose to keep.</p></div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="border border-[#c5a059]/15 bg-black/25 p-5">
              <div className="mb-3 flex items-center gap-3"><Dices size={17} className="text-[#c5a059]" /><h3 className="font-serif italic text-lg text-[#f5f2ed]">Casino rules</h3></div>
              <ul className="space-y-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/55">
                <li>Each visit begins with 100 Lunar Credits; one spin costs 10.</li>
                <li>A matching pair pays 25 credits. Three matching symbols pay 150.</li>
                <li>Pair and jackpot transmissions can be filed with <span className="text-[#c5a059]">Keep this</span>.</li>
                <li>If the balance falls below 10, Reception offers 100 complimentary credits.</li>
              </ul>
            </section>
            <section className="border border-[#c5a059]/15 bg-black/25 p-5">
              <div className="mb-3 flex items-center gap-3"><ConciergeBell size={17} className="text-[#c5a059]" /><h3 className="font-serif italic text-lg text-[#f5f2ed]">Room Service</h3></div>
              <ul className="space-y-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/55">
                <li>The kitchen prepares up to three generated menus per local calendar day.</li>
                <li>Lunar Credit bills are decorative and do not affect Casino credits.</li>
                <li><span className="text-[#c5a059]">Keep this</span> files a menu in Kept Receipts and clears the service card.</li>
                <li>Kept Receipts combines saved menus and Casino records, newest first; every receipt can be discarded by its guest.</li>
              </ul>
            </section>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
