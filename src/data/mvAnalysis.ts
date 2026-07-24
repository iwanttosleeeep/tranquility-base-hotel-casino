export interface VideoSegment {
  start: number;
  end: number;
  cuts: number;
  palette: string;
  brightness: number;
  saturation: number;
}

export interface VideoAnalysis {
  id: string;
  title: string;
  format: string;
  duration: number;
  shotCount: number;
  sourceNote: string;
  dossier: {
    timecode: string;
    observation: string;
    formalNote: string;
  }[];
  contextLinks: {
    referenceId: string;
    note: string;
    scope: "Direct production evidence" | "Album context only";
  }[];
  segments: VideoSegment[];
}

// Derived from private, locally processed authorised files. This is a compact
// measurement register only: no video, audio, or reference frames are shipped.
export const VIDEO_ANALYSES: VideoAnalysis[] = [
  {
    id: "four-out-of-five",
    title: "Four Out Of Five",
    format: "Official video",
    duration: 328.08,
    shotCount: 120,
    sourceNote: "Shot boundaries and colour measures were calculated from the official video.",
    dossier: [
      {
        timecode: "00:00–01:22",
        observation: "The video establishes a pale interior and makes studio lighting equipment visible within the image.",
        formalNote: "The exposed apparatus turns the room into a staged set rather than presenting it as an invisible, naturalistic space.",
      },
      {
        timecode: "01:22–02:18",
        observation: "A television image and its screen texture become a prominent visual layer.",
        formalNote: "The change from the cool room to an emissive screen makes mediation itself part of the scene's surface.",
      },
      {
        timecode: "02:18–05:28",
        observation: "The setting moves through a casino-like interior of slot machines, coloured light, instruments, and classical decorative objects.",
        formalNote: "The sequence juxtaposes performance, leisure architecture, and display technology instead of keeping those spaces separate.",
      },
    ],
    contextLinks: [
      {
        referenceId: "film-barry-lyndon",
        note: "The production note verifies Castle Howard as a shared location. It does not establish a visual homage to Kubrick's film.",
        scope: "Direct production evidence",
      },
      {
        referenceId: "book-postman",
        note: "The song's documented media-theory source offers lyrical context for the video’s visible screens, but not proof that the book dictated its images.",
        scope: "Album context only",
      },
    ],
    segments: [
      { start: 0, end: 27.3, cuts: 2, palette: "#110717", brightness: 61, saturation: 113 },
      { start: 27.3, end: 54.7, cuts: 8, palette: "#382825", brightness: 67, saturation: 110 },
      { start: 54.7, end: 82, cuts: 8, palette: "#393a34", brightness: 65, saturation: 141 },
      { start: 82, end: 109.4, cuts: 9, palette: "#110615", brightness: 31, saturation: 174 },
      { start: 109.4, end: 136.7, cuts: 15, palette: "#2c2421", brightness: 48, saturation: 167 },
      { start: 136.7, end: 164, cuts: 7, palette: "#1d1c22", brightness: 60, saturation: 142 },
      { start: 164, end: 191.4, cuts: 11, palette: "#291c19", brightness: 48, saturation: 142 },
      { start: 191.4, end: 218.7, cuts: 18, palette: "#161520", brightness: 34, saturation: 182 },
      { start: 218.7, end: 246.1, cuts: 10, palette: "#16232c", brightness: 43, saturation: 161 },
      { start: 246.1, end: 273.4, cuts: 18, palette: "#0c111c", brightness: 39, saturation: 153 },
      { start: 273.4, end: 300.7, cuts: 13, palette: "#182135", brightness: 46, saturation: 141 },
      { start: 300.7, end: 328.1, cuts: 12, palette: "#0d1321", brightness: 37, saturation: 149 },
    ],
  },
  {
    id: "tranquility-base-hotel-and-casino",
    title: "Tranquility Base Hotel & Casino",
    format: "Official video",
    duration: 230.814,
    shotCount: 67,
    sourceNote: "Shot boundaries and colour measures were calculated from the official video.",
    dossier: [
      {
        timecode: "00:00–01:15",
        observation: "Low-key blue, green, and red lighting frames a performer in a dark interior.",
        formalNote: "Restricted illumination keeps the room partially withheld; colour operates as the primary way the space is divided.",
      },
      {
        timecode: "01:15–02:34",
        observation: "The film continues through a casino environment: machines, screens, signage, and a white-suited figure recur.",
        formalNote: "The casino functions less as a realistic location than as a designed network of surfaces, glow, and repeated visual signals.",
      },
      {
        timecode: "02:34–03:50",
        observation: "The late section alternates dark blue-black intervals with brighter neutral ones.",
        formalNote: "The measured brightness change is a structural transition; its narrative meaning remains open to the viewer.",
      },
    ],
    contextLinks: [
      {
        referenceId: "film-2001",
        note: "Turner traced the lunar-hotel image behind the sleeve-model chain to a 2001 art-department image. This documents the album's conceptual architecture, not a direct source for this video's shots.",
        scope: "Album context only",
      },
      {
        referenceId: "culture-apollo",
        note: "Apollo / Tranquility Base iconography is a documented source for the album title and lunar setting.",
        scope: "Album context only",
      },
    ],
    segments: [
      { start: 0, end: 19.2, cuts: 6, palette: "#030806", brightness: 20, saturation: 208 },
      { start: 19.2, end: 38.5, cuts: 6, palette: "#131e29", brightness: 46, saturation: 130 },
      { start: 38.5, end: 57.7, cuts: 7, palette: "#0f090d", brightness: 30, saturation: 195 },
      { start: 57.7, end: 76.9, cuts: 3, palette: "#06061a", brightness: 36, saturation: 192 },
      { start: 76.9, end: 96.2, cuts: 7, palette: "#040812", brightness: 23, saturation: 205 },
      { start: 96.2, end: 115.4, cuts: 7, palette: "#020710", brightness: 18, saturation: 207 },
      { start: 115.4, end: 134.6, cuts: 6, palette: "#04081c", brightness: 18, saturation: 228 },
      { start: 134.6, end: 153.9, cuts: 8, palette: "#424041", brightness: 70, saturation: 98 },
      { start: 153.9, end: 173.1, cuts: 7, palette: "#3f3c3a", brightness: 57, saturation: 102 },
      { start: 173.1, end: 192.3, cuts: 8, palette: "#28262f", brightness: 57, saturation: 110 },
      { start: 192.3, end: 211.6, cuts: 6, palette: "#070812", brightness: 27, saturation: 180 },
      { start: 211.6, end: 230.8, cuts: 7, palette: "#060b0e", brightness: 39, saturation: 183 },
    ],
  },
  {
    id: "warp-speed-chic",
    title: "Warp Speed Chic",
    format: "Full film",
    duration: 713.086,
    shotCount: 109,
    sourceNote: "Shot boundaries and colour measures were calculated from the official full film.",
    dossier: [
      {
        timecode: "00:00–04:57",
        observation: "The film moves between intimate recording-room images, drums, keyboards, and dimly lit hotel-like interiors.",
        formalNote: "The camera treats performance space as an environment of equipment and furniture, not simply a neutral place to document a band.",
      },
      {
        timecode: "04:57–07:56",
        observation: "Longer passages interrupt the earlier sequence of shorter shots; the analysis detects notably fewer boundaries around the five-minute mark.",
        formalNote: "That reduction creates a pause in cutting rhythm without establishing a single fixed interpretation of the pause.",
      },
      {
        timecode: "07:56–11:53",
        observation: "Performance images are repeatedly filtered through red, blue, and film-strip-like textures.",
        formalNote: "The images fold a recording/performance document into an explicitly mediated visual object.",
      },
    ],
    contextLinks: [
      {
        referenceId: "film-le-samourai",
        note: "Turner named Melville's cinema and François de Roubaix's score as important to the record's creation. This is sonic and album context, not evidence that the film's visual style sources this full film.",
        scope: "Album context only",
      },
      {
        referenceId: "culture-pet-sounds",
        note: "Contemporary reporting links studio-session imagery to TBHC's live-ensemble recording approach; it offers production context for the film's recording-room material.",
        scope: "Album context only",
      },
    ],
    segments: [
      { start: 0, end: 59.4, cuts: 12, palette: "#2c2224", brightness: 51, saturation: 90 },
      { start: 59.4, end: 118.8, cuts: 13, palette: "#1b0d0d", brightness: 36, saturation: 135 },
      { start: 118.8, end: 178.3, cuts: 5, palette: "#271b1e", brightness: 42, saturation: 112 },
      { start: 178.3, end: 237.7, cuts: 6, palette: "#230b0a", brightness: 41, saturation: 149 },
      { start: 237.7, end: 297.1, cuts: 17, palette: "#1a0f10", brightness: 31, saturation: 133 },
      { start: 297.1, end: 356.5, cuts: 2, palette: "#0e0e10", brightness: 41, saturation: 101 },
      { start: 356.5, end: 416, cuts: 6, palette: "#080809", brightness: 28, saturation: 161 },
      { start: 416, end: 475.4, cuts: 13, palette: "#1c1416", brightness: 47, saturation: 100 },
      { start: 475.4, end: 534.8, cuts: 11, palette: "#2b1919", brightness: 50, saturation: 110 },
      { start: 534.8, end: 594.2, cuts: 13, palette: "#4b372a", brightness: 69, saturation: 140 },
      { start: 594.2, end: 653.7, cuts: 15, palette: "#191a1b", brightness: 51, saturation: 102 },
      { start: 653.7, end: 713.1, cuts: 7, palette: "#2e2614", brightness: 51, saturation: 70 },
    ],
  },
];
