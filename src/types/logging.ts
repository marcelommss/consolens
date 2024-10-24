import { LoggingConfiguration, LogMessage } from './index';
import { CLOCK_TYPE } from './options';

/**
 * Base interface for logging messages, including common properties such as config, symbols, and arguments.
 * Extended by more specific logging message types.
 */
export interface BaseMessageParams extends LogMessage {
  /**
   * Configuration for logging behavior.
   */
  config: LoggingConfiguration;

  /**
   * Optional symbol to represent the log (e.g., icons or markers).
   */
  symbol?: string;

  /**
   * Indicates if the log has additional arguments.
   */
  hasArgs?: boolean;

  /**
   * Indicates whether to add vertical space before this log message.
   */
  hasVerticalSpace?: boolean;
}

/**
 * Extended interface for detailed logging messages with additional options for datetime and message color.
 */
export interface MessageParams extends BaseMessageParams {
  /**
   * Format for displaying the date and time in the log (e.g., DATETIME or CLOCK_TYPE).
   */
  datetimeDisplayType?: CLOCK_TYPE;

  /**
   * Indicates if the log message has a custom color.
   */
  hasMessageColor?: boolean;
}

/**
 * Interface for styling log messages, including the base color and other style-related options.
 */
export interface MessageStyleParams extends BaseMessageParams {
  /**
   * Base color applied to the log message (e.g., error or success messages).
   */
  baseColor?: string;
}
