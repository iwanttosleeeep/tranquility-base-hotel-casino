import React, { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, MapPin, Key, Radio } from "lucide-react";

interface ReceptionDeskProps {
  guestName: string;
  onRegister: (name: string) => void;
  onNavigateToRoom: (room: any) => void;
}

export default function ReceptionDesk({ guestName, onRegister, onNavigateToRoom }: ReceptionDeskProps) {
  const [nameInput, setNameInput] = useState("");
  const [isRegistered, setIsRegistered] = useState(!!guestName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onRegister(nameInput.trim());
      setIsRegistered(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Concierge Welcome Header */}
      <div className="text-center md:text-left">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Lobby Floor • Room 01
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          The Reception Desk
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          "Mark speaking, please tell me how may I direct your call?"
          Welcome to the digital residence of Arctic Monkeys' 2018 retro-futuristic masterpiece.
          Sign the guest register below to receive your room key and begin exploring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Guest Register Ledger */}
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 flex flex-col gap-6 bg-black/30">
          <div className="flex items-center gap-3 border-b border-[#c5a059]/30 pb-4">
            <BookOpen className="text-[#c5a059]" size={20} />
            <h3 className="font-serif italic text-xl text-[#f5f2ed]">
              Guest Register Ledger
            </h3>
          </div>

          {!isRegistered ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-xs font-mono text-[#c5a059] uppercase tracking-wider">
                Please enter your name to register:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Alex Turner"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-[#c5a059]/30 rounded px-4 py-2 font-serif text-[#f5f2ed] focus:outline-none focus:border-[#c5a059] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#d97706] text-black font-mono text-xs uppercase tracking-widest px-6 py-2 rounded transition-all active:scale-95"
                >
                  Register
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded bg-[#c5a059]/5 border border-[#c5a059]/20 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-[#c5a059] uppercase tracking-wider">
                  Currently Checked In:
                </span>
                <span className="text-2xl font-serif italic text-glow text-[#f5f2ed]">
                  {guestName}
                </span>
              </div>
              <p className="text-xs text-[#f5f2ed]/60 leading-relaxed font-serif">
                You have been assigned Room 505 (Tranquility Suite). Your metallic lounge pass has been verified. Use the elevator terminal on the left to change levels at any time.
              </p>
              <button
                onClick={() => {
                  setIsRegistered(false);
                  onRegister("");
                }}
                className="text-left font-mono text-[9px] uppercase tracking-wider text-[#c5a059]/60 hover:text-[#c5a059] transition-all"
              >
                [ Sign out / Change guest profile ]
              </button>
            </div>
          )}
        </div>

        {/* Directory Card */}
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 flex flex-col gap-6 bg-[#120e0a]/40">
          <div className="flex items-center gap-3 border-b border-[#c5a059]/30 pb-4">
            <Key className="text-[#c5a059]" size={20} />
            <h3 className="font-serif italic text-xl text-[#f5f2ed]">
              Lobby Directory
            </h3>
          </div>

          <div className="flex flex-col gap-4 font-serif italic text-sm text-[#f5f2ed]/80">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">05</span>
              <div className="flex flex-col">
                <span className="font-semibold text-glow cursor-pointer hover:text-[#c5a059]" onClick={() => onNavigateToRoom("LIBRARY")}>The Library</span>
                <span className="text-xs text-[#f5f2ed]/50 font-sans not-italic">Lyrical repository, full track titles, annotations, and references.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">02</span>
              <div className="flex flex-col">
                <span className="font-semibold text-glow cursor-pointer hover:text-[#c5a059]" onClick={() => onNavigateToRoom("LOUNGE")}>The Lounge</span>
                <span className="text-xs text-[#f5f2ed]/50 font-sans not-italic">Tape archive of press files, memorable quotes, and interview logs.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">03</span>
              <div className="flex flex-col">
                <span className="font-semibold text-glow cursor-pointer hover:text-[#c5a059]" onClick={() => onNavigateToRoom("CINEMA")}>Hotel Cinema</span>
                <span className="text-xs text-[#f5f2ed]/50 font-sans not-italic">70s CRT visual database mapping movies and books that shaped the album.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-xs text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded">07</span>
              <div className="flex flex-col">
                <span className="font-semibold text-glow cursor-pointer hover:text-[#c5a059]" onClick={() => onNavigateToRoom("CASINO")}>Clavius Casino</span>
                <span className="text-xs text-[#f5f2ed]/50 font-sans not-italic">Interactive moon-casino reel system with hidden sound bites and easter eggs.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
