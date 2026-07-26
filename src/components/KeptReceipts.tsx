import { useCallback, useEffect, useMemo, useState } from "react";
import { BookMarked, ChevronDown, ConciergeBell, Trash2, Trophy } from "lucide-react";
import { CasinoRecord, CASINO_SYMBOL_LABELS } from "../data/casinoRecords";
import { RoomServiceOrder } from "../data/roomService";
import { formatGuestNight, guestNight } from "../lib/guestTime";
import { supabase } from "../lib/supabase";

interface KeptReceiptsProps {
  userId: string;
  checkedInAt: string | null;
  refreshToken: number;
}

type KeptReceipt =
  | { kind: "menu"; timestamp: string; record: RoomServiceOrder }
  | { kind: "casino"; timestamp: string; record: CasinoRecord };

function formatCredits(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function receiptNight(checkedInAt: string | null, timestamp: string): string {
  if (!checkedInAt) return "NIGHT ---";
  return formatGuestNight(guestNight(new Date(checkedInAt), new Date(timestamp)));
}

export default function KeptReceipts({ userId, checkedInAt, refreshToken }: KeptReceiptsProps) {
  const [menus, setMenus] = useState<RoomServiceOrder[]>([]);
  const [casinoRecords, setCasinoRecords] = useState<CasinoRecord[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadReceipts = useCallback(async () => {
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
        .select("id, ordered_at, courses, bill, kept, discarded")
        .eq("user_id", userId)
        .eq("kept", true)
        .eq("discarded", false)
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
    void loadReceipts();
  }, [loadReceipts, refreshToken]);

  const receipts = useMemo<KeptReceipt[]>(() => [
    ...menus.map((record): KeptReceipt => ({ kind: "menu", timestamp: record.ordered_at, record })),
    ...casinoRecords.map((record): KeptReceipt => ({ kind: "casino", timestamp: record.spun_at, record })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [menus, casinoRecords]);

  const deleteReceipt = async (receipt: KeptReceipt) => {
    if (!supabase || !userId || deletingKey) return;
    if (!window.confirm("Discard this receipt? This cannot be undone.")) return;
    const key = `${receipt.kind}-${receipt.record.id}`;
    setDeletingKey(key);
    setNotice("");
    const operation = receipt.kind === "menu"
      ? supabase.from("room_service_orders").update({ kept: false, discarded: true }).eq("id", receipt.record.id).eq("user_id", userId)
      : supabase.from("casino_records").delete().eq("id", receipt.record.id).eq("user_id", userId);
    const { error } = await operation;
    if (error) {
      setNotice(error.message);
    } else if (receipt.kind === "menu") {
      setMenus((current) => current.filter((record) => record.id !== receipt.record.id));
    } else {
      setCasinoRecords((current) => current.filter((record) => record.id !== receipt.record.id));
    }
    setDeletingKey(null);
  };

  return (
    <section className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 bg-black/20 flex flex-col gap-4 min-h-full">
      <div className="flex items-center justify-between gap-3 border-b border-[#c5a059]/20 pb-3">
        <div className="flex items-center gap-3">
          <BookMarked className="text-[#c5a059]" size={18} />
          <h3 className="font-serif italic text-lg text-[#f5f2ed]/80">Kept Receipts</h3>
        </div>
        <span className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]/45">
          {receipts.length.toString().padStart(2, "0")} filed
        </span>
      </div>

      {!userId ? (
        <p className="font-serif italic text-sm leading-relaxed text-[#f5f2ed]/40">The drawer requires an active room key.</p>
      ) : isLoading ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">Opening the drawer…</p>
      ) : receipts.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">The drawer is empty.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[28rem] overflow-y-auto pr-1">
          {receipts.map((receipt) => {
            const isMenu = receipt.kind === "menu";
            const title = isMenu
              ? receipt.record.courses.cocktail.name
              : `${receipt.record.outcome === "jackpot" ? "Jackpot" : "Pair"} · ${receipt.record.reels.map((reel) => CASINO_SYMBOL_LABELS[reel] || reel).join(" / ")}`;
            const receiptKey = `${receipt.kind}-${receipt.record.id}`;
            return (
              <details key={receiptKey} className="group border border-[#c5a059]/15 bg-[#0d0b09]/75 px-4 py-3">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-3">
                    {isMenu ? <ConciergeBell size={14} className="mt-0.5 shrink-0 text-[#c5a059]/70" /> : <Trophy size={14} className="mt-0.5 shrink-0 text-[#c5a059]/70" />}
                    <div className="min-w-0">
                      <p className="font-serif text-sm text-[#f5f2ed]/75 truncate">{title}</p>
                      <p className="font-panel text-[8px] uppercase tracking-wider text-[#c5a059]/45 mt-1">
                        {receiptNight(checkedInAt, receipt.timestamp)} · {new Date(receipt.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={13} className="mt-1 shrink-0 text-[#c5a059]/45 transition-transform group-open:rotate-180" />
                </summary>

                {isMenu ? (
                  <div className="mt-4 border-t border-[#c5a059]/10 pt-3 space-y-2 font-serif text-xs leading-relaxed text-[#f5f2ed]/55">
                    <p>{receipt.record.courses.appetizer}</p>
                    <p>{receipt.record.courses.mainCourse}</p>
                    <p>{receipt.record.courses.dessert}</p>
                    <p>{receipt.record.courses.cocktail.build}</p>
                    <p>{receipt.record.courses.wine}</p>
                    <p className="border-l border-[#c5a059]/30 pl-3 italic text-[#f5f2ed]/40">{receipt.record.courses.chefsNote}</p>
                    <p className="font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/65">Final bill · {formatCredits(receipt.record.bill.total)} LC</p>
                  </div>
                ) : (
                  <p className="mt-4 border-t border-[#c5a059]/10 pt-3 font-serif italic text-xs leading-relaxed text-[#f5f2ed]/50">{receipt.record.message}</p>
                )}
                <button
                  type="button"
                  onClick={() => void deleteReceipt(receipt)}
                  disabled={deletingKey === receiptKey}
                  className="mt-4 inline-flex items-center gap-2 border-t border-[#c5a059]/10 pt-3 font-panel text-[8px] uppercase tracking-wider text-[#f5f2ed]/35 hover:text-[#d97706] disabled:opacity-35"
                >
                  <Trash2 size={11} /> {deletingKey === receiptKey ? "Discarding" : "Discard receipt"}
                </button>
              </details>
            );
          })}
        </div>
      )}

      {notice && <p className="border-l border-[#c5a059]/35 pl-3 font-serif italic text-xs text-[#f5f2ed]/55">{notice}</p>}
    </section>
  );
}
