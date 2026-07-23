export interface LiveArchiveShow {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  type: string;
  setLength: number;
  evidenceGrade: string;
  flags: string[];
  note: string;
  sourceUrl: string;
  corroborationUrl?: string;
  setlist: { title: string; note?: string; encore?: boolean }[];
}

export interface LiveSongStatistic {
  title: string;
  performances: number;
  rarity: "Regular" | "Rotation" | "Not performed";
  firstDate?: string;
  lastDate?: string;
  note?: string;
}

// Curated milestones transcribed from the supplied live archive. Full ordered
// setlists are reproduced as structured metadata, not lyrics or recordings.
export const LIVE_ARCHIVE_SHOWS: LiveArchiveShow[] = [
  {
    id: "TBHC-LIVE-2018-001", date: "2018-05-02", venue: "The Observatory North Park", city: "San Diego", country: "United States", type: "Headline tour concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Five live debuts", "Cameron Avery guest", "Unusual opener"],
    note: "First show since 2014. Star Treatment, Tranquility Base Hotel + Casino and Fireside were soundchecked but not played.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/the-observatory-north-park-san-diego-ca-3ec6563.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [
      { title: "The View From the Afternoon" }, { title: "Brianstorm" }, { title: "Crying Lightning" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "Do I Wanna Know?" }, { title: "Four Out of Five", note: "with Cameron Avery; live debut" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "505" }, { title: "Cornerstone" }, { title: "The Hellcat Spangled Shalalala", note: "new arrangement; first performance since 2013" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "One Point Perspective", note: "live debut" }, { title: "American Sports", note: "live debut" }, { title: "Arabella" }, { title: "Snap Out of It" }, { title: "You're So Dark", note: "live debut" }, { title: "One for the Road" }, { title: "She Looks Like Fun", note: "with Cameron Avery; live debut", encore: true }, { title: "Knee Socks", encore: true }, { title: "R U Mine?", encore: true }
    ]
  },
  {
    id: "TBHC-LIVE-2018-002", date: "2018-05-03", venue: "The Observatory North Park", city: "San Diego", country: "United States", type: "Headline tour concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Title track live debut", "Four Out of Five opener"], note: "Suck It and See was soundchecked but not played.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/the-observatory-north-park-san-diego-ca-3bec5c50.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [
      { title: "Four Out of Five", note: "first time as show opener" }, { title: "Arabella" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "The View From the Afternoon" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "505" }, { title: "The Hellcat Spangled Shalalala", note: "different arrangement" }, { title: "She Looks Like Fun" }, { title: "Crying Lightning" }, { title: "Do I Wanna Know?" }, { title: "Brianstorm" }, { title: "Pretty Visitors" }, { title: "Tranquility Base Hotel + Casino", note: "live debut" }, { title: "Fireside" }, { title: "Knee Socks" }, { title: "Cornerstone" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "One Point Perspective", encore: true }, { title: "One for the Road", encore: true }, { title: "R U Mine?", encore: true }
    ]
  },
  {
    id: "TBHC-LIVE-2018-011", date: "2018-05-29", venue: "Le Zénith", city: "Paris", country: "France", type: "Headline tour concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Batphone live debut"], note: "Teddy Picker and From the Ritz to the Rubble were soundchecked but not played.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/le-zenith-paris-france-13ed05c9.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five" }, { title: "Brianstorm" }, { title: "Crying Lightning" }, { title: "Do I Wanna Know?" }, { title: "She Looks Like Fun" }, { title: "Do Me a Favour", note: "tour debut" }, { title: "Cornerstone" }, { title: "Batphone", note: "live debut" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "Fireside" }, { title: "Knee Socks" }, { title: "Tranquility Base Hotel + Casino" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "Pretty Visitors" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "One Point Perspective" }, { title: "505" }, { title: "The View From the Afternoon", encore: true }, { title: "Arabella", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2018-015", date: "2018-06-06", venue: "Maida Vale Studios", city: "London", country: "United Kingdom", type: "BBC radio session", setLength: 11, evidenceGrade: "A/B",
    flags: ["Star Treatment live debut", "Order uncertain"], note: "Recorded for a 7 June BBC Radio 1 broadcast. The exact performance order is uncertain; Golden Trunks appears only as an instrumental snippet within Star Treatment.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/maida-vale-studios-london-england-7beab230.html", corroborationUrl: "https://archive.org/details/arctic-monkeys-2018.06.06-london-england-maida-vale",
    setlist: [{ title: "Four Out of Five" }, { title: "Tranquility Base Hotel + Casino" }, { title: "Do I Wanna Know?" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "One Point Perspective" }, { title: "American Sports" }, { title: "Cornerstone" }, { title: "505" }, { title: "R U Mine?" }, { title: "Star Treatment", note: "live debut; Golden Trunks instrumental snippet" }]
  },
  {
    id: "TBHC-LIVE-2018-016", date: "2018-06-07", venue: "Royal Albert Hall", city: "London", country: "United Kingdom", type: "War Child benefit concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Official live release", "Cameron Avery guest"], note: "First UK gig since August 2014. Released as Live at the Royal Albert Hall on 4 December 2020.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/royal-albert-hall-london-england-63ed46ef.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five", note: "with Cameron Avery" }, { title: "Brianstorm" }, { title: "Crying Lightning" }, { title: "Do I Wanna Know?" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "505" }, { title: "One Point Perspective" }, { title: "Do Me a Favour" }, { title: "Cornerstone" }, { title: "Knee Socks", note: "extended intro" }, { title: "Arabella" }, { title: "Tranquility Base Hotel + Casino", note: "with Cameron Avery" }, { title: "She Looks Like Fun", note: "with Cameron Avery" }, { title: "From the Ritz to the Rubble", note: "first live performance since 2011" }, { title: "Pretty Visitors" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Star Treatment", encore: true }, { title: "The View From the Afternoon", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2018-020", date: "2018-06-18", venue: "Ascend Amphitheater", city: "Nashville", country: "United States", type: "Headline tour concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["The Ultracheese live debut"], note: "Fireside featured a new solo arrangement.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/ascend-amphitheater-nashville-tn-53eaebb1.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five" }, { title: "Do I Wanna Know?" }, { title: "Brianstorm" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "Crying Lightning" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "505" }, { title: "Batphone" }, { title: "Do Me a Favour" }, { title: "Cornerstone" }, { title: "The Ultracheese", note: "live debut" }, { title: "Knee Socks" }, { title: "Arabella" }, { title: "One Point Perspective" }, { title: "Fireside", note: "new solo" }, { title: "Pretty Visitors" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Star Treatment", encore: true }, { title: "The View From the Afternoon", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2018-031", date: "2018-07-10", venue: "Théâtre Antique de Fourvière", city: "Lyon", country: "France", type: "Festival performance", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Lipstick Vogue cover"], note: "The online broadcast cut Lipstick Vogue. Prerecorded walk-on music is excluded from the performed-song count.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/theatre-antique-de-fourviere-lyon-france-23ea448f.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five" }, { title: "Brianstorm" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "Crying Lightning" }, { title: "The View From the Afternoon" }, { title: "Teddy Picker" }, { title: "505" }, { title: "The Ultracheese" }, { title: "Do Me a Favour" }, { title: "Cornerstone" }, { title: "Lipstick Vogue", note: "Elvis Costello & The Attractions cover" }, { title: "Knee Socks" }, { title: "One Point Perspective", note: "extended intro" }, { title: "Do I Wanna Know?" }, { title: "She Looks Like Fun" }, { title: "Pretty Visitors" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Star Treatment", encore: true }, { title: "Arabella", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2018-035", date: "2018-07-24", venue: "Forest Hills Stadium", city: "Queens", country: "United States", type: "Headline tour concert", setLength: 20, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Is This It cover"], note: "A one-off performance of The Strokes' Is This It in the encore.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/forest-hills-stadium-queens-ny-33ebc8a9.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five" }, { title: "Brianstorm" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "Crying Lightning" }, { title: "Teddy Picker" }, { title: "505" }, { title: "Tranquility Base Hotel + Casino" }, { title: "One Point Perspective" }, { title: "Do Me a Favour" }, { title: "Cornerstone" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "The Ultracheese" }, { title: "Do I Wanna Know?" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Knee Socks" }, { title: "Pretty Visitors" }, { title: "Arabella" }, { title: "Star Treatment", encore: true }, { title: "Is This It", note: "The Strokes cover", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2018-050", date: "2018-09-07", venue: "Manchester Arena", city: "Manchester", country: "United Kingdom", type: "Headline tour concert", setLength: 22, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Science Fiction live debut", "Drawbridge"], note: "Drawbridge appears under the working name The Jam of Boston in the recovered setlist.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2018/manchester-arena-manchester-england-6be84e5a.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Four Out of Five" }, { title: "Brianstorm" }, { title: "Snap Out of It" }, { title: "Crying Lightning" }, { title: "The View From the Afternoon" }, { title: "505" }, { title: "Drawbridge", note: "as The Jam of Boston" }, { title: "Tranquility Base Hotel + Casino" }, { title: "Do Me a Favour" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "From the Ritz to the Rubble" }, { title: "One Point Perspective" }, { title: "Cornerstone" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "Knee Socks" }, { title: "Science Fiction", note: "live debut" }, { title: "Do I Wanna Know?" }, { title: "Pretty Visitors" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Star Treatment", encore: true }, { title: "Arabella", encore: true }, { title: "R U Mine?", encore: true }]
  },
  {
    id: "TBHC-LIVE-2019-016", date: "2019-04-07", venue: "Centro de Eventos Briceño 18", city: "Briceño", country: "Colombia", type: "Festival performance", setLength: 22, evidenceGrade: "A (date/venue) + C (setlist)",
    flags: ["Final era show"], note: "Final documented TBHC-era show. The official site markets the festival under Bogotá; venue evidence places it at Briceño, Colombia.",
    sourceUrl: "https://www.setlist.fm/setlist/arctic-monkeys/2019/centro-de-eventos-briceno-18-briceno-colombia-4b93df36.html", corroborationUrl: "https://www.arcticmonkeys.com/",
    setlist: [{ title: "Do I Wanna Know?" }, { title: "Brianstorm" }, { title: "Snap Out of It" }, { title: "Don't Sit Down 'Cause I've Moved Your Chair" }, { title: "One Point Perspective" }, { title: "I Bet You Look Good on the Dancefloor" }, { title: "Library Pictures" }, { title: "Knee Socks" }, { title: "The Ultracheese" }, { title: "Teddy Picker" }, { title: "Dancing Shoes" }, { title: "Why'd You Only Call Me When You're High?" }, { title: "Cornerstone" }, { title: "505" }, { title: "Drawbridge" }, { title: "Tranquility Base Hotel + Casino" }, { title: "Crying Lightning" }, { title: "Pretty Visitors" }, { title: "Four Out of Five", note: "extended outro" }, { title: "Star Treatment", encore: true }, { title: "Arabella", encore: true }, { title: "R U Mine?", encore: true }]
  }
];

export const TBHC_LIVE_SONG_STATISTICS: LiveSongStatistic[] = [
  { title: "Four Out of Five", performances: 93, rarity: "Regular", firstDate: "2018-05-02", lastDate: "2019-04-07" },
  { title: "One Point Perspective", performances: 91, rarity: "Regular", firstDate: "2018-05-02", lastDate: "2019-04-07" },
  { title: "Tranquility Base Hotel + Casino", performances: 83, rarity: "Regular", firstDate: "2018-05-03", lastDate: "2019-04-07" },
  { title: "Star Treatment", performances: 79, rarity: "Regular", firstDate: "2018-06-06", lastDate: "2019-04-07" },
  { title: "She Looks Like Fun", performances: 29, rarity: "Rotation", firstDate: "2018-05-02", lastDate: "2019-02-23" },
  { title: "The Ultracheese", performances: 29, rarity: "Rotation", firstDate: "2018-06-18", lastDate: "2019-04-07" },
  { title: "American Sports", performances: 19, rarity: "Rotation", firstDate: "2018-05-02", lastDate: "2019-02-27" },
  { title: "Batphone", performances: 14, rarity: "Rotation", firstDate: "2018-05-29", lastDate: "2018-10-12" },
  { title: "Science Fiction", performances: 14, rarity: "Rotation", firstDate: "2018-09-07", lastDate: "2019-03-22" },
  { title: "Golden Trunks", performances: 0, rarity: "Not performed", note: "An instrumental snippet within Star Treatment at Maida Vale is not counted as a full performance." },
  { title: "The World's First Ever Monster Truck Front Flip", performances: 0, rarity: "Not performed", note: "No performance recovered in the archive." }
];
