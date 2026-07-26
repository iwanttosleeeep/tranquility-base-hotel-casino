# Tranquility Base Hotel & Casino • Digital Residence

> *"Mark speaking, please tell me how may I direct your call?"*

An immersive, unofficial fan archive dedicated to Arctic Monkeys' 2018 album *Tranquility Base Hotel & Casino*. Rather than a conventional wiki, the site is built as the hotel itself: guests arrive through the G-level Lobby, check in at Reception, and ride the Otis lift between rooms — each floor holding a different wing of the archive. Curated factual records are source-linked and evidence-graded; the audio and video readouts are clearly identified machine-generated analysis.

**Live site:** https://tbhc.sehnsucht.uk

---

## 🏨 Guest Arrival & Stay

- **G-level Lobby**: full-screen arrival experience with the concierge directory. Each floor links directly via hash routes (e.g. `#/archive`, `#/library/star-treatment`), so any room can be shared or bookmarked.
- **Day Visitor & Guest profile**: day visitors can browse the Lobby and every public floor without registering. Email check-in unlocks a private Suite and resident actions; Reception assigns a three-digit room number (default `505`) after verification by an eight-digit room code. Profiles, Garden entries, feedback, Room Service orders, and Casino receipts are stored through Supabase.
- **Otis Lift**: the elevator console navigates all floors, collapses into a slim control rail, and answers the browser's back/forward buttons.
- **Hotel Guide & Search Terminal**: the Lobby header opens a short guide to the rooms and guest systems, while the search terminal scans song dossiers, interview records, and Hotel Archive references.

## 🏨 Hotel Structure & Rooms

- **Your Suite** — a private night counter, Room Service terminal, and drawer for saved or discardable receipts.
- **Lobby (G)** — main entrance, concierge directory, Hotel Guide, and Search Terminal.
- **Reception Desk (01)** — guest register, room keys, Feedback & Complaints, and a staff-only Management Ledger for triaging submissions.
- **The Lounge (02)** — chronological interview archive: publication, date, connected tracks, source documents, and official-recording links where available.
- **Hotel Cinema (03)** — the projection room: entirely machine-generated shot, palette, brightness, and saturation analysis, with timecoded readouts and source-linked cultural context.
- **Cocktail Bar (04)** — instrument tutorial shelves (piano, guitar, bass, drums) and the Arrangement Service: entirely machine-generated stem, rhythm, spectral, and dynamics readouts. Private measurements only; no stems are hosted.
- **The Library (05)** — one dossier per album track and B-side, cross-linked to the interview archive, criticism, and verified reference catalogue. No full lyric texts are reproduced.
- **Grand Ballroom (06)** — tour chronology, selected setlists, performance statistics, and live-arrangement notes.
- **Clavius Casino (07)** — lunar slot machine minigame. Match icons to intercept stray hotel-intercom transmissions (in-universe flavour text, not archival audio).
- **Hotel Archive (08)** — the analogue terminal: the album era's writing, recording, release, and touring chronology, followed by the **Verified Reference Catalogue** — evidence-graded records of film, literature, television, music, and design documented around the album.
- **The Observatory (09)** — ten conceptual frameworks for reading retro-futurist culture (media ecology, cognitive estrangement, the attention economy, and more), each with a full academic reference list. Academic correspondence is not treated as evidence of creative influence.
- **Rooftop Garden (10)** — paginated critical reception and a residents' guest book for readings, theories, favourite lines, and personal encounters with the record. Registered guests can publish, edit, and delete their own entries; hotel administrators can moderate entries.

## 🧾 Evidence Grades

Records in the Verified Reference Catalogue carry a grade describing **documentation, not influence**:

- **A — direct:** a direct artist statement or another primary-source connection.
- **B — reported context:** strong sourced context without a direct causal claim.
- **C — documented association:** a traceable association that is not proof of influence.

- **D1 — developed critical interpretation:** a critic advances an argument about theme, narrative, persona or social meaning and anchors it in identifiable features of the released work.
- **D2 — critical comparison:** a critic uses another work, artist or genre to describe the album, song or video. This establishes reception history, not creative influence.
- **D3 — editorial notice:** a brief but attributable description or comparison with limited supporting argument.

---

## 🛠️ Local Development

A static React application: Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion. Supabase powers email check-in and resident features; public archive browsing remains available without it.

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

Never place a `service_role` / secret key in any `VITE_` variable. Without these public values the public archive remains browsable in Day Visitor mode, but check-in and resident features are unavailable.

### Database

The checked-in features require the Supabase tables and Row Level Security policies used by the app. SQL migrations in `supabase/migrations/` add Room Service, kept receipts, Garden ownership and moderation, the staff Management Ledger, and pagination. Apply them in filename order after the base guest tables have been created. Keep administrator membership server-side in `public.hotel_admins`; never expose a service-role key to the browser.

### Deployment

Pushes to `main` build and deploy a GitHub Pages copy through `.github/workflows/deploy.yml` (type-check → build → publish). The same two Supabase values must be added as repository **Actions secrets** for that build.

The public domain, `tbhc.sehnsucht.uk`, is a static `dist/` build served by Caddy on the web VPS. Unless a separate server-side deploy hook is configured, update it by building locally and synchronising `dist/` to `/var/www/tbhc/`. The private media worker is a separate machine and does not serve the website.

### Machine/AI Media Analysis

**All audio and video analytical readouts published by the site are generated entirely by automated machine/AI pipelines. They are not written, checked, or corrected by a human musicologist, audio engineer, cinematographer, or film scholar.** They describe detected signal and image features; they do not establish artistic intent, meaning, quality, influence, or causation, and they may contain model or measurement errors.

Audio processing uses Demucs AI source separation followed by deterministic signal measurements. Video processing uses automated shot detection and OpenCV-based image measurements. The interface must preserve this distinction whenever it presents the resulting data.

`src/data/audioAnalysis.ts` is a generated build artefact. Do not edit it by hand. It is a compact, public-safe derivative of private measurements; neither source audio nor separated stems belong in this repository.

Generate it in this order:

```bash
# On the private analysis worker
python tbhc-pipeline/analyze_audio.py /opt/tbhc-pipeline/output/separate \
  --out /opt/tbhc-pipeline/output/audio-analysis-v2

# From the repository's tbhc-pipeline directory
python build_site_data.py /opt/tbhc-pipeline/output/audio-analysis-v2 \
  --out ../src/data/audioAnalysis.ts

# Then validate the generated site data before committing it
npm run lint
npm run build
```

The complete private-media runbook and measurement contract live in [`tbhc-pipeline/README.md`](tbhc-pipeline/README.md).

---

## 📜 Content Contribution Rules

All content is governed by strict verification protocols.

1. **No AI-generated archival claims.** Interview quotations, dates, historical events, references, and claims about creative intent must come from verifiable human-authored sources. The explicit exception is the clearly labelled media-analysis layer: its audio/video measurements are wholly machine-generated and must never be presented as human expert judgment or evidence of intent.
2. **Mandatory citation.** Every interview quote, timeline milestone, critical claim, or catalogue record must carry a verifiable source URL. Do not reproduce full lyrics, recordings, separated stems, or private analysis frames.
3. **Workflow.** Edit the relevant hand-maintained file in `src/data/` (`songs.ts`, `interviews.ts`, `references.ts`, `timeline.ts`, `liveArchive.ts`, `criticism.ts`, `observatory.ts`) → attach precise source URLs → confirm empty states still render gracefully → `npm run lint`. Generated media datasets such as `audioAnalysis.ts` and `mvAnalysis.ts` must instead be rebuilt from the private pipeline and clearly labelled as machine-generated.

---

## 🪪 Credits & Disclaimer

An unofficial fan project with no affiliation to Arctic Monkeys, Domino Recording Co., or their representatives. Album artwork, lyrics, and recordings remain the property of their rights holders; this site documents and links to sources rather than reproducing protected material.

- Elevator icon: [SVG Repo](https://www.svgrepo.com/) (elevator-scroll).
- Display typeface: fan-made *Tranquility New Bold* webfont; body typeface: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond).

*"Four stars out of five."*
