import {
  CLOCK_TYPE,
  GROUP_BEHAVIOUR,
  LOG_TYPE,
  LogMessage,
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
import { getOriginalWarn, getOriginalError } from '../middleware';
import { MessageParams, MessageStyleParams } from '../types/logging';

/**
 * Creates a formatted message string for the log based on the parameters and adds a symbol if needed.
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
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
 * @param {boolean} [isError] - Check if is error
 * @param {boolean} [hasVerticalSpace] - Check if has vertical space before log
 * @param {CLOCK_TYPE} [datetimeDisplayType] - Display type for datetime
 * @returns {string} - The formatted log message
 */
const createMessage = ({
  config,
  type,
  source,
  functionName,
  isEffect,
  hasMessageColor,
  message,
  line,
  symbol = '',
  context,
  tags,
  hasArgs,
  isError,
  datetimeDisplayType = CLOCK_TYPE.DATETIME,
}: MessageParams) => {
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

  let data: string = '';
  let spacePoints: number = 0;
  // if (hasVerticalSpace) data += `%c  `;
  data = `%c${displayDT} ${symbol}%c`;

  if (context) {
    ++spacePoints;
    data += `%c« ${context} »`;
  }

  if (source) {
    ++spacePoints;
    data += `%c /${source}`;
    if (line !== undefined) data += `:%c${line}`;
  }

  // if (symbol) {
  //   ++spacePoints;
  //   data += `%c${symbol}`;
  // }

  if (functionName) {
    spacePoints += 1;
    data += `${config.displayTitles ? '%cfunction: ' : ''}%c${functionName}`;
  }

  if (isEffect) {
    ++spacePoints;
    data += `%c⚡effect`;
  }

  if (tags && tags.length > 0) {
    spacePoints += tags.length;
    tags.forEach((tag) => (data += `%c${tag}`));
    data += `%c`;
  }

  if (message) {
    if (spacePoints > 2)
      data += config.multiline || spacePoints > 4 ? '\n' : '';
    data += `\t${config.displayTitles ? '%cmessage:  ' : ''}${
      hasMessageColor ? '%c%c' : '%c'
    }${message}`;
  }

  if (hasArgs) {
    let customIdentifier = '';
    if (config.displayTitles) {
      customIdentifier = 'args:';
      if (isError) customIdentifier = '▼';
      if (type === LOG_TYPE.WARNING) customIdentifier = '▼ args:';
    }
    data += `%c\n\t\t   ${customIdentifier}%c  `;
  }

  return data;
};

/**
 * Creates the styles array based on the log type and parameters.
 * Handles styling for the message, symbols, and other log properties.
 *
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {string} baseColor - The base color for the log type (e.g., red for errors, orange for warnings)
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {string} [source] - The source file/component emitting the log
 * @param {string} [functionName] - The name of the function generating the log
 * @param {boolean} [isEffect] - Whether the log is related to a side effect
 * @param {string} [messageColor] - Color for the log message description
 * @param {number} [line] - The line number where the log occurred
 * @param {string} [message] - The log message
 * @param {string} [symbol] - The symbol associated with the log message
 * @param {string} [context] - The context of this message
 * @param {string[]} [tags] - Tags for this message
 * @param {boolean} [hasArgs] - Check if has args
 * @param {boolean} [hasVerticalSpace] - Check if has vertical space before log
 * @returns {string[]} - The array of CSS styles to apply to the log message
 */
const createStyles = ({
  config,
  baseColor,
  source,
  functionName,
  isEffect,
  messageColor,
  line,
  message,
  context,
  tags,
  hasArgs,
}: MessageStyleParams) => {
  const styles: string[] = [];
  // if (hasVerticalSpace) styles.push('padding-top: 21px;');

  styles.push(
    `color: ${baseColor}; font-weight: bold; font-size: 12px; line-height: 2.2; background-color: #ffffff12; border-radius: 16px; padding: 0px 10px; margin-top:2px`,
    'border:none;'
  );
  if (context)
    styles.push(
      'font-weight: 800; font-size: 11.5px; color: #000000DD; background-color: #d8c752; border-radius: 16px; padding: 4px 10px; margin-left: 12px; margin-top: -2px margin-bottom: 12px;'
    );

  if (source) {
    styles.push(
      'font-weight: normal; color: #56e05e; padding: 0 0 0 10px; line-height: 2.4;'
    );

    if (line !== undefined) styles.push('font-weight: 600; color: #dfecf9;');
  }

  // if (symbol)
  //   styles.push('font-weight: bold; color: #cfebfc;  padding: 0 15px;');

  if (functionName) {
    if (config.displayTitles)
      styles.push('padding: 0 0 0 18px; color: #FFFFFF55;');
    styles.push(
      `padding: 0 15px 0 ${
        config.displayTitles ? '0' : '18px'
      }; font-weight: bold; color:#63b9ed;`
    );
  }

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

  // Apply styling for the message, if present
  if (message) {
    if (config.displayTitles) styles.push('color: #FFFFFF55;');
    styles.push(
      'opacity:1;font-weight: bold; padding: 5px 0;'
      // 'font-weight: bold; padding: 5px 0; border-bottom: solid 1px #FFFFFF44'
    );
    if (messageColor) {
      styles.push(`color: ${messageColor}; padding: 5px 0 6px 0;`); // Apply custom message color if provided
    }
  }

  if (hasArgs) {
    if (config.displayTitles)
      styles.push(`padding-top: 2px; padding-bottom: 6px; color: #FFFFFF55; `);
    styles.push(`padding-top: 2px; padding-bottom: 6px;`);
  }

  return styles;
};

/**
 * Create the log.
 * This function centralizes the logic for assembling the log's formatted message, styles, and arguments.
 * It handles the calling file, symbols, tags, and optional arguments, and ensures consistency across all log types.
 *
 * @param {LogParams} params - The logging parameters including source, function name, message, tags, etc.
 * @param {string} baseColor - The base color for the log style (used for different log types like INFO, WARNING, ERROR).
 * @param {boolean} [datetimeDisplayType=DATETIME] - Flag to determine which date and time type should be included in the log. Defaults to datetime.
 * @returns {{ data: string, styles: string[], args: any[] }} - Returns an object containing the formatted log message (`data`),
 *          the CSS styles to be applied to the log (`styles`), and the additional log arguments (`args`).
 *
 * @example
 * const { data, styles, args } = prepareLog({
 *   source: 'App.tsx',
 *   functionName: 'fetchData',
 *   message: 'Fetching data from API...',
 *   tags: ['api', 'fetch']
 * }, 'lightgray');
 *
 * console.info(data, ...styles, ...args);
 */
const createLog = (logMessage: LogMessage, baseColor: string) => {
  initializeTags();
  const config = getLoggingConfiguration();

  const symbol =
    findSymbol({
      type: KEYWORD_TYPES.ALL,
      args: [logMessage.functionName, logMessage.source, logMessage.message],
    }) || '🕒';

  const hasArgs = logMessage.args !== undefined && logMessage.args?.length > 0;
  const data = createMessage({
    config,
    type: logMessage.type,
    source: logMessage.source,
    functionName: logMessage.functionName,
    isEffect: logMessage.isEffect,
    hasMessageColor: !!logMessage.messageColor,
    message: logMessage.message,
    line: logMessage.line,
    symbol,
    context: logMessage.context,
    tags: logMessage.tags,
    hasArgs,
    isError: logMessage.isError,
    datetimeDisplayType: config.datetimeDisplayType,
  });

  const styles = createStyles({
    config,
    type: logMessage.type,
    baseColor,
    source: logMessage.source,
    functionName: logMessage.functionName,
    isEffect: logMessage.isEffect,
    messageColor: logMessage.messageColor,
    line: logMessage.line,
    message: logMessage.message,
    context: logMessage.context,
    tags: logMessage.tags,
    symbol,
    hasArgs,
    hasVerticalSpace:
      logMessage.type === LOG_TYPE.WARNING ||
      logMessage.type === LOG_TYPE.ERROR,
  });

  return { data, styles, args: logMessage.args };
};

/**
 * Prepares the log messag by identifying the calling source
 * @param {LogParams} params - The logging parameters including source, function name, message, tags, etc.
 * @param {string} baseColor - The base color for the log style (used for different log types like INFO, WARNING, ERROR).
 * @param {boolean} [datetimeDisplayType=DATETIME] - Flag to determine which date and time type should be included in the log. Defaults to datetime.
 * @returns {{ data: string, styles: string[], args: any[] }} - Returns an object containing the formatted log message (`data`),
 *          the CSS styles to be applied to the log (`styles`), and the additional log arguments (`args`).
 *
 * @example
 * const { data, styles, args } = prepareLog({
 *   source: 'App.tsx',
 *   functionName: 'fetchData',
 *   message: 'Fetching data from API...',
 *   tags: ['api', 'fetch']
 * }, 'lightgray');
 *
 * console.info(data, ...styles, ...args);
 */
const prepareLog = (params: LogMessage, baseColor: string) => {
  params.source = getCallingFile(params.source) ?? undefined;
  return createLog(params, baseColor);
};

/**
 * Logs an individual message to the console.
 * This function handles the actual logging for a given `LogMessage` object.
 *
 * @param {LogMessage} message - The log message object containing type, color, and other parameters.
 */
export const handleMessage = (message: LogMessage) => {
  const { data, styles, args } = message.isFromDefaultConsole
    ? createLog(message, message.color ?? 'lightgray')
    : prepareLog(message, message.color ?? 'lightgray');

  // Log according to the log type and include args
  switch (message.type) {
    case LOG_TYPE.INFORMATION:
      if (args) console.info(data, ...styles, ...args);
      else console.info(data, ...styles);
      break;
    case LOG_TYPE.WARNING:
      if (args) getOriginalWarn()?.(data, ...styles, ...args);
      else getOriginalWarn()?.(data, ...styles);
      break;
    case LOG_TYPE.ERROR:
      if (args) getOriginalError()?.(data, ...styles, ...args);
      else getOriginalError()?.(data, ...styles);
      break;
    default:
      // Default to info
      if (args) console.info(data, ...styles, ...args);
      else console.info(data, ...styles);
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
