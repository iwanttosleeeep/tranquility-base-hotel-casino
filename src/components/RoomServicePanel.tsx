import { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, ConciergeBell, ReceiptText } from "lucide-react";
import { generateRoomServiceOrder, RoomServiceOrder } from "../data/roomService";
import { formatGuestNight, guestDayWindow } from "../lib/guestTime";
import { supabase } from "../lib/supabase";

interface RoomServicePanelProps {
  userId: string;
  guestRoom: string;
  currentNight: number | null;
  onKept?: () => void;
}

const ORDER_FIELDS = "id, ordered_at, courses, bill, kept, discarded";
const DAILY_LIMIT = 3;

function formatCredits(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

export default function RoomServicePanel({ userId, guestRoom, currentNight, onKept }: RoomServicePanelProps) {
  const [orders, setOrders] = useState<RoomServiceOrder[]>([]);
  const [ordersToday, setOrdersToday] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [isOrdering, setIsOrdering] = useState(false);
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(async () => {
    if (!supabase || !userId) {
      setOrders([]);
      setOrdersToday(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { start, end } = guestDayWindow(new Date());
    const [historyResult, dailyResult] = await Promise.all([
      supabase
        .from("room_service_orders")
        .select(ORDER_FIELDS)
        .eq("user_id", userId)
        .order("ordered_at", { ascending: false }),
      supabase
        .from("room_service_orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("ordered_at", start.toISOString())
        .lt("ordered_at", end.toISOString()),
    ]);

    if (historyResult.error || dailyResult.error) {
      setNotice(historyResult.error?.message || dailyResult.error?.message || "The service line could not be reached.");
    } else {
      setOrders((historyResult.data || []) as unknown as RoomServiceOrder[]);
      setOrdersToday(dailyResult.count || 0);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders, currentNight]);

  const runningTab = useMemo(
    () => orders.reduce((total, order) => total + Number(order.bill.total || 0), 0),
    [orders],
  );
  const latestOrder = orders[0] ?? null;
  const currentOrder = latestOrder && !latestOrder.kept && !latestOrder.discarded ? latestOrder : null;

  const placeOrder = async () => {
    if (!supabase || !userId || isOrdering) return;
    setIsOrdering(true);
    setNotice("");

    const { start, end } = guestDayWindow(new Date());
    const { count, error: countError } = await supabase
      .from("room_service_orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("ordered_at", start.toISOString())
      .lt("ordered_at", end.toISOString());

    if (countError) {
      setNotice(countError.message);
      setIsOrdering(false);
      return;
    }
    if ((count || 0) >= DAILY_LIMIT) {
      setOrdersToday(count || DAILY_LIMIT);
      setNotice("The kitchen has already sent three covers today. The service line reopens at local midnight.");
      setIsOrdering(false);
      return;
    }

    const generated = generateRoomServiceOrder(guestRoom);
    const { data, error } = await supabase
      .from("room_service_orders")
      .insert({ user_id: userId, ...generated, kept: false })
      .select(ORDER_FIELDS)
      .single();

    if (error) {
      setNotice(error.message);
    } else {
      setOrders((previous) => [data as unknown as RoomServiceOrder, ...previous]);
      setOrdersToday((count || 0) + 1);
      setNotice("Room service has left a fresh card outside your door.");
    }
    setIsOrdering(false);
  };

  const keepOrder = async () => {
    if (!supabase || !userId || !currentOrder || currentOrder.kept) return;
    setNotice("");
    const { data, error } = await supabase
      .from("room_service_orders")
      .update({ kept: true })
      .eq("id", currentOrder.id)
      .eq("user_id", userId)
      .select(ORDER_FIELDS)
      .single();

    if (error) {
      setNotice(error.message);
      return;
    }
    const keptOrder = data as unknown as RoomServiceOrder;
    setOrders((previous) => previous.map((order) => order.id === keptOrder.id ? keptOrder : order));
    setNotice("This menu has been filed in your kept receipts.");
    onKept?.();
  };

  if (!userId) {
    return (
      <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/15 bg-black/20 flex flex-col gap-3">
        <div className="flex items-center gap-3 border-b border-[#c5a059]/20 pb-3">
          <ConciergeBell className="text-[#c5a059]/60" size={18} />
          <h3 className="font-serif italic text-lg text-[#f5f2ed]/70">Room Service</h3>
        </div>
        <p className="font-serif italic text-sm leading-relaxed text-[#f5f2ed]/40">The kitchen requires an active room key before taking an order.</p>
      </div>
    );
  }

  return (
    <section className="p-6 rounded-lg glass-panel border border-[#c5a059]/25 bg-black/20 flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/[0.035] to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c5a059]/20 pb-4">
        <div className="flex items-center gap-3">
          <ConciergeBell className="text-[#c5a059]" size={18} />
          <div>
            <h3 className="font-serif italic text-lg text-[#f5f2ed]/85">Room Service</h3>
            <p className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]/55">
              {currentNight ? formatGuestNight(currentNight) : "Private service"} · {Math.max(0, DAILY_LIMIT - ordersToday)} of {DAILY_LIMIT} calls remaining
            </p>
          </div>
        </div>
        <div className="font-panel text-[10px] uppercase tracking-wider text-[#f5f2ed]/45">
          Running tab · {formatCredits(runningTab)} LC
        </div>
      </div>

      {isLoading ? (
        <p className="relative font-serif italic text-sm text-[#f5f2ed]/40">Calling the kitchen…</p>
      ) : currentOrder ? (
        <div className="relative grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="border border-[#c5a059]/15 bg-[#0d0b09]/80 p-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#c5a059]/20 pb-3 mb-4">
              <div>
                <span className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]/60">Suite {guestRoom} · Service card</span>
                <p className="font-serif italic text-xs text-[#f5f2ed]/35 mt-1">{new Date(currentOrder.ordered_at).toLocaleString()}</p>
              </div>
              <button
                onClick={keepOrder}
                className="shrink-0 inline-flex items-center gap-1.5 border border-[#c5a059]/30 px-3 py-1.5 font-panel text-[9px] uppercase tracking-wider text-[#c5a059] disabled:opacity-45"
              >
                <Bookmark size={12} /> Keep this
              </button>
            </div>

            <div className="space-y-4">
              {[
                ["Appetizer", currentOrder.courses.appetizer],
                ["Main course", currentOrder.courses.mainCourse],
                ["Dessert", currentOrder.courses.dessert],
                [currentOrder.courses.cocktail.name, currentOrder.courses.cocktail.build],
                ["Wine", currentOrder.courses.wine],
              ].map(([label, detail]) => (
                <div key={label}>
                  <span className="font-panel text-[9px] uppercase tracking-widest text-[#c5a059]/60">{label}</span>
                  <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/75">{detail}</p>
                </div>
              ))}
            </div>

            <blockquote className="mt-5 border-l border-[#c5a059]/40 pl-4 font-serif italic text-xs leading-relaxed text-[#f5f2ed]/50">
              {currentOrder.courses.chefsNote}
            </blockquote>
          </div>

          <aside className="border border-[#c5a059]/15 bg-[#0d0b09]/80 p-4 self-start">
            <div className="flex items-center gap-2 border-b border-[#c5a059]/20 pb-3 mb-3">
              <ReceiptText size={14} className="text-[#c5a059]" />
              <span className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]">Final bill</span>
            </div>
            <div className="space-y-1.5">
              {currentOrder.bill.items.map((item) => (
                <div key={item.label} className="flex justify-between gap-3 font-serif text-xs text-[#f5f2ed]/55">
                  <span>{item.label}</span><span>{formatCredits(item.credits)}</span>
                </div>
              ))}
              <div className="flex justify-between gap-3 border-t border-dashed border-[#c5a059]/15 pt-2 font-serif text-xs text-[#f5f2ed]/55">
                <span>Service · 12.5%</span><span>{formatCredits(currentOrder.bill.service)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-[#c5a059]/25 pt-2 font-panel text-[10px] uppercase text-[#c5a059]">
                <span>Total LC</span><span>{formatCredits(currentOrder.bill.total)}</span>
              </div>
            </div>
            <p className="mt-4 font-serif italic text-[11px] leading-relaxed text-[#f5f2ed]/35">{currentOrder.bill.settlement}</p>
          </aside>
        </div>
      ) : (
        <p className="relative font-serif italic text-sm text-[#f5f2ed]/40">No service card has been issued to this suite.</p>
      )}

      {notice && <p className="relative border-l border-[#c5a059]/35 pl-3 font-serif italic text-xs text-[#f5f2ed]/55">{notice}</p>}

      <button
        onClick={placeOrder}
        disabled={isLoading || isOrdering || ordersToday >= DAILY_LIMIT}
        className="relative self-start inline-flex items-center gap-2 rounded border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-2.5 font-panel text-[10px] uppercase tracking-[0.18em] text-[#c5a059] transition-colors hover:bg-[#c5a059]/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ConciergeBell size={14} /> {isOrdering ? "Kitchen line engaged" : ordersToday >= DAILY_LIMIT ? "Service closed for today" : "Call room service"}
      </button>
    </section>
  );
}
