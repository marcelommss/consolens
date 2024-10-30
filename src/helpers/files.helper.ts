import { ConsoleMessage, LOG_TYPE, TraceInformation } from '../types/index';

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
 * Captures and returns the current stack trace as an array of strings.
 * Each element in the array represents a line in the stack trace.
 *
 * @returns {string[]} An array of stack trace entries, or an empty array if the stack trace is unavailable.
 */
const captureStackTrace = (): string[] => {
  const error = new Error();
  const stackTrace = error.stack;
  if (!stackTrace) return [];
  return stackTrace.split('\n');
};

/**
 * Extracts trace information such as function name, file name, and line number from the current stack entry.
 * @param {string} stackEntry - Current stack entry.
 *
 * @returns {TraceInformation} An object containing functionName, fileName, and lineNumber.
 *                             If the stack trace is too short or cannot be parsed, the values will be undefined.
 */
export const findDataFromEntry = (stackEntry: string): TraceInformation => {
  const traceData: TraceInformation = {};

  // Extract the function name
  const matchFunction = stackEntry.match(/at\s+([^\s(]+)/);
  traceData.functionName = matchFunction ? matchFunction[1] : undefined;

  // Extract the source file information
  const matchSource = stackEntry.match(/\/([^/]+\.[a-z]+)(\?|:)/i);
  if (matchSource) {
    let fullFilePath = matchSource[1];

    // Check if the file is "index" and adjust for parent folder
    if (/^index\.[a-z]+$/i.test(fullFilePath)) {
      const parentFolderMatch = stackEntry.match(
        /\/([^/]+)\/index\.[a-z]+(\?|:)/i
      );
      if (parentFolderMatch) {
        fullFilePath = `${parentFolderMatch[1]}/index.${fullFilePath
          .split('.')
          .pop()}`;
      }
      traceData.fileName = fullFilePath;
    } else {
      traceData.fileName = matchSource ? matchSource[1] : undefined;
    }
  }

  // Extract line number
  const match = stackEntry.match(/:(\d+):(\d+)/);
  traceData.lineNumber = match ? +match[1] : undefined;

  return traceData;
};

/**
 * Extracts trace information such as function name, file name, and line number from the current stack trace.
 * This function captures the stack trace and parses the relevant entry to gather information about the
 * function and source file where the trace was triggered.
 *
 * @returns {TraceInformation} An object containing functionName, fileName, and lineNumber.
 *                             If the stack trace is too short or cannot be parsed, the values will be undefined.
 */
export const findDataFromTrace = (): TraceInformation => {
  const entries = captureStackTrace();
  if (entries.length === 0) return {};
  let sourceIndex = 0;
  entries.forEach((entry, index) => {
    if (
      entry.includes('at handleLog') &&
      entry.includes('logging/helpers/logger.helper.ts')
    ) {
      sourceIndex = index + 2;
      return;
    }
  });

  const stackEntry = entries[sourceIndex];

  return findDataFromEntry(stackEntry);
};

/**
 * Resolves the calling file name either from the provided source or a fallback method.
 * Excludes certain files like 'bundle.js' or undefined values.
 *
 * @param {string} [source] - The provided source file name
 * @returns {string | undefined} - The resolved calling file or undefined if invalid
 */
export const getCallingFile = (source?: string): string | undefined => {
  let callingFile: string | undefined =
    source ?? getCallingFileName() ?? 'Unknown Source';

  if (
    callingFile.includes('logging/helpers/files.helper.ts') ||
    callingFile?.includes('bundle.js') ||
    callingFile === 'Unknown Source'
  ) {
    callingFile = undefined;
  }

  return callingFile;
};

/**
 * Identifies and returns the message and the rest of the arguments based on the provided args array.
 *
 * @param args - An array of arguments that may include a message as the first element (string) and other arguments.
 * @returns {ConsoleMessage} - An object containing the identified message and the remaining arguments.
 *
 * - `message`: A string representing the first argument if it is a string, otherwise a default message.
 * - `restArgs`: The remaining arguments (if any), or undefined if no other arguments are provided.
 */
export function identifyMessageAndArgs(
  args: any[],
  type?: LOG_TYPE,
  showInterceptMessage?: boolean
): ConsoleMessage {
  const INTERCEPT_MESSAGE = 'Intercepted log message';
  let message: string | undefined = showInterceptMessage
    ? INTERCEPT_MESSAGE
    : undefined;
  let restArgs: any[] | undefined = args;
  let isError: boolean = false;

  if (args && args.length > 0) {
    if (args[0] instanceof Error) {
      message = undefined;
      restArgs = args;
      isError = true;
    } else {
      message = typeof args[0] === 'string' ? args[0] : INTERCEPT_MESSAGE;
      restArgs = message === INTERCEPT_MESSAGE ? args : args.slice(1) || [];
      if (
        (!type || type === LOG_TYPE.ERROR) &&
        args.length > 1 &&
        args[1] instanceof Error
      )
        isError = true;
    }
  }

  return { message, restArgs, isError };
}
