/**
 * Mapping of action or result keywords to their corresponding icons.
 */
const actionResultKeywords: Record<string, string> = {
  connect: '📡',
  signal: '📶',
  wifi: '📶',
  wireless: '📡',
  search: '🔍',
  select: '🔘',
  next: '➡️',
  forward: '➡️',
  start: '🚀',
  launch: '🚀',
  back: '◀️',
  previous: '◀️',
  stop: '🛑',
  enable: '🟢',
  remove: '➖',
  delete: '➖',
  fetch: '📦',
  loaditems: '⏳',
  loading: '⏳',
  reload: '🔄',
  complete: '✅',
  confirm: '✅',
  loaded: '✅⌛',
  rendered: '📘',
  rejected: '⚠️',
  fulfilled: '✔️',
  lock: '🔒',
  unlock: '🔓',
  attention: '❗',
  add: '➕',
  create: '➕',
  crash: '🔥',
  dangerous: '🔥',
  critical: '🛑',
  failure: '❌',
  finish: '🏁',
  clear: '🧹',
  erase: '🗑️',
  database: '🗄️',
  clipped: '🔗',
  engine: '⚙️',
  settings: '⚙️',
  checked: '✅',
  color: '🖌️',
};

/**
 * Mapping of context keywords to their corresponding icons.
 */
const contextKeywords: Record<string, string> = {
  sendmail: '📤',
  financial: '💵',
  bill: '💵',
  money: '💵',
  growth: '📈',
  profit: '📈',
  budget: '🏦',
  bank: '🏦',
  decline: '📉',
  loss: '📉',
  payment: '💳',
  calculat: '🧮',
  favorite: '⭐',
  star: '⭐',
  bookmark: '🔖',
  pinned: '📌',
  location: '📌',
  dashboard: '📊',
  chart: '📊',
  home: '🏠',
  house: '🏠',
  pickdate: '📅',
  setdate: '📅',
  changedate: '📅',
  calendar: '📅',
  schedule: '📅',
  order: '📦',
  race: '🏁',
  runnning: '🏁',
  movie: '🎬',
  record: '🖊️',
  register: '📝',
  registry: '📚',
  authentication: '🛡️',
  authenticate: '👤🔐',
  auth: '🔏',
  token: '🎟️',
  getbyid: '🆔',
  online: '🔛',
  moveon: '🔛',
  routes: '🗺️',
  traffic: '🚦',
  theme: '🎨',
  paint: '🎨',
  qlik: '🌐',
};

/**
 * Combined mapping of both action result and context keywords.
 */
const allKeywords = {
  ...actionResultKeywords,
  ...contextKeywords,
};

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
  let keywordMappings = allKeywords;

  switch (type) {
    case KEYWORD_TYPES.ACTION_RESULTS:
      keywordMappings = actionResultKeywords;
      break;
    case KEYWORD_TYPES.CONTEXT:
      keywordMappings = contextKeywords;
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
