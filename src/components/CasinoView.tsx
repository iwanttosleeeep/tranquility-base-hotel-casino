import { useRef, useState, type ComponentType } from "react";
import { Trophy, RefreshCw, Star, Info, Hexagon, Martini, Crown, Moon, Radio, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ReelItem = { id: string; icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; bonus: string; frequency: number; waveform: OscillatorType };

const REEL_ITEMS: ReelItem[] = [
  { id: "hexagon", icon: Hexagon, label: "Hexagon", bonus: "Coordinates locked on Tranquility Base.", frequency: 220, waveform: "triangle" },
  { id: "martini", icon: Martini, label: "Martini", bonus: "Martini Police sirens heard in deep space.", frequency: 329.63, waveform: "sine" },
  { id: "golden-boy", icon: Crown, label: "Golden Boy", bonus: "Golden Boy is in bad shape today.", frequency: 261.63, waveform: "sawtooth" },
  { id: "star-treatment", icon: Star, label: "Star Treatment", bonus: "One of the Strokes has entered the lounge.", frequency: 440, waveform: "square" },
  { id: "lunar-surface", icon: Moon, label: "Lunar Surface", bonus: "Take a lift down to Sector 01.", frequency: 164.81, waveform: "sine" }
];

const intercomLines = (guestRoom: string) => [
  "Front desk to lobby: the moonlit taqueria is fully booked this evening.",
  "Reception notice: Mark is currently directing another call. Please hold.",
  `Housekeeping reports the mirrorball in Suite ${guestRoom} is spinning unattended.`,
  "Observatory bulletin: Earth-rise viewing begins at the top of the hour.",
  "The lounge band kindly requests one more round of applause before the encore."
];

function playTransmission(context: AudioContext, item: ReelItem, jackpot: boolean) {
  const now = context.currentTime;
  const notes = jackpot ? [1, 1.25, 1.5, 2] : [1, 1.25];
  notes.forEach((ratio, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * (jackpot ? 0.14 : 0.11);
    const length = jackpot ? 0.32 : 0.18;
    oscillator.type = item.waveform;
    oscillator.frequency.setValueAtTime(item.frequency * ratio, start);
    gain.gain.setValueAtTime(jackpot ? 0.055 : 0.028, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(start); oscillator.stop(start + length);
  });
}

export default function CasinoView({ guestRoom }: { guestRoom: string }) {
  const [reels, setReels] = useState(["hexagon", "martini", "golden-boy"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMsg, setWinMsg] = useState<string | null>(null);
  const [payoutQuote, setPayoutQuote] = useState<string | null>(null);
  const [credits, setCredits] = useState(100);
  const audioContextRef = useRef<AudioContext | null>(null);
  const getItem = (id: string) => REEL_ITEMS.find((item) => item.id === id) ?? REEL_ITEMS[0];

  const ensureAudio = () => {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return null;
    if (!audioContextRef.current) audioContextRef.current = new AudioContextConstructor();
    void audioContextRef.current.resume();
    return audioContextRef.current;
  };

  const handleSpin = () => {
    if (isSpinning || credits < 10) return;
    const audio = ensureAudio();
    setIsSpinning(true); setWinMsg(null); setPayoutQuote(null); setCredits((previous) => previous - 10);
    let counter = 0;
    const interval = window.setInterval(() => {
      setReels(Array.from({ length: 3 }, () => REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)].id));
      counter += 1;
      if (counter <= 10) return;
      window.clearInterval(interval);
      const finalReels = Array.from({ length: 3 }, () => REEL_ITEMS[Math.floor(Math.random() * REEL_ITEMS.length)]);
      setReels(finalReels.map((item) => item.id)); setIsSpinning(false);
      const matching = finalReels.find((item) => finalReels.filter((candidate) => candidate.id === item.id).length >= 2);
      if (!matching) return;
      const isJackpot = finalReels.every((item) => item.id === matching.id);
      setCredits((previous) => previous + (isJackpot ? 150 : 25));
      setWinMsg(isJackpot ? `JACKPOT! Three ${matching.label}s! ${matching.bonus}` : `PAIR MATCH! ${matching.bonus}`);
      setPayoutQuote(intercomLines(guestRoom)[Math.floor(Math.random() * intercomLines(guestRoom).length)]);
      if (audio) playTransmission(audio, matching, isJackpot);
    }, 100);
  };

  return <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
    <div><span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 07 • Room 07</span><h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Clavius Casino</h2><p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">“Do you celebrate your dark side?” Spin the lunar reels to align original hotel transmissions from around the casino.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"><div className="md:col-span-7 flex flex-col gap-6"><div className="p-8 rounded-2xl border-4 border-neutral-700 bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-2xl relative overflow-hidden flex flex-col gap-8 items-center"><div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent"/><div className="w-full flex justify-between items-center bg-black/60 px-4 py-2.5 rounded border border-[#c5a059]/20"><div className="flex flex-col"><span className="font-panel text-[10px] uppercase tracking-wider text-[#c5a059]/50">Lunar Credits</span><span className="font-tbhc text-xl text-[#d97706] text-glow">${credits}</span></div><span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]">$10 PER SPIN</span></div><div className="flex gap-4">{reels.map((id, index) => { const Icon = getItem(id).icon; return <motion.div key={index} animate={isSpinning ? { y: [0, -10, 10, 0] } : {}} transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }} className="w-20 h-24 md:w-24 md:h-28 rounded-lg bg-black border-2 border-[#c5a059]/30 flex items-center justify-center shadow-inner relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none"/><Icon size={42} strokeWidth={1.25}/></motion.div>; })}</div><button onClick={handleSpin} disabled={isSpinning || credits < 10} className={`w-full max-w-xs py-4 rounded-lg font-panel text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isSpinning ? "bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#c5a059]/40 cursor-not-allowed" : credits < 10 ? "bg-red-950 border border-red-900/40 text-red-400 cursor-not-allowed" : "bg-gradient-to-r from-[#c5a059] to-[#d97706] hover:brightness-110 active:scale-95 text-black font-semibold shadow-lg shadow-[#c5a059]/10"}`}><RefreshCw size={14} className={isSpinning ? "animate-spin" : ""}/>{isSpinning ? "Spinning Reels..." : credits < 10 ? "Insufficient Credits" : "Pull Lever (Spin)"}</button></div></div>
      <div className="md:col-span-5"><div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-6 min-h-[300px]"><div className="flex items-center gap-2 border-b border-[#c5a059]/20 pb-3"><Trophy className="text-[#c5a059]" size={16}/><span className="font-panel text-[11px] uppercase tracking-widest text-[#c5a059]">Payout Registry</span></div><AnimatePresence mode="wait">{winMsg ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4"><div className="p-4 rounded border border-[#c5a059]/30 bg-[#c5a059]/5 text-glow font-serif italic text-xs text-[#c5a059]">{winMsg}</div>{payoutQuote && <div className="flex flex-col gap-2 p-4 rounded bg-white/5 border border-white/5"><span className="font-panel text-[10px] uppercase tracking-wider text-[#f5f2ed]/40 flex items-center gap-1"><Radio size={10} className="text-[#c5a059]"/>Hotel Intercom • Overheard</span><p className="font-serif italic text-sm text-[#f5f2ed]/90">{payoutQuote}</p></div>}</motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 text-xs font-serif text-[#f5f2ed]/60 leading-relaxed"><div className="flex items-start gap-2 text-glow text-[#c5a059]/80"><Info size={14} className="mt-0.5 shrink-0"/><span>Transmission rules:</span></div><p>Align any 3 matching symbols for 150 credits and a full original lunar fanfare. Any pair earns 25 credits and a short transmission.</p><div className="grid grid-cols-5 gap-2 border-y border-[#c5a059]/10 py-3">{REEL_ITEMS.map((item) => { const Icon = item.icon; return <div key={item.id} className="flex flex-col items-center gap-1 text-[#c5a059]/70"><Icon size={17} strokeWidth={1.25}/><span className="sr-only">{item.label}</span></div>; })}</div><p className="flex items-center gap-2 text-[#f5f2ed]/40"><Volume2 size={12} className="text-[#c5a059]"/>All casino sounds are original browser synthesis.</p>{credits < 10 && <button onClick={() => setCredits(100)} className="mt-2 font-panel text-[10px] uppercase text-[#c5a059] hover:text-[#d97706] transition-colors border border-[#c5a059]/20 rounded py-2 text-center">[ Request Complimentary 100 Credits ]</button>}</motion.div>}</AnimatePresence></div></div></div>
  </div>;
}
