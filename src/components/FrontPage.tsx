import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, KeyRound } from "lucide-react";
import AmpersandEgg from "./AmpersandEgg";
import albumCoverAvif from "../../assets/TBHC.avif";
import albumCoverWebp from "../../assets/TBHC.webp";
import albumCoverPng from "../../assets/TBHC.png";

interface FrontPageProps {
  guestName: string;
  guestRoom: string;
  isGuestLoading: boolean;
  onRegister: () => void;
  onEnterHotel: () => void;
  onVisitHotel: () => void;
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

export default function FrontPage({ guestName, guestRoom, isGuestLoading, onRegister, onEnterHotel, onVisitHotel }: FrontPageProps) {
  const reduceMotion = useReducedMotion();
  const [titleSettled, setTitleSettled] = useState(false);

  // Arrival sequence: the lobby lights come on in order.
  const at = (t: number) => (reduceMotion ? 0 : t);
  const rise = (t: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: at(t), ease: "easeOut" as const },
  });

  return (
    <main className="front-page min-h-screen text-[#f5f2ed] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#070604]" />
      <picture className="absolute inset-0 block opacity-55">
        <source srcSet={albumCoverAvif} type="image/avif" />
        <source srcSet={albumCoverWebp} type="image/webp" />
        <img
          src={albumCoverPng}
          alt=""
          aria-hidden="true"
          width="1000"
          height="1000"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_60%] lobby-drift"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-[#080705]/95 via-[#080705]/72 to-[#080705]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080705] via-transparent to-[#080705]/45" />
      <div className="absolute inset-0 signal-interference bg-white/5 mix-blend-overlay opacity-20" />

      {/* Hotel-stationery frame */}
      <motion.div
        aria-hidden="true"
        className="lobby-frame absolute inset-3 md:inset-5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.4, delay: at(0.1) }}
      />

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 py-4 md:px-12 md:py-6 flex flex-col">
        <motion.header {...rise(0.2)} className="flex items-center justify-end border-b border-[#e9d8bd]/20 pb-5">
          <span className="font-panel text-[10px] md:text-xs text-[#c5a059]">Ground Floor · Lobby</span>
        </motion.header>

        <section className="flex-1 flex items-center py-14 md:py-20">
          <div className="max-w-2xl">
            <motion.p {...rise(0.45)} className="font-panel text-xl md:text-3xl tracking-[0.18em] text-[#c5a059] mb-5">
              Welcome to
            </motion.p>

            <h1 aria-label="Tranquility Base Hotel & Casino" className="font-tbhc text-4xl leading-[1.15] md:text-7xl tracking-wide glow-bloom mb-7">
              <span className={`block ${titleSettled ? "overflow-visible" : "overflow-hidden"}`}>
                <motion.span
                  className="block"
                  initial={{ y: reduceMotion ? 0 : "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.85, delay: at(0.65), ease: [0.16, 1, 0.3, 1] }}
                >
                  Tranquility Base
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: reduceMotion ? 0 : "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.85, delay: at(0.82), ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => setTitleSettled(true)}
                >
                  Hotel <AmpersandEgg /> Casino
                </motion.span>
              </span>
            </h1>

            <motion.p {...rise(1.15)} className="relative font-serif italic text-xl md:text-3xl leading-snug text-[#f5f2ed]/85 max-w-xl">
              <span aria-hidden="true" className="lobby-quote-mark">“</span>
              “Hotel room Holy Bible / Hotel room free love revival”
            </motion.p>

            <div className="mt-10 flex items-center gap-1.5 text-[#c5a059]" aria-label="Four stars out of five">
              {[0, 1, 2, 3].map((star) => (
                <motion.span
                  key={star}
                  className="star-lit"
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: at(1.5 + star * 0.16), ease: "backOut" }}
                >
                  <RatingStar filled />
                </motion.span>
              ))}
              <motion.span
                className="star-faulty text-[#c5a059]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0, delay: at(2.2) }}
              >
                <RatingStar />
              </motion.span>
            </div>

            <motion.div {...rise(2.5)} className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {isGuestLoading ? (
                <button disabled className="front-action-button opacity-60 cursor-wait">
                  <KeyRound size={16} /> Retrieving room key
                </button>
              ) : guestName ? (
                <button onClick={onEnterHotel} className="front-action-button">
                  Return to suite {guestRoom} <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button onClick={onRegister} className="front-action-button">
                    <KeyRound size={16} /> Register at Reception
                  </button>
                  <button onClick={onVisitHotel} className="front-visitor-button">
                    Day Visitor <ArrowRight size={16} />
                  </button>
                </>
              )}
              <span className="font-serif italic text-sm text-[#f5f2ed]/60">
                {isGuestLoading ? "Consulting the guest register…" : guestName ? `Welcome back, ${guestName}.` : "Public floors are open; resident services require check-in."}
              </span>
            </motion.div>
          </div>
        </section>

        <motion.footer {...rise(2.9)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-[#e9d8bd]/20 pt-5 font-panel text-[9px] md:text-[10px] text-[#f5f2ed]/45">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              Transmitting Secure Line
            </span>
            <span>|</span>
            <span>Terminal: The Moon</span>
          </div>
          <span>Reception Desk · Floor 01</span>
        </motion.footer>
      </div>
    </main>
  );
}
