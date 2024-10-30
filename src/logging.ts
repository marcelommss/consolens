import {
  getLoggingConfiguration,
  initializeLogging,
  initializeTags,
  setupLogInterception,
} from './services/configurations';
import isDev from './helpers/environment.helper';
import {
  handleAllGroups,
  handleGroup,
  handleLog,
} from './helpers/logger.helper';
import { getOriginalLog } from './middleware';
import {
  ConsoleLogParams,
  LOG_HEADER_TYPE,
  LOG_TYPE,
  LogCalloutParameters,
  LoggingSetup,
  LogHeaderParameters,
  LogParams,
  Symbols,
} from './types/index';
import { identifyMessageAndArgs } from './helpers/files.helper';

/**
 * Sets up the logging package with the provided configuration.
 * This is the external-facing method users will call to configure logging.
 *
 * @param {LoggingSetup} setupConfig - Configuration object to set up logging.
 */
export function setupLogging(setupConfig: LoggingSetup): void {
  // Update the internal configuration
  initializeLogging(setupConfig);
  initializeTags();
}

/**
 * Enable or disable log interception.
 *
 * @param {boolean} enableInterception - value to enable/disable the logging interception.
 */
export function interceptLogs(enableInterception: boolean): void {
  setupLogInterception(enableInterception);
}

/**
 * Logs informational messages with optional metadata such as source, function name, message, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.message] - A description of the log message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the log message description
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logInformation = (params: LogParams) => {
  handleLog({
    ...params,
    type: LOG_TYPE.INFORMATION,
    color: params.messageColor,
  });
};

const logInfo = logInformation;

/**
 * Logs warning messages with optional metadata such as source, function name, line number, message, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.message] - A description of the warning message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the warning message description
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logWarning = (params: LogParams) => {
  handleLog({
    ...params,
    type: LOG_TYPE.WARNING,
    color: params.messageColor ?? 'orange',
  });
};

const logWarn = logWarning;

/**
 * Logs error messages with optional metadata such as source, function name, line number, message, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.message] - A description of the error message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the log message description (ignored in error logs)
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logError = (params: LogParams) => {
  handleLog({
    ...params,
    type: LOG_TYPE.ERROR,
    color: params.messageColor ?? 'red',
  });
};

/**
 * Logs informational messages with optional metadata such as source, function name, message, and more.
 *
 * @param {LogParams} params - The logging parameters
 * @param {string} [params.source] - The source file or component emitting the log
 * @param {string} [params.functionName] - The name of the function that generated the log
 * @param {boolean} [params.isEffect] - Whether this log is related to a side effect
 * @param {string} [params.message] - A description of the log message
 * @param {any[]} [params.args] - Additional arguments to be logged
 * @param {string} [params.messageColor] - Color for the log message description
 * @param {number} [params.line] - The line number where the log occurred
 * @param {string} [params.context] - The context of the log
 * @param {string[]} [params.tags] - Tags for log identification
 */
const logDebug = (params: LogParams) => {
  handleLog({
    ...params,
    type: LOG_TYPE.DEBUG,
    color: params.messageColor,
  });
};

const isConsoleLogParams = (input: any): input is ConsoleLogParams => {
  return typeof input === 'object' && input !== null && 'type' in input;
};

/**
 * General logging function that handles different log types (INFO, WARNING, ERROR).
 *
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {ConsoleLogParams} params - The logging parameters
 */
const loglens = (...inputs: ConsoleLogParams | string | any | any[]) => {
  if (!inputs) return;
  if (typeof inputs === 'string') {
    logInfo({ message: inputs });
  } else if (isConsoleLogParams(inputs)) {
    const { type, ...params } = inputs;
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
  } else {
    if (Array.isArray(inputs)) {
      const { message, restArgs, isError } = identifyMessageAndArgs(inputs);

      if (isError) {
        if (message) {
          logError({ message, args: restArgs });
        } else {
          logError({ args: inputs });
        }
      } else {
        if (message) {
          logInfo({ message, args: restArgs });
        } else {
          logInfo({ args: inputs });
        }
      }
      return;
    }
    logInfo({ args: [inputs] });
  }
};

const log = loglens;

/**
 * Logs messages in development mode only.
 *
 * @param {LOG_TYPE} type - The type of log (INFO, WARNING, ERROR)
 * @param {LogParams} params - The logging parameters
 */
const logDev = (type: LOG_TYPE = LOG_TYPE.INFORMATION, params: LogParams) => {
  if (isDev()) {
    log({ type, ...params });
  }
};

const logDevInfo = (params: LogParams) =>
  isDev() && loglens({ type: LOG_TYPE.INFORMATION, ...params });
const logDevError = (params: LogParams) =>
  isDev() && loglens({ type: LOG_TYPE.ERROR, ...params });
const logDevWarn = (params: LogParams) =>
  isDev() && loglens({ type: LOG_TYPE.WARNING, ...params });
const logDevDebug = (params: LogParams) =>
  isDev() && loglens({ type: LOG_TYPE.DEBUG, ...params });

const logDevWarning = logDevWarn;

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
function logHeader({ title, type }: LogHeaderParameters): void {
  let fontSize = '16px'; // Default font size for H5
  const config = getLoggingConfiguration();
  if (!type) type = config.defaultHeaderSize;

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

  const padding = '12px'; // Padding for visual separation of the callout

  // Use the original console.log to avoid interception by middleware
  getOriginalLog()?.(
    `%c\u00A0\u00A0${title}`, // Display icon + space + title
    `font-size: ${fontSize}; font-weight: bold; text-align: center; padding: ${padding} 0;
   display: flex; align-items: center; justify-content: space-between; 
   width: 100vw; white-space: pre;`
  );
}

/**
 * Logs a callout with a title and an optional icon, centered in the console with top and bottom padding.
 * The callout has a left border and displays an icon (if provided) followed by the title with proper spacing.
 *
 * @param {LogCalloutParameters} params - The parameters including title, callout type, and an optional icon.
 */
function logCallout({ title, icon, type }: LogCalloutParameters): void {
  let fontSize = '16px'; // Default font size for H5
  const config = getLoggingConfiguration();
  if (!type) type = config.defaultHeaderSize;

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

  const padding = '12px'; // Padding for visual separation of the callout
  const leftBorder = `solid 4px #FFFFFF55`; // Left border for callout
  const displayIcon = icon ? `${Symbols[icon]} ` : ''; // Add the icon with a space after it
  const filler = '\u00A0'.repeat(500);
  // Use the original console.log to avoid interception by middleware
  getOriginalLog()?.(
    `%c  ${displayIcon}\u00A0\u00A0${title}${filler}`, // Display icon + space + title
    `font-size: ${fontSize}; font-weight: bold; text-align: center; padding: ${padding} 0;
   display: flex; align-items: center; justify-content: space-between; 
   width: 100vw; white-space: pre; 
   background-color: {#FFFFFF11}; border-left: ${leftBorder};`
  );
}

/**
 * Logs all messages from a specific group.
 * If no groupId is provided, logs the messages of the first available group.
 *
 * @param {string} [groupId] - The group identifier. If not provided, the first group will be logged.
 */
const logGroup = (groupId?: string): void => {
  handleGroup(groupId);
};

/**
 * Logs all messages from all groups.
 * This function logs the messages from every group in the logGroups stack.
 */
const logGroups = (): void => {
  handleAllGroups();
};

export {
  log,
  loglens,
  logError,
  logInfo,
  logWarn,
  logWarning,
  logDebug,
  logDev,
  logDevInfo,
  logDevError,
  logDevWarn,
  logDevWarning,
  logDevDebug,
  clearLog,
  logDivider,
  logHeader,
  logCallout,
  logGroup,
  logGroups,
};
