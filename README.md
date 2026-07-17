# Tranquility Base Hotel & Casino • Digital Residence

> *"Mark speaking, please tell me how may I direct your call?"*

Welcome to the digital residence of Arctic Monkeys' 2018 retro-futuristic lounge masterpiece. This immersive fan website functions as a narrative-driven concierge, inviting visitors to check in and explore different "rooms" to discover lyrical annotations, thematic analysis, chronological timelines, and cinema subtexts.

---

## 🏨 Hotel Structure & Rooms

- **Lobby Floor (G)**: Main entrance and interactive concierge directory.
- **Reception Desk (01)**: Registration ledger. Sign the ledger to retrieve your room key card.
- **The Lounge (02)**: Historical media archives, press transcripts, and interactive reel-to-reel audio log tapes.
- **Hotel Cinema (03)**: Retro 70s CRT visual database mapping cinema and literary influences (Fassbinder, Melville, Postman) that shaped the album.
- **The Observatory (04)**: Technological and media theory analysis sector, diving into corporate space exploration, isolation, and late capitalism.
- **The Library (05)**: Fully interactive tracklist index featuring selective verified annotations, cross-references, and direct links to official lyrics.
- **Grand Ballroom (06)**: Virtual gig polaroids, tour setlists, and historical arena logs.
- **Clavius Casino (07)**: Lunar slot machine minigame. Pull the brass lever to match icons and transmit hidden sound bites.
- **Hotel Archive (08)**: Analogue terminal outlining the detailed writing, recording, and touring chronology of the album era.
- **The Rooftop Garden (09)**: Quiet reading area holding original long-form essays and deep cultural interpretations of the album.

---

## 🛠️ Local Development & Scripts

This is a clean, dependency-minimized static React application powered by Vite, Tailwind CSS, and Motion.

### Commands

Install dependencies:
```bash
npm install
```

Start local development server (binds to port `3000`):
```bash
npm run dev
```

Build static production-ready assets (emitted to `./dist/`):
```bash
npm run build
```

Run TypeScript syntax checks:
```bash
npm run lint
```

---

## 📜 Content Contribution & Moderation Rules

To ensure total accuracy and preserve the high conceptual caliber of the archive, all content contributions are governed by strict verification protocols.

### 1. Absolute Prohibition of AI-Generated Content
- Under no circumstances will AI-generated interview transcriptions, essays, dates, or quotes be accepted. 
- All factual data files (found in `src/data/`) use `[PLACEHOLDER]` skeletons. Fill these in manually with authentic text.

### 2. Mandatory Citation & Sources
- Every interview quote, timeline milestone, or media quote must have a verifiable `sourceUrl`.
- Songs in `songs.ts` must use real, official lyric link URLs (e.g. Genius, or official band publications) in `officialLyricsUrl`. Unverified or unsourced entries will not be indexed.

### 3. Contribution Workflow
1. Locate the correct data file in `src/data/` (`songs.ts`, `interviews.ts`, `films.ts`, `timeline.ts`, `essays.ts`).
2. Replace `[PLACEHOLDER]` fields with curated text.
3. Attach the precise reference URL to the `sourceUrl` or `officialLyricsUrl` fields.
4. Ensure the React components display empty states or preparation cues gracefully.
