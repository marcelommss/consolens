import {
  getLoggingConfiguration,
  initializeLogging,
  initializeTags,
} from './configurations';
import isDev from './helpers/DevDetect';
import { findSymbol, KEYWORD_TYPES } from './icons';
import { getOriginalLog, initializeLoggingMiddleware } from './middleware';
import { getTagColor } from './tags';
import {
  CLOCK_TYPE,
  LOG_HEADER_TYPE,
  LOG_TYPE,
  LoggingSetup,
  LogHeaderParameters,
  LogParams,
} from './types';

/**
 * Sets up the logging package with the provided configuration.
 * This is the external-facing method users will call to configure logging.
 *
 * @param {LoggingSetup} setupConfig - Configuration object to set up logging.
 */
export function setupLogging(setupConfig: LoggingSetup): void {
  // Update the internal configuration
  initializeLogging(setupConfig);
  if (setupConfig?.interceptLogs) initializeLoggingMiddleware();
  initializeTags();
}

/**
 * Resolves the calling file name either from the provided source or a fallback method.
 * Excludes certain files like 'bundle.js' or undefined values.
 *
 * @param {string} [source] - The provided source file name
 * @returns {string | undefined} - The resolved calling file or undefined if invalid
 */
const getCallingFile = (source?: string): string | undefined => {
  let callingFile: string | undefined =
    source ?? getCallingFileName() ?? 'Unknown Source';

  if (callingFile?.includes('bundle.js') || callingFile === 'Unknown Source') {
    callingFile = undefined;
  }

  return callingFile;
};

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
export const createMessage = ({
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

  let data = `%c${displayDT} ${symbol}`;

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

  if (description)
    data += `\n\t%cmessage:  ${hasMessageColor ? '%c%c' : '%c'}${description}`;

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
export const createStyles = ({
  baseColor,
  type,
  source,
  functionName,
  isEffect,
  messageColor,
  line,
  description,
  context,
  tags,
  symbol,
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

  // Get calling file with fallback to 'Unknown Source'
  const callingFile = getCallingFile(params.source) ?? 'Unknown Source';

  // Find the symbol or fallback to the default '🕒'
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
 * Handles the actual logging based on log type (INFO, WARNING, ERROR).
 * @param logType - The type of log (INFO, WARNING, ERROR)
 * @param params - The logging parameters
 * @param baseColor - The base color for the log
 */
const handleLog = (logType: LOG_TYPE, params: LogParams, baseColor: string) => {
  const { data, styles, args } = prepareLog(params, baseColor);

  // Log according to the log type and include args
  switch (logType) {
    case LOG_TYPE.INFORMATION:
      console.info(data, ...styles, ...args);
      break;
    case LOG_TYPE.WARNING:
      console.warn(data, ...styles, ...args);
      break;
    case LOG_TYPE.ERROR:
      console.error(data, ...styles, ...args);
      break;
    default:
      console.info(data, ...styles, ...args); // Default to info
  }
};

/**
 * Logs informational messages with optional metadata such as source, function name, description, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.description] - A description of the log message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the log message description
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logInfo = (params: LogParams) => {
  initializeTags();
  handleLog(LOG_TYPE.INFORMATION, params, 'lightgray');
};

/**
 * Logs warning messages with optional metadata such as source, function name, line number, description, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.description] - A description of the warning message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the warning message description
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logWarning = (params: LogParams) => {
  initializeTags();
  initializeTags();
  handleLog(LOG_TYPE.INFORMATION, params, 'lightgray');
};

/**
 * Logs error messages with optional metadata such as source, function name, line number, description, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.description] - A description of the error message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the log message description (ignored in error logs)
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logError = (params: LogParams) => {
  initializeTags();
  handleLog(LOG_TYPE.ERROR, params, 'red');
};

/**
 * General logging function that handles different log types (INFO, WARNING, ERROR).
 *
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {LogParams} params - The logging parameters
 */
const log = (type: LOG_TYPE = LOG_TYPE.INFORMATION, params: LogParams) => {
  switch (type) {
    case LOG_TYPE.INFORMATION:
      logInfo(params);
      break;
    case LOG_TYPE.WARNING:
      logWarning(params);
      break;
    case LOG_TYPE.ERROR:
      logError(params);
      break;
    default:
      logInfo(params);
  }
};

/**
 * Logs messages in development mode only.
 *
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {LogParams} params - The logging parameters
 */
const logDev = (type: LOG_TYPE = LOG_TYPE.INFORMATION, params: LogParams) => {
  if (isDev()) {
    log(type, params);
  }
};

const logDevInfo = (params: LogParams) =>
  isDev() && log(LOG_TYPE.INFORMATION, params);
const logDevError = (params: LogParams) =>
  isDev() && log(LOG_TYPE.ERROR, params);
const logDevWarning = (params: LogParams) =>
  isDev() && log(LOG_TYPE.WARNING, params);

/**
 * Clears the console log.
 */
const clearLog = () => {
  try {
    console.clear();
  } catch (error) {
    console.error('Failed to clear console:', error);
  }
};

/**
 * Retrieves the file name and line number of the calling function from the stack trace.
 *
 * @returns {string | null} - Returns the file name with line and column number, or null if not found.
 */
export function getCallingFileName(): string | null {
  const stackTrace = new Error().stack;
  if (!stackTrace) return null;

  const stackLines = stackTrace.split('\n').map((line) => line.trim());
  const relevantLine = stackLines.find(
    (line) =>
      !line.includes('(native)') && !line.includes('Error') && line !== ''
  );

  if (!relevantLine) return null;

  const fileNameMatch =
    relevantLine.match(/\((.*):(\d+):(\d+)\)$/) ||
    relevantLine.match(/at (.*):(\d+):(\d+)/);
  if (fileNameMatch) {
    return `${fileNameMatch[1]}:${fileNameMatch[2]}:${fileNameMatch[3]}`;
  }

  return null;
}

/**
 * Creates a styled line break or divider for console logs with a line-height of 4.
 *
 * @param {string} [char='═'] - The character used for the divider (default is '═')
 * @param {number} [length=50] - The length of the divider (default is 50 characters)
 */
const logDivider = (char = '═', length = 72) => {
  const divider = char.repeat(length);
  console.log('%c' + divider, 'line-height: 4;  color: #FFFFFF22;');
};

/**
 * Logs a header with a title, centered in the console with top and bottom padding.
 * The title's size corresponds to the provided header type (e.g., H1, H2).
 *
 * @param {LogHeaderParameters} params - The parameters including title and header type.
 */
export function logHeader({ title, type }: LogHeaderParameters): void {
  let fontSize = '16px'; // Default font size for H5

  switch (type) {
    case LOG_HEADER_TYPE.H1:
      fontSize = '32px';
      break;
    case LOG_HEADER_TYPE.H2:
      fontSize = '28px';
      break;
    case LOG_HEADER_TYPE.H3:
      fontSize = '24px';
      break;
    case LOG_HEADER_TYPE.H4:
      fontSize = '20px';
      break;
    case LOG_HEADER_TYPE.H5:
    default:
      fontSize = '16px';
      break;
  }

  const padding = '12px'; // Padding for visual separation of the header

  // Use the original console.log to avoid interception by middleware
  getOriginalLog()?.(
    `%c${title}`,
    `font-size: ${fontSize}; font-weight: bold; text-align: center; padding: ${padding} 0; display: block; background-color: #f0f0f0; border: solid 2px #000;`
  );
}

export {
  clearLog,
  log,
  logError,
  logInfo,
  logWarning,
  logDev,
  logDevInfo,
  logDevError,
  logDevWarning,
  logDivider,
};
