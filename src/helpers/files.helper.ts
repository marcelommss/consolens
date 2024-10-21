import { TraceInformation } from '../types/index';

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
 * Extracts trace information such as function name, file name, and line number from the current stack trace.
 * This function captures the stack trace and parses the relevant entry to gather information about the
 * function and source file where the trace was triggered.
 *
 * @returns {TraceInformation} An object containing functionName, fileName, and lineNumber.
 *                             If the stack trace is too short or cannot be parsed, the values will be undefined.
 */
export const findDataFromTrace = (): TraceInformation => {
  const traceData: TraceInformation = {};
  const entries = captureStackTrace();
  if (entries.length === 0) return traceData;
  let sourceIndex = 0;
  entries.forEach((entry, index) => {
    if (
      entry.includes('at handleLog') &&
      entry.includes('logging/helpers/logger.helper.ts')
    )
      sourceIndex = index + 2;
  });

  const stackEntry = entries[sourceIndex];

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
