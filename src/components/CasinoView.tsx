import { useState } from "react";
import { Trophy, RefreshCw, Star, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const REEL_ITEMS = [
  { char: "🪐", label: "Hexagon", bonus: "Coordinates locked on Tranquility Base." },
  { char: "🍸", label: "Martini", bonus: "Martini Police sirens heard in deep space." },
  { char: "🤵", label: "Golden Boy", bonus: "Golden Boy is in bad shape today." },
  { char: "⭐️", label: "Star Treatment", bonus: "One of the Strokes has entered the lounge." },
  { char: "🌗", label: "Lunar Surface", bonus: "Take a lift down to Sector 01." }
];

const INTERCOM_LINES = [
  "Front desk to lobby: the moonlit taqueria is fully booked this evening.",
  "Reception notice: Mark is currently directing another call. Please hold.",
  "Housekeeping reports the mirrorball in Suite 505 is spinning unattended.",
  "Observatory bulletin: Earth-rise viewing begins at the top of the hour.",
  "The lounge band kindly requests one more round of applause before the encore."
];

export default function CasinoView() {
  const [reels, setReels] = useState(["🪐", "🍸", "🤵"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState<string | null>(null);
  const [payoutQuote, setPayoutQuote] = useState<string | null>(null);
  const [credits, setCredits] = useState(100);

  const handleSpin = () => {
    if (isSpinning || credits < 10) return;
    
    setIsSpinning(true);
    setWinMsg(null);
    setPayoutQuote(null);
    setCredits((prev) => prev - 10);

    // Simulate ticking reels
    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)].char,
        REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)].char,
        REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)].char
      ]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        
        // Final reel result
        const finalReels = [
          REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)],
          REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)],
          REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)]
        ];
        
        setReels(finalReels.map(r => r.char));
        setIsSpinning(false);

        // Check for matches
        if (finalReels[0].char === finalReels[1].char && finalReels[1].char === finalReels[2].char) {
          // Three of a kind!
          setCredits((prev) => prev + 150);
          setWinMsg(`JACKPOT! Three ${finalReels[0].label}s! ${finalReels[0].bonus}`);
          setPayoutQuote(INTERCOM_LINES[Math.floor(Math.random() * INTERCOM_LINES.length)]);
        } else if (
          finalReels[0].char === finalReels[1].char || 
          finalReels[1].char === finalReels[2].char || 
          finalReels[0].char === finalReels[2].char
        ) {
          // Two of a kind!
          const matchingReel = finalReels[1].char === finalReels[2].char ? finalReels[1] : finalReels[0];
          setCredits((prev) => prev + 25);
          setWinMsg(`PAIR MATCH! ${matchingReel.bonus}`);
          setPayoutQuote(INTERCOM_LINES[Math.floor(Math.random() * INTERCOM_LINES.length)]);
        }
      }
    }, 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 07 • Room 07
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Clavius Casino
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          "Do you celebrate your dark side?" Try your luck at the Clavius lunar slot machine. Spin the reels to align space-age icons and intercept stray transmissions from around the hotel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Slot Machine Core (Left 7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="p-8 rounded-2xl border-4 border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-2xl relative overflow-hidden flex flex-col gap-8 items-center">
            {/* Ambient neon tube outlines */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
            
            {/* Header / Credits display */}
            <div className="w-full flex justify-between items-center bg-black/60 px-4 py-2.5 rounded border border-[#c5a059]/20">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#c5a059]/50">
                  Lunar Credits
                </span>
                <span className="font-tbhc text-xl text-[#d97706] text-glow">
                  ${credits}
                </span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#c5a059]">
                $10 PER SPIN
              </span>
            </div>

            {/* The Reels */}
            <div className="flex gap-4">
              {reels.map((char, index) => (
                <motion.div
                  key={index}
                  animate={isSpinning ? { y: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
                  className="w-20 h-24 md:w-24 md:h-28 rounded-lg bg-black border-2 border-[#c5a059]/30 flex items-center justify-center text-4xl md:text-5xl shadow-inner relative overflow-hidden"
                >
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />
                  <span className="z-10">{char}</span>
                </motion.div>
              ))}
            </div>

            {/* Spin Lever Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || credits < 10}
              className={`w-full max-w-xs py-4 rounded-lg font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                isSpinning
                  ? "bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#c5a059]/40 cursor-not-allowed"
                  : credits < 10
                  ? "bg-red-950 border border-red-900/40 text-red-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c5a059] to-[#d97706] hover:brightness-110 active:scale-95 text-black font-semibold shadow-lg shadow-[#c5a059]/10"
              }`}
            >
              <RefreshCw size={14} className={isSpinning ? "animate-spin" : ""} />
              {isSpinning ? "Spinning Reels..." : credits < 10 ? "Insufficient Credits" : "Pull Lever (Spin)"}
            </button>
          </div>
        </div>

        {/* Payout & Log Panel (Right 5 cols) */}
        <div className="md:col-span-5">
          <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-6 min-h-[300px]">
            <div className="flex items-center gap-2 border-b border-[#c5a059]/20 pb-3">
              <Trophy className="text-[#c5a059]" size={16} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a059]">
                Payout Registry
              </span>
            </div>

            <AnimatePresence mode="wait">
              {winMsg ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-4"
                >
                  <div className="p-4 rounded border border-[#c5a059]/30 bg-[#c5a059]/5 text-glow font-serif italic text-xs text-[#c5a059]">
                    {winMsg}
                  </div>

                  {payoutQuote && (
                    <div className="flex flex-col gap-2 p-4 rounded bg-white/5 border border-white/5">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-[#f5f2ed]/40 flex items-center gap-1">
                        <Star size={8} className="text-[#c5a059]" />
                        Hotel Intercom • Overheard
                      </span>
                      <p className="font-serif italic text-sm text-[#f5f2ed]/90">
                        {payoutQuote}
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4 text-xs font-serif text-[#f5f2ed]/60 leading-relaxed"
                >
                  <div className="flex items-start gap-2 text-glow text-[#c5a059]/80">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <span>Spin coordinates rules:</span>
                  </div>
                  <p>Align any 3 matching icons to trigger a mega jackpot and claim a deluxe 150-credit payout.</p>
                  <p>Match any 2 adjacent icons to receive a comfortable 25-credit payout and a stray intercom transmission.</p>
                  {credits < 10 && (
                    <button
                      onClick={() => setCredits(100)}
                      className="mt-4 font-mono text-[10px] uppercase text-[#c5a059] hover:text-[#d97706] transition-colors border border-[#c5a059]/20 rounded py-2 text-center"
                    >
                      [ Request Complimentary 100 Credits ]
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
