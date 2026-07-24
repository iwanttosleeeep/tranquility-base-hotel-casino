# Tranquility Base Hotel & Casino • Digital Residence

> *"Mark speaking, please tell me how may I direct your call?"*

An immersive, unofficial fan archive dedicated to Arctic Monkeys' 2018 album *Tranquility Base Hotel & Casino*. Rather than a conventional wiki, the site is built as the hotel itself: guests arrive through the G-level Lobby, check in at Reception, and ride the Otis lift between rooms — each floor holding a different wing of the archive. Every factual record is source-linked and evidence-graded.

**Live site:** (https://tbhc.sehnsucht.uk)

---

## 🏨 Guest Arrival & Stay

- **G-level Lobby**: full-screen arrival experience with the concierge directory. Each floor links directly via hash routes (e.g. `#/archive`, `#/library/star-treatment`), so any room can be shared or bookmarked.
- **Guest profile**: Reception registers a guest name and a three-digit room number (default `505`), verified by an eight-digit room code sent by email. Profiles, forum posts, and feedback are stored through Supabase; the hotel remains fully browsable without checking in.
- **Otis Lift**: the elevator console navigates all floors, collapses into a slim control rail, and answers the browser's back/forward buttons.

## 🏨 Hotel Structure & Rooms

- **Lobby (G)** — main entrance and interactive concierge directory.
- **Reception Desk (01)** — guest register, room keys, house welcome, and the Feedback & Complaints form.
- **The Lounge (02)** — chronological interview archive: publication, date, sourced quotes, connected tracks, and official-recording links where available.
- **Hotel Cinema (03)** — the projection room: machine-read shot rhythm and colour analysis of the album's music videos, with timecoded viewing notes and source-linked context.
- **Cocktail Bar (04)** — instrument tutorial shelves (piano, guitar, bass, drums) and the Arrangement Service: signal-derived stem-energy scores for each track. Private measurements only; no stems are hosted.
- **The Library (05)** — one dossier per song: verified annotations, cross-references into the interview archive and reference catalogue, and links to official lyrics. No full lyric texts are reproduced.
- **Grand Ballroom (06)** — tour polaroids, setlists, and historical arena logs.
- **Clavius Casino (07)** — lunar slot machine minigame. Match icons to intercept stray hotel-intercom transmissions (in-universe flavour text, not archival audio).
- **Hotel Archive (08)** — the analogue terminal: the album era's writing, recording, release, and touring chronology, followed by the **Verified Reference Catalogue** — evidence-graded records of the books, films, television, and visual culture documented around the album.
- **The Observatory (09)** — ten conceptual frameworks for reading retro-futurist culture (media ecology, cognitive estrangement, the attention economy, and more), each with a full academic reference list. Academic correspondence is not treated as evidence of creative influence.
- **Rooftop Garden (10)** — residents' forum for readings, theories, favourite lines, and personal encounters with the record. Registered guests can publish and edit their own transmissions.

## 🧾 Evidence Grades

Records in the Verified Reference Catalogue carry a grade describing **documentation, not influence**:

- **A — central:** TBHC is the main subject and the source contains extensive first-hand detail.
- **B — substantial:** TBHC is a major subject, but the interview has a wider frame or a shorter running time.
- **C — passing but useful:** a later retrospective supplies a discrete new insight about TBHC, without being mainly about the album.

- **D1 — developed critical interpretation:** a critic advances an argument about theme, narrative, persona or social meaning and anchors it in identifiable features of the released work.
- **D2 — critical comparison:** a critic uses another work, artist or genre to describe the album, song or video. This establishes reception history, not creative influence.
- **D3 — editorial notice:** a brief but attributable description or comparison with limited supporting argument.

---

## 🛠️ Local Development

A static React application: Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion. Supabase powers the optional guest system.

```bash
npm install        # install dependencies
npm run dev        # local dev server (port 3000)
npm run lint       # TypeScript checks (tsc --noEmit)
npm run build      # production build → ./dist/
```

### Environment

Guest check-in requires a Supabase project. Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Never place a `service_role` / secret key in any `VITE_` variable. Without these values the site runs normally with check-in disabled.

### Deployment

Pushes to `main` build and deploy automatically to GitHub Pages via `.github/workflows/deploy.yml` (type-check → build → publish). The same two Supabase values must be added as repository **Actions secrets** for the production build.

---

## 📜 Content Contribution Rules

All content is governed by strict verification protocols.

1. **No AI-generated factual content.** AI-generated interview transcriptions, quotes, dates, or essays are never accepted — in data files *or* in UI copy. `[PLACEHOLDER]` skeletons are filled in manually with authentic text.
2. **Mandatory citation.** Every interview quote, timeline milestone, or catalogue record must carry a verifiable `sourceUrl`. Song dossiers link to official lyric pages via `officialLyricsUrl` instead of reproducing lyric texts.
3. **Workflow.** Locate the data file in `src/data/` (`songs.ts`, `interviews.ts`, `references.ts`, `timeline.ts`, `liveArchive.ts`, `criticism.ts`, `mvAnalysis.ts`, `audioAnalysis.ts`, `observatory.ts`, `essays.ts`, `films.ts`) → replace placeholders with curated text → attach precise source URLs → confirm empty states still render gracefully → `npm run lint`.

---

## 🪪 Credits & Disclaimer

An unofficial fan project with no affiliation to Arctic Monkeys, Domino Recording Co., or their representatives. Album artwork, lyrics, and recordings remain the property of their rights holders; this site documents and links to sources rather than reproducing protected material.

- Elevator icon: [SVG Repo](https://www.svgrepo.com/) (elevator-scroll).
- Display typeface: fan-made *Tranquility New Bold* webfont; body typeface: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond).

*"Four stars out of five."*
