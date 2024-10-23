import { LOG_HEADER_TYPE, LOG_TYPE } from './options';

export * from './options';
export * from './configuration';
export * from '../data/icons.data';

/**
 * Interface for logging parameters.
 * Provides structured data for logging functions such as source, function name, and message.
 */
export interface LogParams {
  /**
   * The log message.
   */
  message?: string;

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

  /**
   * Group used to group log messages and display them together.
   * By default, messages with a group are hidden initially and can be displayed together using `logGroup`.
   */
  group?: string;

  /**
   * Indicates if the group belongs to another parent group.
   * Consolens will automatically detect a subgroup, but if a subgroup has not been created yet, you must specify its parent group when logging for the first time.
   */
  parentGroup?: string;

  /**
   * Indicates if this group will receive a background color with transparency.
   * Each group will have an unique colpredator, defined dynamically by Colorlens.
   * false by default.
   */
  groupColor?: boolean;

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
}

/**
 * Interface for logging parameters.
 * Type of the console function and LogParams.
 */
export interface ConsoleLogParams extends LogParams {
  /**
   * This indicates the type of the message
   */
  type: LOG_TYPE;
}

/**
 * Interface for log messages.
 * Provides structured data for logging messages.
 */
export interface LogMessage extends ConsoleLogParams {
  /**
   * This indicates the type of the message
   */
  type: LOG_TYPE;

  /**
   * This indicates the color of the message
   */
  color?: string;

  /**
   * This indicates the group level of the message
   */
  groupLevel?: number;

  /**
   * This indicates the log message comes default console.log
   */
  isFromDefaultConsole?: boolean;

  /**
   * This indicates the log is an error with error argument
   */
  isError?: boolean;

  /**
   * This indicates the log is an warning with error argument
   */
  isWarning?: boolean;
}

/**
 * Interface for log groups.
 */
export interface LogGroup {
  /**
   * The group title that identifies the group.
   */
  id: string;

  /**
   * Children groups array, allowing for nested subgroups.
   */
  children?: LogGroup[];

  /**
   * An array of messages that belong to this group.
   */
  messages: LogMessage[];

  /**
   * Group background color, if any.
   */
  color?: string;

  /**
   * Group tree level.
   */
  level: number;
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
  type?: LOG_HEADER_TYPE;
}

/**
 * Interface representing the parameters for logging a callout.
 * This will determine the title content and the icon in the console.
 */
export interface LogCalloutParameters extends LogHeaderParameters {
  /**
   * An icon representing the callout
   */
  icon?: string;
}

/**
 * Data from stack trace
 */
export interface TraceInformation {
  /**
   * Calling function.
   */
  functionName?: string;

  /**
   * Calling file.
   */
  fileName?: string;

  /**
   * Calling line number.
   */
  lineNumber?: number;
}

/**
 * Represents the structure of the return value for the identifyMessageAndArgs function.
 *
 * @property message - A string that represents either the first argument (if it's a string) or a default message.
 * @property restArgs - The remaining arguments after the message. This is an array of any values or undefined if no other arguments are provided.
 */
export type ConsoleMessage = {
  message?: string;
  restArgs?: any[] | undefined;
  isError?: boolean;
};
