import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Book, ChevronDown, Edit3, ExternalLink, MessageSquare, PenLine, Quote, Send, UserRound } from "lucide-react";
import type { HotelRoom } from "../types";
import { CRITICAL_CLAIMS, CRITICAL_THEMES } from "../data/criticism";
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
  const [openTheme, setOpenTheme] = useState<number | null>(null);

  const readings = useMemo(
    () => CRITICAL_THEMES.map((theme, index) => ({
      ...theme,
      index,
      claims: CRITICAL_CLAIMS.filter((claim) => claim.theme === index),
    })),
    []
  );
  const outletCount = useMemo(() => new Set(CRITICAL_CLAIMS.map((claim) => claim.outlet)).size, []);

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
        setPostError(error?.message || "Unable to save this entry.");
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
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">Floor 10 • Room 10</span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">Rooftop Garden</h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-3xl leading-relaxed">
          Where the record is read aloud. Published criticism first, then whatever the guests care to add about <span className="italic">Tranquility Base Hotel <span className="font-serif italic normal-case text-[#c5a059] mx-1">&amp;</span> Casino</span>.
        </p>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#c5a059]/20 pb-3">
          <div className="flex items-center gap-3">
            <Quote size={17} className="text-[#c5a059]" />
            <h3 className="font-serif italic text-2xl text-[#f5f2ed]">Critical Reception</h3>
          </div>
          <span className="font-panel text-[10px] text-[#c5a059]/60">{CRITICAL_CLAIMS.length} readings · {outletCount} outlets</span>
        </div>

        <p className="font-serif text-sm text-[#f5f2ed]/55 leading-relaxed max-w-3xl">
          A history of interpretation, not a list of confirmed references. Every reading is attributed to a named critic and links to the original article. None of it is confirmed by the band — for what Turner himself said, take the lift to{" "}
          <button onClick={() => onNavigateToRoom("LOUNGE")} className="text-[#c5a059] underline decoration-dotted underline-offset-2 hover:text-[#f5f2ed]">the Lounge</button>.
        </p>

        {readings.map((theme) => {
          const isOpen = openTheme === theme.index;
          const critics = new Set(theme.claims.map((claim) => claim.critic)).size;
          return (
            <article key={theme.index} className="rounded-lg glass-panel border border-[#c5a059]/15 bg-black/20 overflow-hidden">
              <div className="p-6 md:p-7 flex flex-col gap-3">
                <h4 className="font-serif italic text-xl md:text-2xl text-[#f5f2ed] leading-tight">{theme.title}</h4>
                <p className="font-serif text-[#f5f2ed]/75 leading-relaxed">{theme.synthesis}</p>
                <button
                  type="button"
                  onClick={() => setOpenTheme(isOpen ? null : theme.index)}
                  aria-expanded={isOpen}
                  className="self-start mt-1 flex items-center gap-2 font-panel text-[10px] uppercase tracking-wide text-[#c5a059]/70 hover:text-[#c5a059] transition-colors"
                >
                  <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  {theme.claims.length} reading{theme.claims.length === 1 ? "" : "s"} · {critics} critic{critics === 1 ? "" : "s"}
                </button>
              </div>
              {isOpen && (
                <ul className="border-t border-[#c5a059]/15">
                  {theme.claims.map((claim) => (
                    <li key={claim.id} className="p-5 md:px-7 border-b border-[#c5a059]/10 last:border-b-0 flex flex-col gap-2.5">
                      <p className="font-serif text-sm text-[#f5f2ed]/75 leading-relaxed">{claim.claim}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-panel text-[10px] text-[#f5f2ed]/45">
                        <span className="text-[#c5a059]">{claim.critic}</span>
                        <span>{claim.outlet}</span>
                        <span>{claim.date}</span>
                        {claim.tier.map((tier) => (
                          <span key={tier} className="border border-[#c5a059]/20 text-[#c5a059]/70 px-1.5 py-0.5 rounded">{tier}</span>
                        ))}
                        <a href={claim.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#c5a059]/70 hover:text-[#c5a059] underline decoration-dotted underline-offset-2">
                          Original <ExternalLink size={10} />
                        </a>
                      </div>
                      {claim.access === "limited" && (
                        <p className="font-serif italic text-[11px] text-[#d97706]/75 leading-relaxed">
                          Index record and byline verified; the original page could not be opened for full-text checking.
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </section>

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
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} required placeholder="Give your entry a title" className="w-full bg-black/30 border border-[#c5a059]/20 rounded px-4 py-3 font-serif text-[#f5f2ed] placeholder:text-[#f5f2ed]/30 focus:outline-none focus:border-[#c5a059]" />
            <textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={1600} required rows={5} placeholder="Your reading of the record, a favourite line, or a thought from the lounge…" className="w-full resize-y bg-black/30 border border-[#c5a059]/20 rounded px-4 py-3 font-serif text-[#f5f2ed] placeholder:text-[#f5f2ed]/30 focus:outline-none focus:border-[#c5a059] leading-relaxed" />
            <div className="flex items-center justify-between gap-4">
              <span className="font-serif italic text-xs text-[#f5f2ed]/40">Your entry stays in the hotel guest book.</span>
              <button type="submit" className="front-action-button !py-2.5 !text-[11px]">
                <Send size={14} /> {editingId ? "Save entry" : "Sign the guest book"}
              </button>
            </div>
          </form>
        ) : (
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <MessageSquare size={20} className="text-[#c5a059] mt-1" />
              <div>
                <h3 className="font-serif italic text-xl text-[#f5f2ed]">Guest Book</h3>
                <p className="font-serif text-sm text-[#f5f2ed]/60 mt-1">Check in at Reception to sign the guest book.</p>
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
          <h3 className="font-serif italic text-2xl text-[#f5f2ed]">Guest Book</h3>
          <span className="font-panel text-[10px] text-[#c5a059]/60">{posts.length} {posts.length === 1 ? "entry" : "entries"}</span>
        </div>
        {posts.length === 0 ? (
          <div className="p-10 rounded-lg glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60 mb-4 animate-pulse"><Book size={24} className="text-[#c5a059]" /></div>
            <span className="font-serif italic text-xs uppercase tracking-widest text-[#c5a059] mb-2">Nobody has signed yet</span>
            <p className="font-serif italic text-xs text-[#f5f2ed]/50 max-w-md leading-relaxed">Be the first to leave a reading in the guest book.</p>
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
