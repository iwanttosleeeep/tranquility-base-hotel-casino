import { useCallback, useEffect, useState } from "react";
import { ClipboardList, RefreshCw, UserRound } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useHotelAdmin } from "../hooks/useHotelAdmin";

type FeedbackStatus = "open" | "in_review" | "resolved";

interface AdminFeedback {
  id: string;
  author_id: string;
  author_name: string;
  room_number: string | null;
  message: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  open: "Open",
  in_review: "In review",
  resolved: "Resolved",
};

export default function AdminFeedbackPanel({ userId }: { userId: string }) {
  const isAdmin = useHotelAdmin(userId);
  const [entries, setEntries] = useState<AdminFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("all");
  const [notice, setNotice] = useState("");

  const loadFeedback = useCallback(async () => {
    if (!supabase || !userId) return;
    setIsLoading(true);
    setNotice("");
    const { data, error } = await supabase.rpc("get_admin_feedback");
    if (error) {
      setNotice(error.message);
    } else {
      setEntries((data || []) as AdminFeedback[]);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    if (isAdmin) void loadFeedback();
  }, [isAdmin, loadFeedback]);

  const updateStatus = async (entry: AdminFeedback, status: FeedbackStatus) => {
    if (!supabase || updatingId || entry.status === status) return;
    setUpdatingId(entry.id);
    setNotice("");
    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from("feedback")
      .update({ status, updated_at: updatedAt })
      .eq("id", entry.id);
    if (error) {
      setNotice(error.message);
    } else {
      setEntries((current) => current.map((item) => item.id === entry.id ? { ...item, status, updated_at: updatedAt } : item));
    }
    setUpdatingId(null);
  };

  const visibleEntries = filter === "all" ? entries : entries.filter((entry) => entry.status === filter);

  if (!isAdmin) return null;

  return (
    <section className="p-6 rounded-lg glass-panel border border-[#c5a059]/25 bg-[#120e0a]/50 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 border-b border-[#c5a059]/30 pb-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-[#c5a059]" size={20} />
          <div>
            <h3 className="font-serif italic text-xl text-[#f5f2ed]">Management Ledger</h3>
            <p className="font-panel text-[9px] uppercase tracking-[0.2em] text-[#c5a059]/55">Feedback &amp; Complaints · Staff only</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadFeedback()}
          disabled={isLoading}
          className="shrink-0 inline-flex items-center gap-2 border border-[#c5a059]/25 px-3 py-2 font-panel text-[9px] uppercase tracking-wider text-[#c5a059] disabled:opacity-40"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "open", "in_review", "resolved"] as const).map((status) => {
          const count = status === "all" ? entries.length : entries.filter((entry) => entry.status === status).length;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`border px-3 py-1.5 font-panel text-[9px] uppercase tracking-wider transition-colors ${filter === status ? "border-[#c5a059]/60 bg-[#c5a059]/10 text-[#c5a059]" : "border-white/10 text-[#f5f2ed]/40 hover:border-[#c5a059]/30"}`}
            >
              {status === "all" ? "All" : STATUS_LABELS[status]} · {count}
            </button>
          );
        })}
      </div>

      {isLoading && entries.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">Opening the management ledger…</p>
      ) : visibleEntries.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">No messages are waiting in this tray.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[34rem] overflow-y-auto pr-1">
          {visibleEntries.map((entry) => (
            <article key={entry.id} className="border border-[#c5a059]/15 bg-black/25 p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/55">
                <span className="inline-flex items-center gap-2 text-[#c5a059]/75">
                  <UserRound size={12} /> {entry.author_name}{entry.room_number ? ` · Room ${entry.room_number}` : ""}
                </span>
                <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
              </div>
              <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-[#f5f2ed]/75">{entry.message}</p>
              <div className="flex flex-wrap items-center gap-2 border-t border-[#c5a059]/10 pt-3">
                <span className="mr-1 font-panel text-[8px] uppercase tracking-wider text-[#f5f2ed]/35">Status</span>
                {(["open", "in_review", "resolved"] as FeedbackStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void updateStatus(entry, status)}
                    disabled={updatingId === entry.id || entry.status === status}
                    className={`border px-2.5 py-1 font-panel text-[8px] uppercase tracking-wider transition-colors disabled:cursor-default ${entry.status === status ? "border-[#c5a059]/50 bg-[#c5a059]/10 text-[#c5a059]" : "border-white/10 text-[#f5f2ed]/35 hover:border-[#c5a059]/30 hover:text-[#c5a059]/70"}`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {notice && <p className="border-l border-[#c5a059]/35 pl-3 font-serif italic text-xs text-[#d97706]/80">{notice}</p>}
    </section>
  );
}
