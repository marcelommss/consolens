import { CLOCK_TYPE, GROUP_BEHAVIOUR, LOG_HEADER_TYPE, THEME } from './options';

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
   * log in multiple lines to facilitate reading.
   * default is true
   */
  multiline?: boolean;

  /**
   * show values titles like(message, args, function).
   * default is true
   */
  displayTitles?: boolean;

  /**
   * Defines how the date and time should be displayed in log messages.
   * Options are CLOCK_TYPE.DATETIME, CLOCK_TYPE.DATE, and CLOCK_TYPE.TIME.
   */
  datetimeDisplayType: CLOCK_TYPE;

  /**
   * Default text size for headers.
   */
  defaultHeaderSize?: LOG_HEADER_TYPE;

  /**
   * Default text size for callouts.
   */
  defaultCalloutSize?: LOG_HEADER_TYPE;

  /**
   * Default border color for callouts.
   */
  defaultCalloutBorder?: string;

  /**
   * Default group behaviour.
   */
  defaultGroupBehaviour?: GROUP_BEHAVIOUR;

  /**
   * Default color theme.
   */
  defaultTheme?: THEME.Default;

  /**
   * Hide consolens path on logging. Default is true.
   */
  hideLoggingPath?: boolean;
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
