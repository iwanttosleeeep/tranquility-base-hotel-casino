import { motion } from "motion/react";
import { ChevronUp, ChevronDown, Bell } from "lucide-react";
import { HotelRoom } from "../types";
import ElevatorIcon from "./ElevatorIcon";

interface ElevatorProps {
  currentRoom: HotelRoom;
  targetRoom: HotelRoom | null;
  onRoomChange: (room: HotelRoom) => void;
  isMoving: boolean;
}

const ROOMS: { key: HotelRoom; label: string; floor: string; desc: string }[] = [
  { key: "ROOFTOP_GARDEN", label: "Rooftop Garden", floor: "09", desc: "Essays & Interpretations" },
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

export default function Elevator({ currentRoom, targetRoom, onRoomChange, isMoving }: ElevatorProps) {
  const currentFloorIdx = ROOMS.findIndex((r) => r.key === currentRoom);
  const targetFloorIdx = targetRoom ? ROOMS.findIndex((r) => r.key === targetRoom) : null;
  const currentFloorLabel = ROOMS[currentFloorIdx]?.floor || "G";

  // Since ROOMS are ordered from top floor (idx 0, floor 09) to bottom floor (idx 9, floor G):
  // Going UP means traveling to a HIGHER floor (so target index is smaller than current index)
  // Going DOWN means traveling to a LOWER floor (so target index is larger than current index)
  const isGoingUp = isMoving && targetFloorIdx !== null && targetFloorIdx < currentFloorIdx;
  const isGoingDown = isMoving && targetFloorIdx !== null && targetFloorIdx > currentFloorIdx;

  return (
    <div className="w-full max-w-sm p-6 rounded-lg glass-panel border border-[#c5a059]/20 flex flex-col gap-6 relative overflow-hidden bg-black/40">
      {/* Retro Brass Header */}
      <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-4">
        <div className="flex flex-col">
          <span className="text-xs font-serif italic text-[#c5a059] tracking-wide">
            Otis Lift Co.
          </span>
          <span className="text-xs font-serif italic text-[#f5f2ed]/50 tracking-wide mt-0.5">
            Tranquility Base Sector
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1510] px-4 py-2 rounded border border-[#c5a059]/30 font-tbhc text-xl text-[#d97706] tracking-wider text-glow relative overflow-hidden">
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

      {/* Lift Arrow Indicators */}
      <div className="flex justify-center gap-8 text-[#c5a059]/30">
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
      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
              className={`group flex items-center justify-between p-3 rounded border text-left transition-all ${
                isActive
                  ? "bg-[#c5a059]/10 border-[#c5a059] text-[#c5a059]"
                  : "bg-black/20 border-[#c5a059]/20 text-[#f5f2ed]/60 hover:border-[#c5a059]/50 hover:text-[#f5f2ed]"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-serif italic truncate max-w-[120px]">{label}</span>
                <span className="text-[10px] font-serif italic opacity-40 group-hover:opacity-100 transition-opacity">
                  {desc}
                </span>
              </div>
              <span className={`font-tbhc text-sm px-2 py-0.5 rounded ${
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
    </div>
  );
}
