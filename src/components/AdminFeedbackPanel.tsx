import { useCallback, useEffect, useState } from "react";
import { ClipboardList, RefreshCw, UserRound } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AdminFeedback {
  id: string;
  author_id: string;
  author_name: string;
  room_number: string | null;
  message: string;
  created_at: string;
}

export default function AdminFeedbackPanel({ userId }: { userId: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState<AdminFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    let active = true;
    const checkBadge = async () => {
      if (!supabase || !userId) return;
      const { data, error } = await supabase.rpc("is_hotel_admin");
      if (!active || error || data !== true) return;
      setIsAdmin(true);
      void loadFeedback();
    };
    void checkBadge();
    return () => { active = false; };
  }, [loadFeedback, userId]);

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

      {isLoading && entries.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">Opening the management ledger…</p>
      ) : entries.length === 0 ? (
        <p className="font-serif italic text-sm text-[#f5f2ed]/40">No messages are waiting at Reception.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[34rem] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <article key={entry.id} className="border border-[#c5a059]/15 bg-black/25 p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-panel text-[9px] uppercase tracking-wider text-[#c5a059]/55">
                <span className="inline-flex items-center gap-2 text-[#c5a059]/75">
                  <UserRound size={12} /> {entry.author_name}{entry.room_number ? ` · Room ${entry.room_number}` : ""}
                </span>
                <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
              </div>
              <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-[#f5f2ed]/75">{entry.message}</p>
            </article>
          ))}
        </div>
      )}

      {notice && <p className="border-l border-[#c5a059]/35 pl-3 font-serif italic text-xs text-[#d97706]/80">{notice}</p>}
    </section>
  );
}
