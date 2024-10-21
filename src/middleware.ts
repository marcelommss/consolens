import { Icons, Symbols } from './data/icons.data';
import { handleMessage } from './helpers/logger.helper';
import { logCallout } from './logging';
import { LOG_HEADER_TYPE, LOG_TYPE } from './types/index';

// Variable to store the original console.log
let originalLog: typeof console.log | null = null;

/**
 * Creates and stores the original console.log if it hasn't been created already.
 */
const createOriginalLog = (): void => {
  if (
    !originalLog &&
    typeof console !== 'undefined' &&
    typeof console.log === 'function'
  ) {
    originalLog = console.log; // Store the original console.log function
  }
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
 * Extracts the source file and line number from the stack trace.
 *
 * @returns {string} The file and line information where the log was called.
 */
const getSourceFromStack = (): string => {
  const error = new Error();
  const stackLines = error.stack?.split('\n') || [];
  const relevantLine = stackLines.find((line) => line.includes('at'));

  if (relevantLine) {
    const match =
      relevantLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
      relevantLine.match(/at\s+(.*):(\d+):(\d+)/);
    if (match) {
      return `${match[2]}:${match[3]}`; // Returns file path and line number
    }
  }
  return 'Unknown Source';
};

/**
 * Intercepts the default console.log, console.warn, and console.error functions,
 * and redirects them to the logging package's log functions.
 * Extracts the source and message from the original logs and avoids recursion.
 */
const interceptConsoleLogs = (): void => {
  // Backup the original console functions
  createOriginalLog(); // Ensure originalLog is created
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  // Wraps console.log to avoid recursion and extract more information
  console.log = (...args: any[]) => {
    const source = getSourceFromStack();
    const message =
      typeof args[0] === 'string' ? args[0] : 'Intercepted log message';
    const restArgs = args.slice(1); // Get remaining args

    if (new Error().stack?.includes('logDevInfo')) {
      originalLog(...args); // Call the original console.log
    } else {
      handleMessage({
        type: LOG_TYPE.INFORMATION,
        source,
        functionName: 'console.log',
        message,
        args: restArgs,
        isFromDefaultConsole: true,
      });
    }
  };

  // Wraps console.warn to avoid recursion and extract more information
  console.warn = (...args: any[]) => {
    const source = getSourceFromStack();
    const message =
      typeof args[0] === 'string' ? args[0] : 'Intercepted warning message';
    const restArgs = args.slice(1); // Get remaining args

    if (new Error().stack?.includes('logWarning')) {
      originalWarn(...args); // Call the original console.warn
    } else {
      handleMessage({
        type: LOG_TYPE.WARNING,
        source,
        functionName: 'console.warn',
        message,
        args: restArgs,
        isFromDefaultConsole: true,
      });
    }
  };

  // Wraps console.error to avoid recursion and extract more information
  console.error = (...args: any[]) => {
    const source = getSourceFromStack();
    const message =
      typeof args[0] === 'string' ? args[0] : 'Intercepted error message';
    const restArgs = args.slice(1); // Get remaining args

    if (new Error().stack?.includes('logError')) {
      originalError(...args); // Call the original console.error
    } else {
      handleMessage({
        type: LOG_TYPE.ERROR,
        source,
        functionName: 'console.error',
        message,
        args: restArgs,
        isFromDefaultConsole: true,
      });
    }
  };

  logCallout({
    title: 'Welcome to Consolens',
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

export { interceptConsoleLogs, initializeLoggingMiddleware, getOriginalLog };
