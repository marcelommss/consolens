const keywords: Record<string, string> = {
  authentication: '🛡️',
  authenticate: '👤🔐',
  batteryempty: '🔌',
  notification: '🔔',
  batteryfull: '🔋',
  changedate: '📅',
  volumedown: '🔉',
  volumemute: '🔇',
  attention: '❗',
  chocolate: '🍫',
  financial: '💵',
  fulfilled: '✔️',
  loaditems: '⏳',
  phonebook: '📖',
  vegetable: '🥕',
  bookmark: '🔖',
  building: '🏢',
  calendar: '📅',
  calculat: '🧮',
  complete: '✅',
  computer: '💻',
  critical: '🛑',
  database: '🗄️',
  download: '⬇️',
  elephant: '🐘',
  envelope: '✉️',
  favorite: '⭐',
  location: '📌',
  moneybag: '💰',
  pickdate: '📅',
  previous: '◀️',
  register: '📝',
  registry: '📚',
  rendered: '📘',
  rejected: '⚠️',
  sandwich: '🥪',
  schedule: '📅',
  sendmail: '📤',
  settings: '⚙️',
  starfish: '🌟',
  umbrella: '☂️',
  volumeup: '🔊',
  wireless: '📡',
  balloon: '🎈',
  checked: '✅',
  clipped: '🔗',
  confirm: '✅',
  connect: '📡',
  decline: '📉',
  failure: '❌',
  forward: '➡️',
  getbyid: '🆔',
  loading: '⏳',
  running: '🏁',
  traffic: '🚦',
  animal: '🐾',
  bottle: '🍾',
  bridge: '🌉',
  budget: '🏦',
  camera: '📷',
  cheese: '🧀',
  coffee: '☕',
  create: '➕',
  delete: '➖',
  enable: '🟢',
  engine: '⚙️',
  finish: '🏁',
  flower: '🌸',
  folder: '📁',
  garden: '🌻',
  growth: '📈',
  guitar: '🎸',
  launch: '🚀',
  loaded: '✅⌛',
  mirror: '🪞',
  moveon: '🔛',
  online: '🔛',
  pencil: '✏️',
  pinned: '📌',
  profit: '📈',
  record: '🖊️',
  reload: '🔄',
  remove: '➖',
  rewind: '⏪',
  rocket: '🚀',
  routes: '🗺️',
  school: '🏫',
  search: '🔍',
  select: '🔘',
  signal: '📶',
  stairs: '🪜',
  ticket: '🎟️',
  unlock: '🔓',
  upload: '⬆️',
  violin: '🎻',
  window: '🪟',
  apple: '🍎',
  beach: '🏖️',
  chair: '🪑',
  chart: '📊',
  check: '✔️',
  clear: '🧹',
  cloud: '☁️',
  color: '🖌️',
  crash: '🔥',
  cross: '❌',
  dress: '👗',
  erase: '🗑️',
  fetch: '📦',
  fruit: '🍇',
  glass: '🍷',
  glove: '🧤',
  heart: '❤️',
  horse: '🐎',
  house: '🏠',
  knife: '🔪',
  lemon: '🍋',
  light: '🔆',
  minus: '➖',
  money: '💵',
  mouse: '🐭',
  movie: '🎬',
  music: '🎶',
  ocean: '🌊',
  order: '📦',
  paint: '🎨',
  paper: '📄',
  pause: '⏸️',
  phone: '📞',
  pizza: '🍕',
  plant: '🪴',
  plate: '🍽️',
  robot: '🤖',
  snake: '🐍',
  start: '🚀',
  stone: '🪨',
  table: '🛋️',
  theme: '🎨',
  towel: '🧻',
  trash: '🗑️',
  water: '💧',
  zebra: '🦓',
  auth: '🔏',
  baby: '👶',
  back: '◀️',
  bank: '🏦',
  bill: '💵',
  bird: '🐦',
  door: '🚪',
  face: '🙂',
  fish: '🐟',
  gift: '🎁',
  hair: '💇',
  home: '🏠',
  info: 'ℹ️',
  lamp: '💡',
  leaf: '🍃',
  lion: '🦁',
  lock: '🔒',
  mask: '🎭',
  meat: '🍖',
  milk: '🥛',
  moon: '🌙',
  nail: '💅',
  next: '➡️',
  play: '▶️',
  plus: '➕',
  qlik: '🌐',
  race: '🏁',
  ring: '💍',
  rose: '🌹',
  ship: '🚢',
  shoe: '👟',
  snow: '❄️',
  star: '⭐',
  stop: '🛑',
  tree: '🌳',
  user: '👤',
  wall: '🧱',
  wifi: '📶',
  wine: '🍷',
  wolf: '🐺',
  wood: '🪵',
  add: '➕',
  bed: '🛏️',
  bus: '🚌',
  car: '🚗',
  dog: '🐕',
  egg: '🥚',
  hat: '👒',
  ice: '🧊',
  key: '🔑',
  map: '🗺️',
  mug: '☕',
  sun: '☀️',
  tea: '🍵',
  zoo: '🦁',
};

/**
 * Combined mapping of both action result and context keywords.
 */
// const allKeywords = {
//   ...actionResultKeywords,
//   ...contextKeywords,
// };

/**
 * Enum for types of keyword mappings.
 */
export enum KEYWORD_TYPES {
  ALL = 'all',
  ACTION_RESULTS = 'actionResults',
  CONTEXT = 'context',
}

/**
 * Props interface for findSymbol function.
 */
interface FindSymbolProps {
  type?: KEYWORD_TYPES;
  args: (string | undefined)[];
}

/**
 * Finds the corresponding symbol based on the provided keywords.
 *
 * @param {FindSymbolProps} - Object containing the type of keywords to search and the arguments.
 * @returns {string | undefined} - Returns the corresponding symbol or undefined if no match is found.
 */
export const findSymbol = ({
  type = KEYWORD_TYPES.ALL,
  args,
}: FindSymbolProps): string | undefined => {
  let symbol: string | undefined;
  let keywordMappings = keywords;

  switch (type) {
    case KEYWORD_TYPES.ACTION_RESULTS:
      keywordMappings = keywords;
      break;
    case KEYWORD_TYPES.CONTEXT:
      keywordMappings = keywords;
      break;
    default:
      break;
  }

  // Iterate through all args to find the first matching keyword
  for (const arg of args) {
    if (arg && typeof arg === 'string') {
      const lowerCaseArg = arg.toLowerCase();
      for (const keyword in keywordMappings) {
        if (lowerCaseArg.includes(keyword)) {
          symbol = keywordMappings[keyword];
          return symbol; // Return on first match
        }
      }
    }
  }

  return symbol; // Return undefined if no match found
};
