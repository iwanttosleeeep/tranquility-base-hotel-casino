export interface RoomServiceCourses {
  appetizer: string;
  mainCourse: string;
  dessert: string;
  cocktail: { name: string; build: string };
  wine: string;
  chefsNote: string;
}

export interface RoomServiceBill {
  items: { label: string; credits: number }[];
  service: number;
  total: number;
  settlement: string;
}

export interface RoomServiceOrder {
  id: string;
  ordered_at: string;
  courses: RoomServiceCourses;
  bill: RoomServiceBill;
  kept: boolean;
}

const APPETIZER_TREATMENTS = [
  "Chilled", "Blistered", "Cured", "Smoked", "Pressed", "Vacuum-set", "Ash-rolled", "Candied", "Brined", "Torched",
  "Shaved", "Pickled", "Whipped", "Lacquered", "Salt-baked", "Steamed", "Foamed", "Dusted", "Charred", "Set",
];

const APPETIZER_INGREDIENTS = [
  "oyster mushroom", "glasshouse tomato", "hydroponic endive", "tinned sardine", "sea urchin", "artichoke heart", "quail egg", "green almond",
  "cucumber ribbon", "smoked trout", "chicory", "buffalo curd", "white asparagus", "salsify", "langoustine", "low-gravity beetroot",
  "cured egg yolk", "celeriac", "dune samphire", "bone marrow",
];

const APPETIZER_ACCENTS = [
  "cold-pressed vermouth", "burnt honey", "dill ash", "lunar salt", "pickled marigold", "chrome vinegar", "black butter", "tarragon smoke",
  "preserved lemon", "juniper dust", "fermented pepper", "oyster cream", "saffron oil", "charred leek", "green peppercorn", "smoked yoghurt",
  "sesame caramel", "malt vinegar mist", "cucumber ice", "cold ash",
];

const MAIN_PREPARATIONS = [
  "Slow-braised", "Sous-vide", "Spit-roasted", "Charcoal-grilled", "Salt-crusted", "Butter-poached", "Twice-cooked", "Hay-smoked",
  "Clay-baked", "Pan-seared", "Confit", "Ember-roasted", "Steam-pressed", "Wine-braised", "Flame-licked",
];

const MAIN_BASES = [
  "guinea fowl", "short rib", "monkfish tail", "hen of the woods", "veal sweetbread", "turbot", "lamb saddle", "black cod", "pigeon breast",
  "oxtail", "rabbit loin", "cauliflower steak", "duck leg", "brill", "marrow bone",
];

const MAIN_FINISHES = [
  "on a bed of vacuum-dried leek", "in a chartreuse of fennel", "over burnt-orange jus", "in a pool of green peppercorn cream",
  "with a lattice of chrome-fried potato", "under a veil of smoked butter", "in a reduction of dark cherry and bay", "over charred barley",
  "with caviar-black lentils", "in a broth of roasted bone and star anise", "beneath a crust of rye and marrow", "on hydroponic watercress",
  "in a sauce of vermouth and shallot", "over saffron pearl barley", "with a quenelle of horseradish snow",
];

const DESSERT_FORMS = [
  "Soufflé", "Parfait", "Mille-feuille", "Semifreddo", "Tart", "Sorbet", "Bavarois", "Crème", "Roulade", "Terrine", "Baba", "Pavlova",
  "Ganache", "Clafoutis", "Trifle",
];

const DESSERT_FLAVOURS = [
  "burnt honey", "blood orange", "black fig", "tonka", "sour cherry", "bitter almond", "smoked chocolate", "quince", "damson", "buckwheat",
  "olive oil and lemon", "salted caramel", "rhubarb", "elderflower", "malted milk",
];

const DESSERT_ACCENTS = [
  "with a spoon of crème fraîche", "under spun sugar", "with candied violet", "in a dust of dark cocoa", "with chilled marsala",
  "under a lid of burnt meringue", "with pistachio praline", "in a slick of olive oil", "with pink peppercorn", "under gold leaf",
  "with a shard of caramel glass", "with sour cream ice", "in a pool of cold espresso", "with preserved apricot", "under toasted oats",
];

const COCKTAIL_FIRST = [
  "Low-Gravity", "Chrome", "Velvet", "Midnight", "Lunar", "Static", "Neon", "Cold", "Brass", "Slow", "Silent", "Amber", "Hollow", "Electric", "Marble",
];
const COCKTAIL_SECOND = [
  "Martini", "Negroni", "Sour", "Sling", "Fizz", "Highball", "Old Fashioned", "Spritz", "Flip", "Julep", "Rickey", "Daiquiri", "Sazerac", "Collins", "Boulevardier",
];
const COCKTAIL_SPIRITS = ["London dry gin", "aged rum", "rye whiskey", "blanco tequila", "cognac", "mezcal", "vodka", "genever", "pisco", "Islay scotch"];
const COCKTAIL_MODIFIERS = [
  "dry vermouth", "Cocchi Americano", "green chartreuse", "amontillado sherry", "crème de cacao", "maraschino", "Campari", "apricot liqueur",
  "Bénédictine", "orange curaçao",
];
const COCKTAIL_FINISHES = [
  "orange bitters", "celery bitters", "a strip of grapefruit", "an absinthe rinse", "a saline drop", "burnt rosemary", "olive brine",
  "cardamom tincture", "lemon oil", "smoked ice",
];

const WINE_HOUSES = ["Domaine", "Château", "Estate", "Cellars", "Vineyard", "Bodega", "Weingut"];
const WINE_CRATERS = ["Clavius", "Copernicus", "Tycho", "Serenitatis", "Aristarchus", "Grimaldi", "Plato", "Hipparchus", "Endymion", "Fracastorius"];
const WINE_VARIETALS = ["Riesling", "Nebbiolo", "Chenin Blanc", "Gamay", "Mourvèdre", "Assyrtiko", "Trousseau", "Pinot Meunier", "Savagnin", "Cinsault"];
const WINE_VINTAGES = [
  "a warm year", "a thin year", "a long harvest", "the year the lifts were replaced", "a vintage the cellar disputes",
  "bottled before the refurbishment", "the last of the case",
];

const CHEFS_NOTES = [
  "The kitchen regrets that the {ingredient} was not landed this week and has taken a liberty.",
  "Chef asks that the {course} be eaten before the {otherCourse} arrives, not after.",
  "This was assembled at an hour the kitchen would rather not record.",
  "The {course} is served at the temperature of the corridor outside.",
  "Chef has made this for one guest before and does not remember which.",
  "The wine list is longer than the menu and the cellar is not lit.",
  "The {course} may be sent back. It will return unchanged.",
  "Nothing on this card is available in the Ballroom.",
  "Chef notes that the {ingredient} came up with the last delivery and will not come again.",
  "Please do not ask what is in the {course}. It is written down elsewhere.",
  "The kitchen closes when the last lift stops, whichever is later.",
  "Compliments of the house, which is to say: added to the room.",
];

const SETTLEMENTS = [
  (room: string) => `Charged to Suite ${room}`,
  () => "Added to the room",
  () => "Settled at check-out, if ever",
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function credits(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chefsNote(): string {
  const courses = ["appetizer", "main course", "dessert", "cocktail", "wine"];
  const course = pick(courses);
  const otherCourse = pick(courses.filter((item) => item !== course));
  return pick(CHEFS_NOTES)
    .replaceAll("{ingredient}", pick(APPETIZER_INGREDIENTS))
    .replaceAll("{course}", course)
    .replaceAll("{otherCourse}", otherCourse);
}

export function generateRoomServiceOrder(room: string): { courses: RoomServiceCourses; bill: RoomServiceBill } {
  const courses: RoomServiceCourses = {
    appetizer: `${pick(APPETIZER_TREATMENTS)} ${pick(APPETIZER_INGREDIENTS)} with ${pick(APPETIZER_ACCENTS)}`,
    mainCourse: `${pick(MAIN_PREPARATIONS)} ${pick(MAIN_BASES)}, ${pick(MAIN_FINISHES)}`,
    dessert: `${pick(DESSERT_FORMS)} of ${pick(DESSERT_FLAVOURS)}, ${pick(DESSERT_ACCENTS)}`,
    cocktail: {
      name: `The ${pick(COCKTAIL_FIRST)} ${pick(COCKTAIL_SECOND)}`,
      build: `${pick(COCKTAIL_SPIRITS)}, ${pick(COCKTAIL_MODIFIERS)}, ${pick(COCKTAIL_FINISHES)}`,
    },
    wine: `${pick(WINE_HOUSES)} ${pick(WINE_CRATERS)} ${pick(WINE_VARIETALS)}, ${pick(WINE_VINTAGES)}`,
    chefsNote: chefsNote(),
  };

  const items = [
    { label: "Appetizer", credits: credits(18, 34) },
    { label: "Main course", credits: credits(46, 88) },
    { label: "Dessert", credits: credits(16, 30) },
    { label: "Cocktail", credits: credits(22, 38) },
    { label: "Wine · glass", credits: credits(26, 60) },
  ];
  const subtotal = items.reduce((sum, item) => sum + item.credits, 0);
  const service = Math.round(subtotal * 0.125 * 100) / 100;

  return {
    courses,
    bill: {
      items,
      service,
      total: subtotal + service,
      settlement: pick(SETTLEMENTS)(room),
    },
  };
}
