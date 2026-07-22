import React, { useEffect, useState } from "react";
import { Key, PencilLine, LogOut, MessageSquare } from "lucide-react";

interface ReceptionDeskProps {
  guestName: string;
  guestRoom: string;
  onRegister: (name: string, room: string) => void;
}

export default function ReceptionDesk({ guestName, guestRoom, onRegister }: ReceptionDeskProps) {
  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("505");
  const [roomError, setRoomError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isRegistered, setIsRegistered] = useState(!!guestName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsRegistered(!!guestName);
    setNameInput(guestName);
    setRoomInput(guestRoom);
  }, [guestName, guestRoom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && /^\d{3}$/.test(roomInput)) {
      onRegister(nameInput.trim(), roomInput);
      setIsRegistered(true);
      setIsEditing(false);
      setRoomError("");
    } else if (!/^\d{3}$/.test(roomInput)) {
      setRoomError("Please enter a three-digit room number.");
    }
  };

  const submitFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    if (!feedback.trim()) return;
    const storedFeedback = JSON.parse(localStorage.getItem("tbhc_guest_feedback") || "[]");
    storedFeedback.unshift({
      message: feedback.trim(),
      guest: guestName || "Unregistered guest",
      room: guestName ? guestRoom : null,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("tbhc_guest_feedback", JSON.stringify(storedFeedback));
    setFeedback("");
    setFeedbackSent(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Concierge Welcome Header */}
      <div className="text-center md:text-left">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#c5a059] font-serif italic mb-2 block">
          Floor 01 • Room 01
        </span>
        <h2 className="text-4xl md:text-6xl font-tbhc tracking-wide text-glow leading-tight mb-4">
          Reception Desk
        </h2>
        <p className="text-sm md:text-lg text-[#f5f2ed]/70 font-serif max-w-2xl leading-relaxed">
          "Mark speaking, please tell me how may I direct your call?"
          Welcome to the digital residence of Arctic Monkeys' 2018 retro-futuristic masterpiece.
          Sign the guest register below to receive your room key and begin exploring.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 min-w-0">
        {/* Guest Register Ledger */}
        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 flex flex-col gap-6 bg-black/30 min-w-0">
          <div className="flex items-center gap-3 border-b border-[#c5a059]/30 pb-4">
            <Key className="text-[#c5a059]" size={20} />
            <h3 className="font-serif italic text-xl text-[#f5f2ed]">
              Guest Register Ledger
            </h3>
          </div>

          {!isRegistered || isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-xs font-panel text-[#c5a059] uppercase tracking-wider">
                {isEditing ? "Update guest profile:" : "Please enter your name to register:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_6rem] gap-2 min-w-0">
                <input
                  type="text"
                  placeholder="e.g. Alex Turner"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="min-w-0 bg-black/40 border border-[#c5a059]/30 rounded px-4 py-2 font-serif text-[#f5f2ed] focus:outline-none focus:border-[#c5a059] transition-colors"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{3}"
                  maxLength={3}
                  placeholder="Room"
                  value={roomInput}
                  onChange={(e) => { setRoomInput(e.target.value.replace(/\D/g, "")); setRoomError(""); }}
                  className="bg-black/40 border border-[#c5a059]/30 rounded px-4 py-2 font-serif text-[#f5f2ed] focus:outline-none focus:border-[#c5a059] transition-colors"
                />
              </div>
              {roomError && <span className="font-serif text-xs text-[#d97706]">{roomError}</span>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#d97706] text-black font-panel text-xs uppercase tracking-widest px-6 py-2 rounded transition-all active:scale-95"
                >
                  {isEditing ? "Save" : "Register"}
                </button>
              </div>
              {isEditing && (
                <button type="button" onClick={() => setIsEditing(false)} className="self-start text-[11px] font-panel text-[#f5f2ed]/50 hover:text-[#c5a059]">
                  Cancel
                </button>
              )}
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded bg-[#c5a059]/5 border border-[#c5a059]/20 flex flex-col gap-2">
                <span className="text-[10px] font-panel text-[#c5a059] uppercase tracking-wider">
                  Currently Checked In:
                </span>
                <span className="text-2xl font-serif italic text-glow text-[#f5f2ed]">
                  {guestName}
                </span>
              </div>
              <p className="text-xs text-[#f5f2ed]/60 leading-relaxed font-serif">
                You have been assigned Room {guestRoom} (Tranquility Suite). Your metallic lounge pass has been verified. Use the elevator terminal on the left to change levels at any time.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-left font-panel text-[11px] text-[#c5a059]/70 hover:text-[#c5a059] transition-all">
                  <PencilLine size={13} /> Edit guest profile
                </button>
                <button onClick={() => { setIsRegistered(false); setIsEditing(false); onRegister("", "505"); }} className="flex items-center gap-2 text-left font-panel text-[11px] text-[#c5a059]/70 hover:text-[#c5a059] transition-all">
                  <LogOut size={13} /> Check out
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-lg glass-panel border border-[#c5a059]/20 flex flex-col gap-4 bg-[#120e0a]/40">
          <div className="flex items-center gap-3 border-b border-[#c5a059]/30 pb-4">
            <MessageSquare className="text-[#c5a059]" size={20} />
            <h3 className="font-serif italic text-xl text-[#f5f2ed]">Feedback &amp; Complaints</h3>
          </div>
          <p className="font-serif text-sm leading-relaxed text-[#f5f2ed]/65">
            We value your feedback! Please let us know about your stay or how we can improve our services.
          </p>
          <form onSubmit={submitFeedback} className="flex flex-col gap-3">
            <textarea
              value={feedback}
              onChange={(event) => { setFeedback(event.target.value); setFeedbackSent(false); }}
              required
              maxLength={1000}
              rows={4}
              placeholder="Leave a note for our hotel..."
              className="w-full resize-y bg-black/30 border border-[#c5a059]/20 rounded px-4 py-3 font-serif text-sm text-[#f5f2ed] placeholder:text-[#f5f2ed]/30 focus:outline-none focus:border-[#c5a059]"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="font-serif italic text-xs text-[#f5f2ed]/45">{feedbackSent ? "Your message is saved in our guest ledger." : ""}</span>
              <button type="submit" className="shrink-0 bg-[#c5a059] hover:bg-[#d97706] text-black font-panel text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-all active:scale-95">Send feedback</button>
            </div>
          </form>
        </div>
        </div>

      </div>
    </div>
  );
}
