import { initializeLogging, initializeTags } from './configurations';
import isDev from './helpers/environment.helper';
import { handleLog } from './helpers/logger.helper';
import { getOriginalLog, initializeLoggingMiddleware } from './middleware';
import {
  LOG_HEADER_TYPE,
  LOG_TYPE,
  LoggingSetup,
  LogHeaderParameters,
  LogParams,
} from './types/index';

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
  handleLog({
    ...params,
    type: LOG_TYPE.INFORMATION,
    color: params.messageColor,
  });
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
  // Create LogMessage from LogParams and pass to handleLog
  handleLog({
    ...params,
    type: LOG_TYPE.WARNING,
    color: params.messageColor ?? 'orange',
  });
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
  // Create LogMessage from LogParams and pass to handleLog
  handleLog({
    ...params,
    type: LOG_TYPE.ERROR,
    color: params.messageColor ?? 'red',
  });
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
  log,
  logError,
  logInfo,
  logWarning,
  logDev,
  logDevInfo,
  logDevError,
  logDevWarning,
  clearLog,
  logDivider,
  logHeader,
};
