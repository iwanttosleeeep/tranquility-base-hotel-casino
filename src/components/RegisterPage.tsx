import { useState, type FormEvent } from "react";
import { Key } from "lucide-react";

interface RegisterPageProps {
  onRegister: (name: string, room: string, email: string) => Promise<{ success: boolean; message: string }>;
  onVerifyCode: (email: string, code: string) => Promise<{ success: boolean; message: string }>;
}

export default function RegisterPage({ onRegister, onVerifyCode }: RegisterPageProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("505");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const submitRegistration = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{3}$/.test(room)) {
      setMessage("Please enter a three-digit room number.");
      return;
    }
    setIsSubmitting(true);
    const result = await onRegister(name.trim(), room, email.trim());
    setMessage(result.message);
    setCodeSent(result.success);
    setIsSubmitting(false);
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(roomCode)) {
      setMessage("Please enter the six-digit room code from your email.");
      return;
    }
    setIsSubmitting(true);
    const result = await onVerifyCode(email.trim(), roomCode);
    setMessage(result.message);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f2ed] relative overflow-hidden">
      <div className="absolute inset-0 signal-interference bg-white/5 mix-blend-overlay opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgba(197,160,89,0.045),transparent_48%)] pointer-events-none" />
      <div className="relative min-h-screen max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10 flex flex-col gap-10 md:gap-14">
        <header className="max-w-5xl">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-4 block">Floor 01 • Room 01</span>
          <h1 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-6">Reception Desk</h1>
          <p className="text-base md:text-2xl text-[#f5f2ed]/70 font-serif max-w-5xl leading-relaxed">
            &quot;Mark speaking, please tell me how may I direct your call?&quot; Welcome to the digital residence of Arctic Monkeys&apos; 2018 retro-futuristic masterpiece. Sign the guest register below to receive your room key and begin exploring.
          </p>
        </header>

        <section className="w-full rounded-xl glass-panel border border-[#c5a059]/20 bg-[#120e0a]/40 p-6 md:p-8 flex flex-col gap-7">
          <div className="flex items-center gap-4 border-b border-[#c5a059]/30 pb-5">
            <Key className="text-[#c5a059]" size={25} />
            <h2 className="font-serif italic text-2xl md:text-3xl text-[#f5f2ed]">Guest Register Ledger</h2>
          </div>

          {!codeSent ? (
          <form onSubmit={submitRegistration} className="flex flex-col gap-4">
            <label className="text-sm md:text-lg font-panel text-[#c5a059] uppercase tracking-[0.16em]">Reserve a room with your email:</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setMessage(""); }}
              className="w-full bg-black/35 border border-[#c5a059]/50 rounded-lg px-5 py-3.5 md:px-6 md:py-4 font-serif text-lg md:text-xl text-[#f5f2ed] placeholder:text-[#f5f2ed]/35 focus:outline-none focus:border-[#c5a059]"
            />
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_9rem] gap-3">
              <input
                type="text"
                required
                placeholder="e.g. Alex Turner"
                value={name}
                onChange={(event) => { setName(event.target.value); setMessage(""); }}
                className="min-w-0 bg-black/35 border border-[#c5a059]/30 rounded-lg px-5 py-3.5 md:px-6 md:py-4 font-serif text-lg md:text-xl text-[#f5f2ed] placeholder:text-[#f5f2ed]/35 focus:outline-none focus:border-[#c5a059]"
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{3}"
                maxLength={3}
                required
                value={room}
                onChange={(event) => { setRoom(event.target.value.replace(/\D/g, "")); setMessage(""); }}
                className="bg-black/35 border border-[#c5a059]/30 rounded-lg px-5 py-3.5 md:px-6 md:py-4 font-serif text-lg md:text-xl text-[#f5f2ed] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="font-serif italic text-sm md:text-lg text-[#c5a059] min-h-6">{message}</span>
              <button type="submit" disabled={isSubmitting} className="front-action-button self-end !text-sm md:!text-base !px-8 !py-4 disabled:opacity-50">
                {isSubmitting ? "Sending..." : "Get room code"}
              </button>
            </div>
          </form>
          ) : (
          <form onSubmit={verifyCode} className="flex flex-col gap-5">
            <div>
              <span className="text-sm md:text-lg font-panel text-[#c5a059] uppercase tracking-[0.16em]">Your room code has been sent to your email. Please check your inbox.</span>
              <p className="mt-2 font-serif italic text-sm text-[#f5f2ed]/50">Enter the six-digit code to complete your check-in.</p>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              placeholder="000000"
              value={roomCode}
              onChange={(event) => { setRoomCode(event.target.value.replace(/\D/g, "")); setMessage(""); }}
              className="w-full max-w-sm bg-black/35 border border-[#c5a059]/50 rounded-lg px-5 py-3.5 md:px-6 md:py-4 font-tbhc tracking-[0.3em] text-xl md:text-2xl text-[#f5f2ed] placeholder:text-[#f5f2ed]/25 focus:outline-none focus:border-[#c5a059]"
            />
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="font-serif italic text-sm text-[#c5a059] min-h-5">{message}</span>
              <button type="button" onClick={() => { setCodeSent(false); setRoomCode(""); setMessage(""); }} className="self-start font-panel text-[10px] text-[#f5f2ed]/50 hover:text-[#c5a059]">Use a different email</button>
              <button type="submit" disabled={isSubmitting} className="front-action-button self-end !text-sm md:!text-base !px-8 !py-4 disabled:opacity-50">
                {isSubmitting ? "Checking..." : "Check in"}
              </button>
            </div>
          </form>
          )}
        </section>
      </div>
    </main>
  );
}
