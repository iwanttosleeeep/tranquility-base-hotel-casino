import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Compass, Radio } from "lucide-react";
import { HotelRoom } from "./types";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

// Import custom views
import Elevator from "./components/Elevator";
import ReceptionDesk from "./components/ReceptionDesk";
import LoungeView from "./components/LoungeView";
import CinemaView from "./components/CinemaView";
import ObservatoryView from "./components/ObservatoryView";
import LibraryView from "./components/LibraryView";
import BallroomView from "./components/BallroomView";
import CasinoView from "./components/CasinoView";
import RooftopGardenView from "./components/RooftopGardenView";
import ArchiveView from "./components/ArchiveView";
import GlobalSearch from "./components/GlobalSearch";
import FrontPage from "./components/FrontPage";
import RegisterPage from "./components/RegisterPage";

// ─── Hash routing: #/library, #/library/star-treatment, #/casino … ───
const ROOM_SLUGS: Record<HotelRoom, string> = {
  LOBBY: "lobby",
  RECEPTION: "reception",
  LOUNGE: "lounge",
  CINEMA: "cinema",
  OBSERVATORY: "observatory",
  LIBRARY: "library",
  BALLROOM: "ballroom",
  CASINO: "casino",
  ROOFTOP_GARDEN: "rooftop-garden",
  ARCHIVE: "archive",
};

const SLUG_TO_ROOM: Record<string, HotelRoom> = Object.fromEntries(
  Object.entries(ROOM_SLUGS).map(([room, slug]) => [slug, room as HotelRoom])
) as Record<string, HotelRoom>;

function roomFromHash(): { room: HotelRoom; sub: string | null } {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const room = SLUG_TO_ROOM[parts[0]] ?? "LOBBY";
  return { room, sub: parts[1] ?? null };
}

function writeHash(room: HotelRoom, sub?: string | null) {
  const target = "#/" + ROOM_SLUGS[room] + (sub ? "/" + sub : "");
  if (window.location.hash !== target) window.location.hash = target;
}


const LOBBY_DIRECTORY = [
  { key: "RECEPTION", label: "01. Reception Desk", desc: "Check in & consult directory" },
  { key: "LOUNGE", label: "02. The Lounge", desc: "Browse Turner interviews & quotes" },
  { key: "CINEMA", label: "03. Hotel Cinema", desc: "Investigate books & movies database" },
  { key: "OBSERVATORY", label: "04. The Observatory", desc: "Analyze technological & sci-fi ideas" },
  { key: "LIBRARY", label: "05. The Library", desc: "Song archives with interactive annotations" },
  { key: "BALLROOM", label: "06. Grand Ballroom", desc: "Inspect live shows & gig logs" },
  { key: "CASINO", label: "07. Clavius Casino", desc: "Spin the slot machine for secrets" },
  { key: "ARCHIVE", label: "08. Hotel Archive", desc: "View the creation & release timeline" },
  { key: "ROOFTOP_GARDEN", label: "09. Rooftop Garden", desc: "Share readings, theories, and personal encounters with TBHC" },
  { key: "TBC", label: "To be continue…", desc: "Further floors are currently being prepared", isPlaceholder: true },
];

const ROOM_NAMES: Record<HotelRoom, string> = {
  LOBBY: "The Lobby",
  RECEPTION: "Reception Desk",
  LOUNGE: "The Lounge",
  CINEMA: "Hotel Cinema",
  OBSERVATORY: "The Observatory",
  LIBRARY: "The Library",
  BALLROOM: "Grand Ballroom",
  CASINO: "Clavius Casino",
  ROOFTOP_GARDEN: "Rooftop Garden",
  ARCHIVE: "Hotel Archive",
};

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<HotelRoom>(() => roomFromHash().room);
  const [targetRoom, setTargetRoom] = useState<HotelRoom | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestRoom, setGuestRoom] = useState("505");
  const [session, setSession] = useState<Session | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFrontPage, setIsFrontPage] = useState(true);
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isElevatorCollapsed, setIsElevatorCollapsed] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const loadProfile = async (activeSession: Session | null) => {
      setSession(activeSession);
      if (!activeSession) {
        setGuestName("");
        setGuestRoom("505");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("display_name, room_number")
        .eq("id", activeSession.user.id)
        .maybeSingle();

      setGuestName(data?.display_name || activeSession.user.user_metadata.display_name || "Guest");
      setGuestRoom(data?.room_number || activeSession.user.user_metadata.room_number || "505");
    };

    void supabase.auth.getSession().then(({ data }) => loadProfile(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      void loadProfile(activeSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Play synthetic retro bell / chime when floor changes
  const playArrivalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // First chime (ding)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.value = 523.25; // C5
      osc1.type = "sine";
      gain1.gain.setValueAtTime(0.04, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);

      // Second chime (dong) after delay
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.value = 659.25; // E5
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.04, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 150);
    } catch (e) {
      // Ignored if browser restricts AudioContext auto-play
    }
  };

  const handleRoomChange = (room: HotelRoom) => {
    setTargetRoom(room);
    setIsMoving(true);
    // Synthetic mechanical click sound
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 1200;
      osc.type = "square";
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}

    setTimeout(() => {
      setCurrentRoom(room);
      writeHash(room);
      setTargetRoom(null);
      setIsMoving(false);
      playArrivalChime();
    }, 1200); // Fictional elevator lift travel time
  };

  // Browser back/forward + hand-typed hashes drive the elevator too
  useEffect(() => {
    const onHashChange = () => {
      const { room } = roomFromHash();
      setCurrentRoom((prev) => (prev === room ? prev : room));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleRegister = async (name: string, room = "505", email = "") => {
    if (!supabase) return { success: false, message: "Supabase is not configured. Check your .env.local file." };

    if (!name) {
      const { error } = await supabase.auth.signOut();
      return error ? { success: false, message: error.message } : { success: true, message: "Checked out successfully." };
    }

    if (!session) {
      if (!email) return { success: false, message: "Please enter an email address." };
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: name, room_number: room },
        },
      });
      return error
        ? { success: false, message: error.message }
        : { success: true, message: "Your room code has been sent to your email. Please check your inbox." };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name, room_number: room })
      .eq("id", session.user.id);

    if (error) return { success: false, message: error.message };
    setGuestName(name);
    setGuestRoom(room);
    return { success: true, message: "Guest profile updated." };
  };

  const openReception = () => {
    setIsRegisterPage(true);
    setIsFrontPage(false);
  };

  const finishRegistration = async (name: string, room: string, email?: string) => {
    const result = await handleRegister(name, room, email);
    if (result.success && session && name) {
      setCurrentRoom("LOBBY");
      writeHash("LOBBY");
    }
    return result;
  };

  const verifyRoomCode = async (email: string, code: string) => {
    if (!supabase) return { success: false, message: "Supabase is not configured. Check your .env.local file." };
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) return { success: false, message: error.message };
    setIsRegisterPage(false);
    setIsFrontPage(false);
    setCurrentRoom("LOBBY");
    writeHash("LOBBY");
    return { success: true, message: "Room access granted." };
  };

  if (isFrontPage) {
    return (
      <FrontPage
        guestName={guestName}
        guestRoom={guestRoom}
        onRegister={openReception}
        onEnterHotel={() => setIsFrontPage(false)}
      />
    );
  }

  if (isRegisterPage) {
    return <RegisterPage onRegister={finishRegistration} onVerifyCode={verifyRoomCode} />;
  }

  return (
    <div className="relative min-h-screen font-serif selection:bg-[#c5a059] selection:text-black bg-[#0a0a0a] text-[#f5f2ed] overflow-x-hidden">
      
      {/* Immersive Space Atmosphere Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        {/* Signal scanlines & noise effects */}
        <div className="absolute inset-0 signal-interference bg-white/5 mix-blend-overlay opacity-15" />

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#d97706] opacity-[0.02] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-[#c5a059] opacity-[0.04] blur-[150px]" />
        
        {/* Star dust points */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Main Glass Panel Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <header className="flex items-center justify-between p-6 md:px-10 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex flex-col cursor-pointer" onClick={() => handleRoomChange("LOBBY")}>
            <h1 className="text-lg md:text-xl font-tbhc tracking-wider text-glow mt-1">
              Tranquility Base Hotel <span className="font-serif italic normal-case text-[#c5a059] mx-1.5">&</span> Casino
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 border border-white/10 hover:border-[#c5a059] rounded text-glow hover:text-[#c5a059] transition-all flex items-center gap-2 text-xs font-serif italic tracking-wider uppercase"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search Terminal</span>
            </button>
            
            {guestName && (
              <div className="hidden md:flex items-center gap-2 border border-[#c5a059]/20 px-3 py-1 rounded bg-[#c5a059]/5 text-[11px] font-serif italic text-[#c5a059] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Suite {guestRoom} • {guestName}</span>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic content split with elevator */}
        <div className={`flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 gap-8 items-start transition-[grid-template-columns] duration-300 ${
          isElevatorCollapsed ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]" : "lg:grid-cols-[minmax(28rem,4fr)_minmax(0,8fr)]"
        }`}>
          
          {/* Left / Elevator Column (4 cols) */}
          <div className="lg:sticky lg:top-28 lg:-translate-x-3 flex flex-col gap-6">
            <Elevator
              currentRoom={currentRoom}
              targetRoom={targetRoom}
              onRoomChange={handleRoomChange}
              isMoving={isMoving}
              isCollapsed={isElevatorCollapsed}
              onToggleCollapse={() => setIsElevatorCollapsed((collapsed) => !collapsed)}
            />

            {/* Fictional Staff Message Card */}
            {!isElevatorCollapsed && <div className="p-4 rounded-lg bg-black/30 border border-white/5 font-serif text-xs text-[#f5f2ed]/50 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 font-serif italic text-[11px] uppercase tracking-wider text-[#c5a059]">
                <Radio size={12} className="animate-pulse" />
                <span>Reception Broadcast</span>
              </div>
              <p className="italic">
                &quot;Welcome to {ROOM_NAMES[currentRoom]}. Elevators are authorized to navigate floors G to 09. Please maintain contact keys at all times.&quot;
              </p>
            </div>}
          </div>

          {/* Right / Main Room content Column (8 cols) */}
          <div className="flex flex-col gap-6 min-w-0">
            <AnimatePresence mode="wait">
              {isMoving ? (
                /* Elevator travel animation screen */
                <motion.div
                  key="elevator-moving"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full py-20 px-8 rounded-lg border border-[#c5a059]/10 bg-black/60 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden"
                >
                  {/* Glowing mechanical gears visual */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border border-dashed border-[#c5a059]/30 flex items-center justify-center opacity-60"
                  >
                    <Compass className="text-[#c5a059]" size={32} />
                  </motion.div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="font-serif italic text-[11px] uppercase tracking-[0.35em] text-[#d97706] text-glow animate-pulse">
                      Lift Cabin Traveling...
                    </span>
                    <span className="font-serif italic text-sm text-[#f5f2ed]/50">
                      "Please remain comfortable. We are ascending to your selected floor suite."
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* Main Room View Renderer */
                <motion.div
                  key={currentRoom}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  {currentRoom === "LOBBY" && (
                    <div className="flex flex-col gap-8">
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
                          Ground Floor Suite
                        </span>
                        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
                          The Grand Lobby
                        </h2>
                        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
                          You have checked into the <span className="font-semibold text-[#f5f2ed]">Tranquility Base Hotel <span className="font-serif italic normal-case text-[#c5a059] mx-1">&amp;</span> Casino</span> portal. Wander through the retro space lounge floors using the Otis Lift on the left.
                        </p>
                      </div>

                      {/* Lobby Map Directories */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LOBBY_DIRECTORY.map((dir) => (
                          <button
                            key={dir.key}
                            onClick={() => !dir.isPlaceholder && handleRoomChange(dir.key as HotelRoom)}
                            disabled={dir.isPlaceholder}
                            className={`p-4 rounded border text-left flex flex-col gap-1 transition-all ${
                              dir.isPlaceholder
                                ? "border-[#c5a059]/15 bg-black/20 text-[#f5f2ed]/35 cursor-default"
                                : "border-white/5 bg-[#120e0a]/40 hover:border-[#c5a059]/30 hover:bg-[#c5a059]/5 cursor-pointer"
                            }`}
                          >
                            <span className="font-serif italic font-semibold text-glow text-[#f5f2ed]">{dir.label}</span>
                            <span className="text-xs font-serif text-[#f5f2ed]/50">{dir.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentRoom === "RECEPTION" && (
                    <ReceptionDesk
                      guestName={guestName}
                      guestRoom={guestRoom}
                      onRegister={finishRegistration}
                      isAuthenticated={!!session}
                      guestEmail={session?.user.email || ""}
                      userId={session?.user.id || ""}
                    />
                  )}

                  {currentRoom === "LOUNGE" && <LoungeView />}
                  {currentRoom === "CINEMA" && <CinemaView />}
                  {currentRoom === "OBSERVATORY" && <ObservatoryView />}
                  {currentRoom === "LIBRARY" && <LibraryView />}
                  {currentRoom === "BALLROOM" && <BallroomView />}
                  {currentRoom === "CASINO" && <CasinoView guestRoom={guestRoom} />}
                  {currentRoom === "ROOFTOP_GARDEN" && <RooftopGardenView guestName={guestName} guestRoom={guestRoom} userId={session?.user.id || ""} onNavigateToRoom={handleRoomChange} />}
                  {currentRoom === "ARCHIVE" && <ArchiveView />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Global Footer diagnostic status bar */}
        <footer className="mt-auto p-4 md:px-10 border-t border-white/5 bg-black/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 font-serif italic text-[11px] tracking-wider text-[#c5a059]/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              Transmitting Secure Line
            </span>
            <span>|</span>
            <span>Terminal: TBHC-G9</span>
          </div>

          <div className="flex items-center gap-4">
            {guestName ? (
              <span>Guest: {guestName} • Clavius Room Key: ACTIVE</span>
            ) : (
              <span>Unregistered Guest • Consult Reception</span>
            )}
          </div>
        </footer>

      </div>

      {/* Global Search Dialog Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearch
            onNavigateToRoom={handleRoomChange}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
