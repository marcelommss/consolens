import {
  CLOCK_TYPE,
  GROUP_BEHAVIOUR,
  LOG_TYPE,
  LogMessage,
  LogParams,
} from '../types/index';
import { getTagColor } from '../services/tags';
import {
  getLoggingConfiguration,
  initializeTags,
} from '../services/configurations';
import {
  addMessage,
  getAllMessages,
  getGroupMessages,
} from '../services/groups';
import { findSymbol, KEYWORD_TYPES } from './icons.helper';
import { findDataFromTrace, getCallingFile } from './files.helper';

/**
 * Creates a formatted message string for the log based on the parameters and adds a symbol if needed.
 * @param {string} source - The source file or component emitting the log
 * @param {string} functionName - The name of the function that generated the log
 * @param {boolean} isEffect - Whether this log is related to a side effect
 * @param {boolean} [hasMessageColor] - Check if has message color
 * @param {string} description - A description of the log message
 * @param {number} [line] - The line number where the log occurred
 * @param {string} [symbol] - Optional symbol to display (e.g., 🛈, ⚠️, ❌)
 * @param {string} [context] - The context of this message
 * @param {string[]} [tags] - Tags for this message
 * @param {boolean} [hasArgs] - Check if has args
 * @param {CLOCK_TYPE} [datetimeDisplayType] - Display type for datetime
 * @returns {string} - The formatted log message
 */
const createMessage = ({
  source,
  functionName,
  isEffect,
  hasMessageColor,
  description,
  line,
  symbol = '',
  context,
  tags,
  hasArgs,
  datetimeDisplayType = CLOCK_TYPE.DATETIME,
}: {
  source?: string;
  functionName?: string;
  isEffect?: boolean;
  hasMessageColor?: boolean;
  description?: string;
  line?: number;
  symbol?: string;
  context?: string;
  tags?: string[];
  hasArgs?: boolean;
  datetimeDisplayType?: CLOCK_TYPE;
}) => {
  if (symbol === '') symbol = '🕒';

  let displayDT = '';
  switch (datetimeDisplayType) {
    case CLOCK_TYPE.DATETIME:
      displayDT = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      break;
    case CLOCK_TYPE.DATE:
      displayDT = `${new Date().toLocaleDateString()}`;
      break;
    case CLOCK_TYPE.TIME:
      displayDT = `${new Date().toLocaleTimeString()}`;
      break;
    default:
      break;
  }

  let data = `%c${displayDT} ${symbol}%c`;

  if (context) data += `%c« ${context} »`;

  if (source) data += `%c /${source}`;

  if (line !== undefined) data += `:%c${line}`;

  // if (symbol) data += `%c${symbol}`;

  if (functionName) data += `%cfunction: %c${functionName}`;

  if (isEffect) data += `%c⚡effect`;

  if (tags && tags.length > 0) {
    tags.forEach((tag) => (data += `%c${tag}`));
    data += `%c`;
  }

  if (description) {
    data += `${
      context ||
      source ||
      line ||
      functionName ||
      isEffect ||
      (tags && tags?.length > 0)
        ? '\n'
        : ''
    }\t%cmessage:  ${hasMessageColor ? '%c%c' : '%c'}${description}`;
  }

  if (hasArgs) data += `%c\n\t\t   args:%c  `;

  return data;
};

/**
 * Creates the styles array based on the log type and parameters.
 * Handles styling for the description, symbols, and other log properties.
 *
 * @param {string} baseColor - The base color for the log type (e.g., red for errors, orange for warnings)
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {string} [source] - The source file/component emitting the log
 * @param {string} [functionName] - The name of the function generating the log
 * @param {boolean} [isEffect] - Whether the log is related to a side effect
 * @param {string} [messageColor] - Color for the log message description
 * @param {number} [line] - The line number where the log occurred
 * @param {string} [description] - The description of the log message
 * @param {string} [symbol] - The symbol associated with the log message
 * @param {string} [context] - The context of this message
 * @param {string[]} [tags] - Tags for this message
 * @param {boolean} [hasArgs] - Check if has args
 * @returns {string[]} - The array of CSS styles to apply to the log message
 */
const createStyles = ({
  baseColor,
  source,
  functionName,
  isEffect,
  messageColor,
  line,
  description,
  context,
  tags,
  hasArgs,
}: {
  baseColor: string;
  type?: LOG_TYPE;
  source?: string;
  functionName?: string;
  isEffect?: boolean;
  messageColor?: string;
  line?: number;
  description?: string;
  symbol?: string;
  context?: string;
  tags?: string[];
  hasArgs?: boolean;
}) => {
  const styles: string[] = [
    `color: ${baseColor}; font-weight: bold; font-size: 12px; line-height: 2.2; background-color: #ffffff12; border-radius: 16px; padding: 0px 10px; margin-top:2px`,
    'border:none;',
  ];

  if (context)
    styles.push(
      'font-weight: 800; font-size: 11.5px; color: #000000DD; background-color: #d8c752; border-radius: 16px; padding: 4px 10px; margin-left: 12px; margin-top: -2px margin-bottom: 12px;'
    );

  if (source)
    styles.push(
      'font-weight: normal; color: #56e05e; padding: 0 0 0 10px; line-height: 2.4;'
    );

  if (line !== undefined) styles.push('font-weight: 600; color: #dfecf9;');

  // if (symbol)
  //   styles.push('font-weight: bold; color: #cfebfc;  padding: 0 15px;');

  if (functionName)
    styles.push(
      'padding: 0 0 0 18px; color: #FFFFFF55;',
      'padding: 0 15px 0 0; font-weight: bold; color:#63b9ed;'
    );

  if (isEffect)
    styles.push('font-weight: normal; color: #fe9901;  padding: 0 15px;');

  if (tags && tags.length > 0) {
    tags.forEach((tag) =>
      styles.push(
        `font-weight: 800; font-size: 11.5px; color:#000000DD; background-color: ${getTagColor(
          tag
        )}DD; border-radius: 16px; padding: 4px 10px; margin-left: 12px; margin-top: -2px margin-bottom: 12px;`
      )
    );
    styles.push('background: none; border-radius: none;');
  }

  // Apply styling for the description, if present
  if (description) {
    styles.push(
      'color: #FFFFFF55;',
      'opacity:1;font-weight: bold; padding: 5px 0;'
      // 'font-weight: bold; padding: 5px 0; border-bottom: solid 1px #FFFFFF44'
    );
    if (messageColor) {
      styles.push(`color: ${messageColor}; padding: 5px 0 6px 0;`); // Apply custom message color if provided
    }
  }

  if (hasArgs) {
    styles.push(`padding-top: 2px; padding-bottom: 6px; color: #FFFFFF55; `);
    styles.push(`padding-top: 2px; padding-bottom: 6px;`);
  }

  return styles;
};

/**
 * Prepares the log message, styles, and arguments for logging.
 * This function centralizes the logic for assembling the log's formatted message, styles, and arguments.
 * It handles the calling file, symbols, tags, and optional arguments, and ensures consistency across all log types.
 *
 * @param {LogParams} params - The logging parameters including source, function name, description, tags, etc.
 * @param {string} baseColor - The base color for the log style (used for different log types like INFO, WARNING, ERROR).
 * @param {boolean} [datetimeDisplayType=DATETIME] - Flag to determine which date and time type should be included in the log. Defaults to datetime.
 * @returns {{ data: string, styles: string[], args: any[] }} - Returns an object containing the formatted log message (`data`),
 *          the CSS styles to be applied to the log (`styles`), and the additional log arguments (`args`).
 *
 * @example
 * const { data, styles, args } = prepareLog({
 *   source: 'App.tsx',
 *   functionName: 'fetchData',
 *   description: 'Fetching data from API...',
 *   tags: ['api', 'fetch']
 * }, 'lightgray');
 *
 * console.info(data, ...styles, ...args);
 */
const prepareLog = (params: LogParams, baseColor: string) => {
  initializeTags();
  const config = getLoggingConfiguration();

  const callingFile: string | undefined =
    getCallingFile(params.source) ?? 'Unknown Source';

  const symbol =
    findSymbol({
      type: KEYWORD_TYPES.ALL,
      args: [params.functionName, callingFile, params.description],
    }) || '🕒';

  const hasArgs = params.args !== undefined && params.args?.length > 0;
  const data = createMessage({
    source: callingFile,
    functionName: params.functionName,
    isEffect: params.isEffect,
    hasMessageColor: !!params.messageColor,
    description: params.description,
    line: params.line,
    symbol,
    context: params.context,
    tags: params.tags,
    hasArgs,
    datetimeDisplayType: config.datetimeDisplayType,
  });

  const styles = createStyles({
    baseColor,
    source: callingFile,
    functionName: params.functionName,
    isEffect: params.isEffect,
    messageColor: params.messageColor,
    line: params.line,
    description: params.description,
    context: params.context,
    tags: params.tags,
    symbol,
    hasArgs,
  });

  return { data, styles, args: params.args };
};

/**
 * Logs an individual message to the console.
 * This function handles the actual logging for a given `LogMessage` object.
 *
 * @param {LogMessage} message - The log message object containing type, color, and other parameters.
 */
export const handleMessage = (message: LogMessage) => {
  const { data, styles, args } = prepareLog(
    message,
    message.color ?? 'lightgray'
  );
  // Ensure args is defined, or default to an empty array
  const safeArgs = args ?? [];

  // Log according to the log type and include args
  switch (message.type) {
    case LOG_TYPE.INFORMATION:
      console.info(data, ...styles, ...safeArgs);
      break;
    case LOG_TYPE.WARNING:
      console.warn(data, ...styles, ...safeArgs);
      break;
    case LOG_TYPE.ERROR:
      console.error(data, ...styles, ...safeArgs);
      break;
    default:
      console.info(data, ...styles, ...safeArgs); // Default to info
  }
};

/**
 * Handles logging for both individual and grouped messages.
 * If the message belongs to a group, it will be added to the group stack and not logged immediately.
 *
 * @param {LogMessage} message - The log message object containing type, color, group, and other parameters.
 */
export const handleLog = (message: LogMessage) => {
  initializeTags();

  // identify log information
  const traceInfo = findDataFromTrace();
  if (traceInfo.fileName && !message.source)
    message.source = traceInfo.fileName;
  if (traceInfo.lineNumber && !message.line)
    message.line = traceInfo.lineNumber;
  if (traceInfo.functionName && !message.functionName)
    message.functionName = traceInfo.functionName;

  const config = getLoggingConfiguration();
  // Check if the message is part of a group or parent group
  if (
    config.defaultGroupBehaviour !== GROUP_BEHAVIOUR.TRADITIONAL &&
    (message.group || message.parentGroup)
  ) {
    addMessage(message);
    // Do not log the message immediately; it will be handled when the group is logged
    return;
  }

  // Log individual message immediately
  return handleMessage(message);
};

/**
 * Logs all messages from a specific group.
 * Messages within the group are retrieved and logged sequentially.
 *
 * @param {string} [groupId] - The group identifier. If not provided, the first available group will be logged.
 */
export const handleGroup = (groupId?: string) => {
  const messages = getGroupMessages(groupId);
  messages.forEach((message) => handleMessage(message));
};

/**
 * Logs all messages from all groups.
 * This function retrieves and logs messages from every group in the logGroups stack.
 */
export const handleAllGroups = () => {
  const allMessages = getAllMessages();

  // Log each message sequentially
  allMessages.forEach((message) => handleMessage(message));
};
