export interface Song {
  id: string;
  title: string;
  releaseCategory?: "Album" | "B-side";
  officialLyricsUrl?: string;   // 新增：外链官方歌词渠道
  annotatedLines: {             // 替代整段 lyrics：只存被注释的行
    line: string;
    annotation: string;
    references?: string[];
    sourceUrl?: string;         // 注释若引用采访，附出处
  }[];
  filmReferences: string[];
  literaryReferences: string[];
  relatedEssays: string[];
}

export interface Interview {
  id: string;
  title: string;
  publication: string;
  date: string;
  interviewer?: string;
  sourceUrl: string;        // 新增，必填：原文链接，无链接不收录
  officialRecordingUrl?: string;
  transcript?: string;      // 改为可选：有授权/可引用时才填
  quotes: string[];         // 只收原文短引用
  topics: string[];
  connectedSongs: string[];
}

export interface Film {
  id: string;
  title: string;
  director: string;
  year: number;
  synopsis: string;
  whyItMatters: string;
  alexQuote?: string;
  visualMotifs: string[];
  connectedSongs: string[];
  sourceUrl?: string;           // 新增：外链出处
}

export interface CulturalReference {
  id: string;
  title: string;
  creator: string;
  year: string;
  category: "Film" | "Book" | "Television" | "Culture & Design";
  medium: string;
  evidenceGrade: "A" | "B" | "C";
  connection: string;
  evidence: string;
  confirmingSource: string;
  sourceUrl: string;
  topics: string[];
  connectedSongs: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: "Inspiration" | "Writing" | "Recording" | "Release" | "Tour" | "Retrospective";
  description: string;
  quote?: string;
  sourceUrl?: string;           // 新增：外链出处
}

export interface Essay {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  relatedSongs: string[];
}

export interface CriticalTheme {
  title: string;
  synthesis: string;            // 研究者综述，非创作者陈述
}

export interface CriticalClaim {
  id: string;
  claim: string;                // 只存转述，不存原文段落
  critic: string;
  outlet: string;
  date: string;
  tier: string[];               // D1 发展性解读 / D2 比较 / D3 编辑性提及
  theme: number;                // index into CRITICAL_THEMES
  aspects: string[];            // album-wide / persona / sound / hotel …
  sourceUrl: string;            // 必填：原文链接，无链接不收录
  access: "full" | "limited";   // limited = 原页面无法抓取，仅核对索引记录
}

export type HotelRoom = 
  | "LOBBY"
  | "RECEPTION"
  | "LOUNGE"
  | "CINEMA"
  | "COCKTAIL_BAR"
  | "OBSERVATORY"
  | "LIBRARY"
  | "BALLROOM"
  | "CASINO"
  | "ROOFTOP_GARDEN"
  | "ARCHIVE";
