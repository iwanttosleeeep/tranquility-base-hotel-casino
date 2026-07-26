import { useCallback, useEffect, useMemo, useState } from "react";
import { BookMarked, ChevronDown, ConciergeBell, Trophy } from "lucide-react";
import { CasinoRecord, CASINO_SYMBOL_LABELS } from "../data/casinoRecords";
import { RoomServiceOrder } from "../data/roomService";
import { formatGuestNight, guestNight } from "../lib/guestTime";
import { supabase } from "../lib/supabase";

interface KeptPapersProps {
  userId: string;
  checkedInAt: string | null;
  refreshToken: number;
}

type KeptPaper =
  | { kind: "menu"; timestamp: string; record: RoomServiceOrder }
  | { kind: "casino"; timestamp: string; record: CasinoRecord };

function formatCredits(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function paperNight(checkedInAt: string | null, timestamp: string): string {
  if (!checkedInAt) return "NIGHT ---";
  return formatGuestNight(guestNight(new Date(checkedInAt), new Date(timestamp)));
}

export default function KeptPapers({ userId, checkedInAt, refreshToken }: KeptPapersProps) {
  const [menus, setMenus] = useState<RoomServiceOrder[]>([]);
  const [casinoRecords, setCasinoRecords] = useState<CasinoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [notice, setNotice] = useState("");

  const loadPapers = useCallback(async () => {
    if (!supabase || !userId) {
      setMenus([]);
      setCasinoRecords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotice("");
    const [menuResult, casinoResult] = await Promise.all([
      supabase
        .from("room_service_orders")
        .select("id, ordered_at, courses, bill, kept")
        .eq("user_id", userId)
        .eq("kept", true)
        .order("ordered_at", { ascending: false }),
      supabase
        .from("casino_records")
        .select("id, spun_at, reels, outcome, message")
        .eq("user_id", userId)
        .order("spun_at", { ascending: false }),
    ]);

    if (menuResult.error || casinoResult.error) {
      setNotice(menuResult.error?.message || casinoResult.error?.message || "The drawer could not be opened.");
    } else {
      setMenus((menuResult.data || []) as unknown as RoomServiceOrder[]);
      setCasinoRecords((casinoResult.data || []) as unknown as CasinoRecord[]);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadPapers();
  }, [loadPapers, refreshToken]);

  const papers = useMemo<KeptPaper[]>(() => [
    ...menus.map((record): KeptPaper => ({ kind: "menu", timestamp: record.ordered_at, record })),
    ...casinoRecords.map((record): KeptPaper => ({ kind: "casino", timestamp: record.spun_at, record })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [menus, casinoRecords]);

  return (
    <section className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-4 min-h-full">
      <div className="flex items-center justify-between gap-3 border-b border-[#c5a059]/20 pb-3">
        <div className="flex items-center gap-3">
          <BookMarked className="text-[#c5a059]" size={18} />
          <h3 className="font-serif italic text-lg text-[#f5f2ed]/80">Kept Papers</h3>
        </div>
        <span className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]/45">
          {papers.length.toString().padStart(2, "0")} filed
        </span>
      </div>

      {!userId ? (
        <p className="font-serif italic text-sm leading-relaxed text-[#f5f2ed]/40">The drawer requires an active room key.</p>
      ) : isLoading ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">Opening the drawer…</p>
      ) : papers.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">The drawer is empty.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[28rem] overflow-y-auto pr-1">
          {papers.map((paper) => {
            const isMenu = paper.kind === "menu";
            const title = isMenu
              ? paper.record.courses.cocktail.name
              : `${paper.record.outcome === "jackpot" ? "Jackpot" : "Pair"} · ${paper.record.reels.map((reel) => CASINO_SYMBOL_LABELS[reel] || reel).join(" / ")}`;
            return (
              <details key={`${paper.kind}-${paper.record.id}`} className="group border border-[#c5a059]/15 bg-[#0d0b09]/75 px-4 py-3">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-3">
                    {isMenu ? <ConciergeBell size={14} className="mt-0.5 shrink-0 text-[#c5a059]/70" /> : <Trophy size={14} className="mt-0.5 shrink-0 text-[#c5a059]/70" />}
                    <div className="min-w-0">
                      <p className="font-serif text-sm text-[#f5f2ed]/75 truncate">{title}</p>
                      <p className="font-panel text-[8px] uppercase tracking-wider text-[#c5a059]/45 mt-1">
                        {paperNight(checkedInAt, paper.timestamp)} · {new Date(paper.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={13} className="mt-1 shrink-0 text-[#c5a059]/45 transition-transform group-open:rotate-180" />
                </summary>

                {isMenu ? (
                  <div className="mt-4 border-t border-[#c5a059]/10 pt-3 space-y-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/55">
                    <p>{paper.record.courses.appetizer}</p>
                    <p>{paper.record.courses.mainCourse}</p>
                    <p>{paper.record.courses.dessert}</p>
                    <p>{paper.record.courses.cocktail.build}</p>
                    <p>{paper.record.courses.wine}</p>
                    <p className="border-l border-[#c5a059]/30 pl-3 italic text-[#f5f2ed]/40">{paper.record.courses.chefsNote}</p>
                    <p className="font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/65">Final bill · {formatCredits(paper.record.bill.total)} LC</p>
                  </div>
                ) : (
                  <p className="mt-4 border-t border-[#c5a059]/10 pt-3 font-serif italic text-xs leading-relaxed text-[#f5f2ed]/50">{paper.record.message}</p>
                )}
              </details>
            );
          })}
        </div>
      )}

      {notice && <p className="border-l border-[#c5a059]/35 pl-3 font-serif italic text-xs text-[#f5f2ed]/55">{notice}</p>}
    </section>
  );
}
