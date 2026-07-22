import { motion } from "motion/react";
import { ArrowRight, KeyRound } from "lucide-react";
import albumCover from "../../assets/TBHC.png";

interface FrontPageProps {
  guestName: string;
  guestRoom: string;
  onRegister: () => void;
  onEnterHotel: () => void;
}

function RatingStar({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6">
      {filled ? (
        <path fill="currentColor" d="m12 17.27-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21z" />
      ) : (
        <path fill="currentColor" d="m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24ZM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4Z" />
      )}
    </svg>
  );
}

export default function FrontPage({ guestName, guestRoom, onRegister, onEnterHotel }: FrontPageProps) {
  return (
    <main className="front-page min-h-screen text-[#f5f2ed] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#070604]" />
      <div
        className="absolute inset-0 bg-cover bg-[center_60%] opacity-55 scale-105"
        style={{ backgroundImage: `url(${albumCover})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080705]/95 via-[#080705]/72 to-[#080705]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-[#080705]/45" />
      <div className="absolute inset-0 signal-interference bg-white/5 mix-blend-overlay opacity-20" />

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 py-4 md:px-12 md:py-6 flex flex-col">
        <header className="flex items-center justify-end border-b border-[#e9d8bd]/20 pb-5">
          <span className="font-panel text-[10px] md:text-xs text-[#c5a059]">Ground Floor · Lobby</span>
        </header>

        <section className="flex-1 flex items-center py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="font-panel text-xl md:text-3xl tracking-[0.18em] text-[#c5a059] mb-5">Welcome to</p>
            <h1 className="font-tbhc text-4xl leading-[1.15] md:text-7xl tracking-wide text-glow mb-7">
              Tranquility Base<br />Hotel <span className="font-serif italic normal-case text-[#c5a059] mx-1.5">&amp;</span> Casino
            </h1>
            <p className="font-serif italic text-xl md:text-3xl leading-snug text-[#f5f2ed]/85 max-w-xl">
              “Hotel room Holy Bible / Hotel room free love revival”
            </p>

            <div className="mt-10 flex items-center gap-1.5 text-[#c5a059]" aria-label="Four stars out of five">
              {[0, 1, 2, 3].map((star) => <span key={star}><RatingStar filled /></span>)}
              <span className="text-[#c5a059]/45"><RatingStar /></span>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {guestName ? (
                <button onClick={onEnterHotel} className="front-action-button">
                  Return to suite {guestRoom} <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={onRegister} className="front-action-button">
                  <KeyRound size={16} /> Register at Reception
                </button>
              )}
              <span className="font-serif italic text-sm text-[#f5f2ed]/60">
                {guestName ? `Welcome back, ${guestName}.` : "A reservation is required before entry."}
              </span>
            </div>
          </motion.div>
        </section>

        <footer className="flex items-center border-t border-[#e9d8bd]/20 pt-5 font-panel text-[9px] md:text-[10px] text-[#f5f2ed]/45">
          <span>Reception Desk · Floor 01</span>
        </footer>
      </div>
    </main>
  );
}
