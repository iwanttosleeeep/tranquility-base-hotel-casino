import { useEffect, useState, type FormEvent } from "react";
import { Book, Edit3, MessageSquare, PenLine, Send, UserRound } from "lucide-react";
import type { HotelRoom } from "../types";
import { supabase } from "../lib/supabase";

interface GardenPost {
  id: string;
  authorId: string;
  author: string;
  title: string;
  body: string;
  createdAt: string;
}

interface RooftopGardenViewProps {
  guestName: string;
  guestRoom: string;
  userId: string;
  onNavigateToRoom: (room: HotelRoom) => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function RooftopGardenView({ guestName, guestRoom, userId, onNavigateToRoom }: RooftopGardenViewProps) {
  const [posts, setPosts] = useState<GardenPost[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("forum_posts")
        .select("id, author_id, author_name, title, body, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) {
        setPostError(error.message);
        return;
      }
      setPosts((data || []).map((post) => ({
        id: post.id,
        authorId: post.author_id,
        author: post.author_name,
        title: post.title,
        body: post.body,
        createdAt: post.created_at,
      })));
    };
    void loadPosts();
  }, []);

  const resetComposer = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !userId || !guestName || !title.trim() || !body.trim()) return;

    if (editingId) {
      const { error } = await supabase
        .from("forum_posts")
        .update({ title: title.trim(), body: body.trim() })
        .eq("id", editingId)
        .eq("author_id", userId);
      if (error) {
        setPostError(error.message);
        return;
      }
      setPosts(posts.map((post) => post.id === editingId ? { ...post, title: title.trim(), body: body.trim() } : post));
    } else {
      const { data, error } = await supabase
        .from("forum_posts")
        .insert({ author_id: userId, author_name: guestName, title: title.trim(), body: body.trim() })
        .select("id, author_id, author_name, title, body, created_at")
        .single();
      if (error || !data) {
        setPostError(error?.message || "Unable to publish this transmission.");
        return;
      }
      setPosts([{ id: data.id, authorId: data.author_id, author: data.author_name, title: data.title, body: data.body, createdAt: data.created_at }, ...posts]);
    }
    setPostError("");
    resetComposer();
  };

  const editPost = (post: GardenPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 09 • Room 09</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Rooftop Garden</h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-3xl leading-relaxed">
          A residents&apos; forum for readings, theories, favourite lines, and personal encounters with <span className="italic">Tranquility Base Hotel <span className="font-serif italic normal-case text-[#c5a059] mx-1">&amp;</span> Casino</span>.
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.04)_0%,transparent_55%)] pointer-events-none" />
        {guestName ? (
          <form onSubmit={submitPost} className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 border-b border-[#c5a059]/20 pb-4">
              <div className="flex items-center gap-3">
                <PenLine size={18} className="text-[#c5a059]" />
                <div>
                  <h3 className="font-serif italic text-xl text-[#f5f2ed]">Write from Room {guestRoom}</h3>
                  <p className="font-panel text-[10px] text-[#c5a059]/60">Posting as {guestName}</p>
                </div>
              </div>
              {editingId && <button type="button" onClick={resetComposer} className="font-panel text-[10px] text-[#f5f2ed]/50 hover:text-[#c5a059]">Cancel edit</button>}
            </div>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required placeholder="Give your transmission a title" className="w-full bg-black/30 border border-[#c5a059]/20 rounded px-4 py-3 font-serif text-[#f5f2ed] placeholder:text-[#f5f2ed]/30 focus:outline-none focus:border-[#c5a059]" />
            <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={1600} required rows={5} placeholder="Your reading of the record, a favourite moment, or a thought from the lounge…" className="w-full resize-y bg-black/30 border border-[#c5a059]/20 rounded px-4 py-3 font-serif text-[#f5f2ed] placeholder:text-[#f5f2ed]/30 focus:outline-none focus:border-[#c5a059] leading-relaxed" />
            <div className="flex items-center justify-between gap-4">
              <span className="font-serif italic text-xs text-[#f5f2ed]/40">Your transmission will be recorded in the hotel forum.</span>
              <button type="submit" className="front-action-button !py-2.5 !text-[11px]">
                <Send size={14} /> {editingId ? "Save transmission" : "Publish transmission"}
              </button>
            </div>
          </form>
        ) : (
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <MessageSquare size={20} className="text-[#c5a059] mt-1" />
              <div>
                <h3 className="font-serif italic text-xl text-[#f5f2ed]">Residents&apos; Forum</h3>
                <p className="font-serif text-sm text-[#f5f2ed]/60 mt-1">Check in at Reception to add your own transmission.</p>
              </div>
            </div>
            <button onClick={() => onNavigateToRoom("RECEPTION")} className="front-action-button !py-2.5 !text-[11px]">Visit Reception</button>
          </div>
        )}
        {postError && <p className="relative mt-4 font-serif text-xs text-[#d97706]">{postError}</p>}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-[#c5a059]/20 pb-3">
          <MessageSquare size={17} className="text-[#c5a059]" />
          <h3 className="font-serif italic text-2xl text-[#f5f2ed]">Garden Transmissions</h3>
          <span className="font-panel text-[10px] text-[#c5a059]/60">{posts.length} recorded</span>
        </div>
        {posts.length === 0 ? (
          <div className="p-10 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse"><Book size={24} className="text-[#c5a059]" /></div>
            <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">Room Being Prepared</span>
            <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">The garden ledger awaits its first resident transmission.</p>
          </div>
        ) : posts.map((post) => (
          <article key={post.id} className="p-6 rounded-lg glass-panel border border-[#c5a059]/15 bg-black/20 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-serif italic text-2xl text-[#f5f2ed] leading-tight">{post.title}</h4>
                <div className="mt-2 flex items-center gap-2 font-panel text-[10px] text-[#c5a059]/65"><UserRound size={12} /> {post.author} <span>•</span> {formatDate(post.createdAt)}</div>
              </div>
              {post.authorId === userId && <button onClick={() => editPost(post)} className="shrink-0 flex items-center gap-2 font-panel text-[10px] text-[#c5a059]/70 hover:text-[#c5a059]"><Edit3 size={13} /> Edit</button>}
            </div>
            <p className="whitespace-pre-wrap font-serif text-[#f5f2ed]/75 leading-relaxed">{post.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
