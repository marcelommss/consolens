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
 * Resolves the calling file name either from the provided source or a fallback method.
 * Excludes certain files like 'bundle.js' or undefined values.
 *
 * @param {string} [source] - The provided source file name
 * @returns {string | undefined} - The resolved calling file or undefined if invalid
 */
export const getCallingFile = (source?: string): string | undefined => {
  let callingFile: string | undefined =
    source ?? getCallingFileName() ?? 'Unknown Source';

  if (callingFile?.includes('bundle.js') || callingFile === 'Unknown Source') {
    callingFile = undefined;
  }

  return callingFile;
};
