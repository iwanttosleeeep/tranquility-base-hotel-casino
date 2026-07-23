# Tranquility Base Hotel & Casino • Digital Residence

> *"Mark speaking, please tell me how may I direct your call?"*

Welcome to the digital residence of Arctic Monkeys' 2018 retro-futuristic lounge masterpiece. This immersive fan website functions as a narrative-driven concierge: arrive through the G-level Lobby, check in at Reception, and explore different "rooms" for lyrical annotations, thematic analysis, chronological timelines, and cinema subtexts.

---

## 🏨 Guest Arrival & Stay

- **G-level Lobby**: A full-screen arrival experience built around the album cover, the hotel slogan, and a four-star rating. New visitors are directed to Reception before entering the hotel.
- **Guest profile**: Reception registers a guest name and a three-digit room number (default: `505`). The selected room follows the guest through relevant parts of the hotel.
- **Otis Lift**: The enlarged elevator console can collapse into a slim left-hand control rail, giving the current room more space. Its broadcast updates with the selected floor.
- **Guest ledgers**: Guest profiles, forum posts, and feedback are stored through Supabase, allowing authenticated residents to return to their own records.

## 🏨 Hotel Structure & Rooms

- **Lobby Floor (G)**: Main entrance and interactive concierge directory.
- **Reception Desk (01)**: Register or edit a guest profile and three-digit room number, check out, or leave a note through the Feedback & Complaints form.
- **The Lounge (02)**: Chronological interview archive with source links, connected tracks, and official-recording links where available.
- **Hotel Cinema (03)**: Retro 70s CRT visual database mapping cinema and literary influences (Fassbinder, Melville, Postman) that shaped the album.
- **Cocktail Bar (04)**: Tutorial links and a forthcoming musical-analysis service.
- **The Library (05)**: Fully interactive tracklist index featuring selective verified annotations, cross-references, and direct links to official lyrics.
- **Grand Ballroom (06)**: Virtual gig polaroids, tour setlists, and historical arena logs.
- **Clavius Casino (07)**: Lunar slot machine minigame. Pull the brass lever to match icons and transmit hidden sound bites.
- **Hotel Archive (08)**: Analogue terminal outlining the detailed writing, recording, and touring chronology of the album era.
- **The Observatory (09)**: Technological and media theory analysis sector, diving into corporate space exploration, isolation, and late capitalism.
- **Rooftop Garden (10)**: A residents' forum for readings, theories, favourite lines, and personal encounters with *Tranquility Base Hotel & Casino*. Registered guests can publish and edit their own transmissions.

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
