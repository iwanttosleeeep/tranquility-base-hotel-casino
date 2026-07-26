import { useEffect, useState } from "react";
import { KeyRound, Hourglass, BookMarked, ArrowUpRight } from "lucide-react";
import { HotelRoom } from "../types";
import { formatGuestNight, guestNight } from "../lib/guestTime";
import RoomServicePanel from "./RoomServicePanel";

interface SuiteViewProps {
  guestName: string;
  guestRoom: string;
  userId: string;
  checkedInAt: string | null;
  onNavigateToRoom: (room: HotelRoom) => void;
}

/** Placeholder plaque for fittings that have not been installed yet. */
function PendingPanel({
  icon: Icon,
  title,
  note,
}: {
  icon: typeof Hourglass;
  title: string;
  note: string;
}) {
  return (
    <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/15 bg-black/20 flex flex-col gap-3">
      <div className="flex items-center gap-3 border-b border-[#c5a059]/20 pb-3">
        <Icon className="text-[#c5a059]/60" size={18} />
        <h3 className="font-serif italic text-lg text-[#f5f2ed]/70">{title}</h3>
      </div>
      <p className="font-serif italic text-sm leading-relaxed text-[#f5f2ed]/40">{note}</p>
      <span className="font-panel text-[9px] uppercase tracking-[0.3em] text-[#c5a059]/40">
        Awaiting installation
      </span>
    </div>
  );
}

export default function SuiteView({ guestName, guestRoom, userId, checkedInAt, onNavigateToRoom }: SuiteViewProps) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 50);
    const timeout = window.setTimeout(() => setNow(new Date()), nextMidnight.getTime() - now.getTime());
    return () => window.clearTimeout(timeout);
  }, [now]);

  const currentNight = checkedInAt ? guestNight(new Date(checkedInAt), now) : null;
  const nightLabel = currentNight ? formatGuestNight(currentNight) : "NIGHT ---";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Suite header */}
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Ground Floor • Private Key
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Suite {guestRoom}
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          Registered to <span className="font-serif italic text-[#c5a059]">{guestName || "Guest"}</span>.
          The door answers only to your key. Everything you choose to keep during your stay is kept here.
        </p>
      </div>

      {/* Service bar — check-out and room changes are handled downstairs */}
      <div className="p-4 rounded-lg border border-[#c5a059]/20 bg-[#120e0a]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <KeyRound className="text-[#c5a059] shrink-0" size={16} />
          <span className="font-serif italic text-sm text-[#f5f2ed]/60">
            To check out or change rooms, please attend the Reception Desk.
          </span>
        </div>
        <button
          onClick={() => onNavigateToRoom("RECEPTION")}
          className="shrink-0 self-start sm:self-auto flex items-center gap-2 border border-[#c5a059]/30 hover:border-[#c5a059] hover:bg-[#c5a059]/10 text-[#c5a059] font-panel text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-all active:scale-95"
        >
          Reception Desk <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Suite fittings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/25 bg-black/20 flex flex-col gap-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/[0.04] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-3 border-b border-[#c5a059]/20 pb-3">
            <Hourglass className="text-[#c5a059]" size={18} />
            <h3 className="font-serif italic text-lg text-[#f5f2ed]/80">Length of Stay</h3>
          </div>
          <div className="relative self-start border border-[#c5a059]/45 bg-[#15110c] px-5 py-3 shadow-[inset_0_0_18px_rgba(197,160,89,0.08)]">
            <span className="font-tbhc text-2xl md:text-3xl tracking-[0.16em] text-[#c5a059] text-glow">
              {nightLabel}
            </span>
          </div>
          <p className="relative font-serif italic text-xs leading-relaxed text-[#f5f2ed]/40">
            Counted from the night the register was first signed. Check-out does not stop the house clock.
          </p>
        </div>
        <PendingPanel
          icon={BookMarked}
          title="Kept Papers"
          note="Menus you decide to keep, and anything worth remembering from the Clavius Casino, will be filed in this drawer."
        />
        <div className="md:col-span-2">
          <RoomServicePanel userId={userId} guestRoom={guestRoom} currentNight={currentNight} />
        </div>
      </div>
    </div>
  );
}
