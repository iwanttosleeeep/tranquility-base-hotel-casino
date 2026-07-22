import { motion } from "motion/react";
import { ChevronUp, ChevronDown, Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { HotelRoom } from "../types";
import ElevatorIcon from "./ElevatorIcon";

interface ElevatorProps {
  currentRoom: HotelRoom;
  targetRoom: HotelRoom | null;
  onRoomChange: (room: HotelRoom) => void;
  isMoving: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ROOMS: { key: HotelRoom; label: string; floor: string; desc: string }[] = [
  { key: "ROOFTOP_GARDEN", label: "Rooftop Garden", floor: "09", desc: "Residents' Readings & Transmissions" },
  { key: "ARCHIVE", label: "Hotel Archive", floor: "08", desc: "Recording & Creation Timeline" },
  { key: "CASINO", label: "Clavius Casino", floor: "07", desc: "Interactive Easter Eggs" },
  { key: "BALLROOM", label: "Grand Ballroom", floor: "06", desc: "Tour & Live Performances" },
  { key: "LIBRARY", label: "The Library", floor: "05", desc: "Songs & Lyrical Annotations" },
  { key: "OBSERVATORY", label: "The Observatory", floor: "04", desc: "Sci-Fi & Space Exploration" },
  { key: "CINEMA", label: "Hotel Cinema", floor: "03", desc: "Cinematic & Film Influences" },
  { key: "LOUNGE", label: "The Lounge", floor: "02", desc: "Press & Interview Archives" },
  { key: "RECEPTION", label: "Reception Desk", floor: "01", desc: "Introduction & Register" },
  { key: "LOBBY", label: "The Lobby", floor: "G", desc: "Main Entrance & Directory" },
];

export default function Elevator({ currentRoom, targetRoom, onRoomChange, isMoving, isCollapsed, onToggleCollapse }: ElevatorProps) {
  const currentFloorIdx = ROOMS.findIndex((r) => r.key === currentRoom);
  const targetFloorIdx = targetRoom ? ROOMS.findIndex((r) => r.key === targetRoom) : null;
  const currentFloorLabel = ROOMS[currentFloorIdx]?.floor || "G";

  // Since ROOMS are ordered from top floor (idx 0, floor 09) to bottom floor (idx 9, floor G):
  // Going UP means traveling to a HIGHER floor (so target index is smaller than current index)
  // Going DOWN means traveling to a LOWER floor (so target index is larger than current index)
  const isGoingUp = isMoving && targetFloorIdx !== null && targetFloorIdx < currentFloorIdx;
  const isGoingDown = isMoving && targetFloorIdx !== null && targetFloorIdx > currentFloorIdx;

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="w-[72px] min-h-[260px] p-2 rounded-lg glass-panel border border-[#c5a059]/30 flex flex-col items-center gap-6 relative overflow-hidden bg-black/50"
      >
        <button onClick={onToggleCollapse} title="Expand elevator controls" aria-label="Expand elevator controls" className="w-full p-2 rounded border border-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors">
          <PanelLeftOpen size={19} className="mx-auto" />
        </button>
        <div className="w-full py-3 rounded border border-[#c5a059]/30 bg-[#1a1510] font-tbhc text-center text-2xl text-[#d97706] text-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 animate-pulse pointer-events-none" />
          <motion.span key={currentFloorLabel} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
            {isMoving ? <ElevatorIcon size={22} className="inline-block" /> : currentFloorLabel}
          </motion.span>
        </div>
        <span className="font-panel text-[9px] text-[#c5a059]/70 [writing-mode:vertical-rl] tracking-[0.22em]">Otis Lift</span>
        <div className="mt-auto flex flex-col gap-2 text-[#c5a059]/40">
          <ChevronUp size={19} className={isGoingUp ? "text-[#d97706] animate-bounce" : ""} />
          <ChevronDown size={19} className={isGoingDown ? "text-[#d97706] animate-bounce" : ""} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/[0.03] to-transparent pointer-events-none" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.75 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[28rem] p-8 md:p-9 rounded-lg glass-panel border border-[#c5a059]/25 flex flex-col gap-8 relative overflow-hidden bg-black/40"
    >
      {/* Retro Brass Header */}
      <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-5">
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-serif italic text-[#c5a059] tracking-wide">
            Otis Lift Co.
          </span>
          <span className="text-xs md:text-sm font-serif italic text-[#f5f2ed]/50 tracking-wide mt-1">
            Tranquility Base Sector
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleCollapse} title="Collapse elevator controls" aria-label="Collapse elevator controls" className="p-2 rounded border border-[#c5a059]/20 text-[#c5a059]/70 hover:text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors">
            <PanelLeftClose size={17} />
          </button>
          <div className="flex items-center gap-2 bg-[#1a1510] px-5 py-3 rounded border border-[#c5a059]/30 font-tbhc text-2xl text-[#d97706] tracking-wider text-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 animate-pulse pointer-events-none" />
          <motion.span
            key={currentFloorLabel}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            {isMoving ? <ElevatorIcon size={22} className="inline-block" /> : currentFloorLabel}
          </motion.span>
          </div>
        </div>
      </div>

      {/* Lift Arrow Indicators */}
      <div className="flex justify-center gap-10 text-[#c5a059]/30">
        <ChevronUp 
          size={32} 
          strokeWidth={1}
          className={isGoingUp ? "text-[#d97706] animate-bounce" : ""} 
        />
        <Bell size={24} strokeWidth={1} className="mt-1 hover:text-[#c5a059] cursor-pointer transition-colors" />
        <ChevronDown 
          size={32} 
          strokeWidth={1}
          className={isGoingDown ? "text-[#d97706] animate-bounce" : ""} 
        />
      </div>

      {/* Floor Buttons */}
      <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
        {ROOMS.map(({ key, label, floor, desc }) => {
          const isActive = currentRoom === key;
          return (
            <button
              key={key}
              onClick={() => {
                if (currentRoom !== key && !isMoving) {
                  onRoomChange(key);
                }
              }}
              disabled={isMoving}
              className={`group flex items-center justify-between p-3.5 rounded border text-left transition-all ${
                isActive
                  ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                  : "bg-black/20 border-[#c5a059]/20 text-[#f5f2ed]/60 hover:border-[#c5a059]/50 hover:text-[#f5f2ed]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm md:text-[15px] leading-tight font-serif italic truncate max-w-[150px]">{label}</span>
                <span className="text-[11px] md:text-xs leading-snug font-serif italic opacity-40 group-hover:opacity-100 transition-opacity">
                  {desc}
                </span>
              </div>
              <span className={`font-tbhc text-lg px-2.5 py-1 rounded ${
                isActive ? "bg-[#c5a059]/20" : "bg-white/5"
              }`}>
                {floor}
              </span>
            </button>
          );
        })}
      </div>

      {/* Brass plate texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/[0.02] to-transparent pointer-events-none" />
    </motion.div>
  );
}
