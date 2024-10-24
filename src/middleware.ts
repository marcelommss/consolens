import { Icons, Symbols } from './data/icons.data';
import {
  findDataFromEntry,
  identifyMessageAndArgs,
} from './helpers/files.helper';
import { handleMessage } from './helpers/logger.helper';
import { logCallout } from './logging';
import { getLoggingConfiguration } from './services/configurations';
import { LOG_HEADER_TYPE, LOG_TYPE, LogMessage } from './types/index';

// Variable to store the original console.log
let originalLog: typeof console.log | null = null;
let originalWarn: typeof console.warn | null = null;
let originalError: typeof console.error | null = null;

/**
 * Creates and stores the original console.log if it hasn't been created already.
 */
const createOriginalLog = (): void => {
  if (typeof console === 'undefined') return;
  if (typeof console.log === 'function' && !originalLog)
    originalLog = console.log;
  if (typeof console.warn === 'function' && !originalWarn)
    originalWarn = console.warn;
  if (typeof console.error === 'function' && !originalError)
    originalError = console.error;
};

/**
 * Gets the original console.log.
 * @returns {typeof console.log} The original console.log function.
 */
const getOriginalLog = (): typeof console.log => {
  createOriginalLog(); // Ensure originalLog is created before returning it
  return originalLog as typeof console.log;
};

/**
 * Gets the original console.warn.
 * @returns {typeof console.warn} The original console.warn function.
 */
const getOriginalWarn = (): typeof console.warn => {
  createOriginalLog(); // Ensure originalLog is created before returning it
  return originalWarn as typeof console.warn;
};

/**
 * Gets the original console.error.
 * @returns {typeof console.error} The original console.error function.
 */
const getOriginalError = (): typeof console.error => {
  createOriginalLog(); // Ensure originalLog is created before returning it
  return originalError as typeof console.error;
};

/**
 * Extracts the source file and line number from the stack trace.
 * @param {LOG_TYPE[]} type - Type of log.
 * @param {string[]} entries - Stack trace entries.
 *
 * @returns {string} The file and line information where the log was called.
 */
const getSourceFromStack = (
  type: LOG_TYPE,
  entries: string[]
): string | undefined => {
  let entryName = '';
  switch (type) {
    case LOG_TYPE.INFORMATION:
      entryName = 'at console.log';
      break;
    case LOG_TYPE.WARNING:
      entryName = 'at console.warn';
      break;
    case LOG_TYPE.ERROR:
      entryName = 'at console.error';
      break;
    default:
      entryName = 'at console.log';
      break;
  }

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (entry.includes(entryName) && entry.includes('logging/middleware.ts')) {
      const sourceIndex = index + 1;
      return entries?.[sourceIndex];
    }
  }

  return undefined;
};

/**
 * Get all the entries from the stack trace.
 *
 * @returns {string[]} return stack trace entries.
 */
const getStackTrace = (): string[] => {
  try {
    const error = new Error();
    const stackLines = error.stack?.split('\n') || [];
    return stackLines;
  } catch {
    return [];
  }
};

/**
 * Determines whether the log should be intercepted based on the log type and stack trace entries.
 *
 * @param logType - The type of log being checked (e.g., INFO, ERROR, WARNING).
 * @param entries - The array of stack trace entries to check.
 * @returns {boolean} - Returns true if the log should be intercepted, false otherwise.
 */
function shouldInterceptLog(logType: LOG_TYPE, entries: string[]): boolean {
  // Define log functions to intercept based on log type
  const logFunctionsToCheck: string[] = {
    [LOG_TYPE.INFORMATION]: [
      'at logDevInfo',
      'at logInfo',
      'at log',
      'handleMessage',
    ],
    [LOG_TYPE.WARNING]: [
      'at logDevWarning',
      'at logWarning',
      'at log',
      'handleMessage',
    ],
    [LOG_TYPE.ERROR]: [
      'at logDevError',
      'at logError',
      'at log',
      'handleMessage',
    ],
  }[logType];
  // Check if any stack trace entry matches the log functions and is from logger.helper.ts
  return entries.some((entry) => {
    const isLogFunctionMatch = logFunctionsToCheck.some((fn) =>
      entry.includes(fn)
    );
    return isLogFunctionMatch && entry.includes('logger.helper.ts');
  });
}

const handleConsoleMessage = (type: LOG_TYPE, args: any[]) => {
  const entries = getStackTrace();
  if (shouldInterceptLog(type, entries)) {
    // originalLog?.apply(console, args);
    return;
  }

  const { message, restArgs, isError } = identifyMessageAndArgs(args, type);

  let logname = 'console.log';
  switch (type) {
    case LOG_TYPE.INFORMATION:
      logname = 'console.log';
      break;
    case LOG_TYPE.WARNING:
      logname = 'console.warn';
      break;
    case LOG_TYPE.ERROR:
      logname = 'console.error';
      break;

    default:
      break;
  }
  const logMessage: LogMessage = {
    type,
    functionName: logname,
    message,
    args: restArgs,
    isFromDefaultConsole: true,
    isError,
  };

  const source = getSourceFromStack(type, entries);
  if (source) {
    const traceInfo = findDataFromEntry(source);
    if (traceInfo) {
      if (traceInfo.fileName)
        logMessage.source = traceInfo.fileName?.includes('Unknown Source')
          ? undefined
          : traceInfo.fileName;
      if (traceInfo.lineNumber) logMessage.line = traceInfo.lineNumber;
      if (traceInfo.functionName)
        logMessage.functionName = traceInfo.functionName?.includes(
          '<anonymous>'
        )
          ? undefined
          : traceInfo.functionName;
    }
  }
  const config = getLoggingConfiguration();
  handleMessage(config, logMessage);
};

/**
 * Intercepts the default console.log, console.warn, and console.error functions,
 * and redirects them to the logging package's log functions.
 * Extracts the source and message from the original logs and avoids recursion.
 */
const interceptConsoleLogs = (): void => {
  // Backup the original console functions
  createOriginalLog();
  // const interceptedLog = console.log;
  // const interceptedWarn = console.warn;
  // const interceptedError = console.error;

  // Wraps console.log to avoid recursion and extract more information
  console.log = (...args: any[]) =>
    handleConsoleMessage(LOG_TYPE.INFORMATION, args);

  // Wraps console.warn to avoid recursion and extract more information
  console.warn = (...args: any[]) =>
    handleConsoleMessage(LOG_TYPE.WARNING, args);

  // Wraps console.error to avoid recursion and extract more information
  console.error = (...args: any[]) =>
    handleConsoleMessage(LOG_TYPE.ERROR, args);

  logCallout({
    title: 'consolens is now intercepting all log messages',
    icon: Symbols[Icons.Search],
    type: LOG_HEADER_TYPE.H5,
  });
};

/**
 * Automatically starts the middleware on application initialization.
 * Works for both browser and Node.js environments.
 */
const initializeLoggingMiddleware = (): void => {
  // Check if running in a browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // If the DOM is already fully loaded, initialize immediately
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      interceptConsoleLogs();
    } else {
      // Otherwise, wait for DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        interceptConsoleLogs();
      });
    }
  }
  // Check if running in Node.js
  else if (typeof global !== 'undefined') {
    interceptConsoleLogs(); // No DOM events needed, so just initialize
  }
};

/**
 * Stops the logging middleware.
 */
const stopLoggingMiddleware = (): void => {
  if (getOriginalLog())
    console.log = (...args: any[]) => getOriginalLog()?.(args);

  if (getOriginalLog())
    console.log = (...args: any[]) => getOriginalWarn()?.(args);

  if (getOriginalLog())
    console.log = (...args: any[]) => getOriginalError()?.(args);

  logCallout({
    title: 'consolens stopped intercepting log messages',
    icon: Symbols[Icons.Search],
    type: LOG_HEADER_TYPE.H5,
  });
};

export {
  interceptConsoleLogs,
  initializeLoggingMiddleware,
  stopLoggingMiddleware,
  getOriginalLog,
  getOriginalWarn,
  getOriginalError,
};
