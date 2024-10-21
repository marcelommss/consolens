/**
 * Enum representing console UI theme options
 */
export enum THEME {
  /**
   * The default UI theme for the console.
   */
  Default = 'DEFAULT',
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
 * Enum representing different group behavior options for displaying logs.
 */
export enum GROUP_BEHAVIOUR {
  /**
   * Group behaves like the standard console.group, logging each message as it comes.
   */
  TRADITIONAL = 'TRADITIONAL',

  /**
   * Immediately displays the group when it starts, showing only logs from that group and hiding other messages.
   */
  // DISPLAY_ON_START = 'DISPLAY_ON_START',

  /**
   * Displays the group messages only after it has finished (requested), hiding the group's logs until the end.
   * Other messages outside the group are shown instantly.
   */
  // DISPLAY_ON_END = 'DISPLAY_ON_END',
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
