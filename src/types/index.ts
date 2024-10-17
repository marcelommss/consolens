/**
 * Interface for logging parameters.
 * Provides structured data for logging functions such as source, function name, and description.
 */
export interface LogParams {
  /**
   * The source file or component emitting the log (e.g., 'App.tsx').
   */
  source?: string;

  /**
   * The name of the function that generated the log (e.g., 'fetchData').
   */
  functionName?: string;

  /**
   * Indicates whether this log is related to a side effect.
   */
  isEffect?: boolean;

  /**
   * A description of the log message, explaining what it represents.
   */
  description?: string;

  /**
   * Additional arguments or data to log (e.g., responses, objects).
   */
  args?: any | any[];

  /**
   * Optional custom color for the log message (used for styled logging).
   */
  messageColor?: string;

  /**
   * The line number where the log occurred.
   */
  line?: number;

  /**
   * Additional context information relevant to the log message.
   */
  context?: string;

  /**
   * Tags used to categorize the log message (e.g., ['performance', 'api']).
   */
  tags?: string[];
}

/**
 * Enum representing different types of logs.
 * Useful for categorizing logs such as informational logs, warnings, and errors.
 */
export enum LOG_TYPE {
  /**
   * Informational log type, used for general information messages.
   */
  INFORMATION = 'INFO',

  /**
   * Error log type, used to log errors or critical issues.
   */
  ERROR = 'ERROR',

  /**
   * Warning log type, used to log warnings about potential issues.
   */
  WARNING = 'WARNING',
}

/**
 * Enum representing different types of date and time display.
 */
export enum CLOCK_TYPE {
  /**
   * Display only the date.
   */
  DATE = 'DATE_ONLY',

  /**
   * Display only the time.
   */
  TIME = 'TIME_ONLY',

  /**
   * DISPLAY COMPLETE DATE AND TIME.
   */
  DATETIME = 'DATETIME',
}

/**
 * Interface for setting up the logging package.
 * Configures options like intercepting console logs.
 */
export interface LoggingSetup {
  /**
   * Indicates whether the package should intercept default console calls (e.g., console.log, console.warn).
   */
  interceptLogs: boolean;

  /**
   * Defines how the date and time should be displayed in log messages.
   * Options are CLOCK_TYPE.DATETIME, CLOCK_TYPE.DATE, and CLOCK_TYPE.TIME.
   */
  datetimeDisplayType: CLOCK_TYPE;
}

/**
 * Interface representing the full logging configuration, extending LoggingSetup.
 * Includes properties for managing tag colors and tracking the setup state.
 */
export interface LoggingConfiguration extends LoggingSetup {
  /**
   * Indicates whether tag colors have been loaded.
   */
  loadedTags: boolean;

  /**
   * Object that maps tag names to their assigned colors.
   */
  tagColors: { [key: string]: string };

  /**
   * Counter used to assign new colors to tags when needed.
   */
  colorCounter: number;
}

/**
 * Enum representing different header sizes.
 * Each header type corresponds to a different font size for console log output.
 */
export enum LOG_HEADER_TYPE {
  /**
   * Header size 1 (largest).
   */
  H1 = 'H1',

  /**
   * Header size 2.
   */
  H2 = 'H2',

  /**
   * Header size 3.
   */
  H3 = 'H3',

  /**
   * Header size 4.
   */
  H4 = 'H4',

  /**
   * Header size 5 (smallest).
   */
  H5 = 'H5',
}

/**
 * Interface representing the parameters for logging a header.
 * This will determine the title content and its visual appearance in the console.
 */
export interface LogHeaderParameters {
  /**
   * The title to be displayed in the console.
   */
  title: string;

  /**
   * The type of header (e.g., H1, H2, etc.), determining the font size for the console output.
   */
  type: LOG_HEADER_TYPE;
}