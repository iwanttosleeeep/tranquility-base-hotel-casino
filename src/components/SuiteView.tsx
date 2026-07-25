import { KeyRound, ConciergeBell, Hourglass, BookMarked, ArrowUpRight } from "lucide-react";
import { HotelRoom } from "../types";

interface SuiteViewProps {
  guestName: string;
  guestRoom: string;
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

export default function SuiteView({ guestName, guestRoom, onNavigateToRoom }: SuiteViewProps) {
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

      {/* Fittings to be installed in later passes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PendingPanel
          icon={Hourglass}
          title="Length of Stay"
          note="A brass night-counter is on order. It will count from the night you first signed the register, whether or not the room was occupied."
        />
        <PendingPanel
          icon={ConciergeBell}
          title="Room Service"
          note="The kitchen is not yet taking calls from this floor. Three covers a day when it opens."
        />
        <div className="md:col-span-2">
          <PendingPanel
            icon={BookMarked}
            title="Kept Papers"
            note="Menus you decide to keep, and anything worth remembering from the Clavius Casino, will be filed in this drawer."
          />
        </div>
      </div>
    </div>
  );
}
