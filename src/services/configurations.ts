import { loadTagColors } from './tags';
import {
  CLOCK_TYPE,
  GROUP_BEHAVIOUR,
  LOG_HEADER_TYPE,
  LoggingConfiguration,
  LoggingSetup,
} from '../types/index';
import { logHeader } from '../logging';
import {
  initializeLoggingMiddleware,
  stopLoggingMiddleware,
} from '../middleware';

// Internal master configuration object
const masterLoggingConfig: LoggingConfiguration = {
  datetimeDisplayType: CLOCK_TYPE.DATETIME, // Default value for datetimeDisplayType
  interceptLogs: false, // Default value for interceptLogs
  loadedTags: false, // Indicates if the tag colors have been loaded
  tagColors: {}, // Empty object to store tag colors
  colorCounter: 0, // Counter starts at 0
  multiline: true,
  displayTitles: false,
  defaultHeaderSize: LOG_HEADER_TYPE.H2,
  defaultCalloutSize: LOG_HEADER_TYPE.H3,
  defaultCalloutBorder: '#FFFFFF55',
  defaultGroupBehaviour: GROUP_BEHAVIOUR.TRADITIONAL,
};

/**
 * Gets the current logging configuration.
 * This function can only be used internally within the package.
 *
 * @returns {LoggingConfiguration} The current logging configuration.
 */
export function getLoggingConfiguration(): LoggingConfiguration {
  return masterLoggingConfig;
}

/**
 * Updates the logging configuration with the provided configuration values.
 * This function can only be used internally within the package.
 *
 * @returns {LoggingConfiguration} The current logging configuration.
 */
export function updateLoggingConfiguration(config: LoggingConfiguration): void {
  Object.assign(masterLoggingConfig, config);
}

/**
 * Updates the logging configuration with the provided setup values.
 *
 * @param {LoggingSetup} setupConfig - The setup configuration to apply.
 */
export function initializeLogging(setupConfig: LoggingSetup): void {
  Object.assign(masterLoggingConfig, setupConfig);
  if (setupConfig?.interceptLogs) initializeLoggingMiddleware();
  logHeader({
    title: 'Configuration set on Consolens!',
    type: LOG_HEADER_TYPE.H5,
  });
}

/**
 * Sets up the logging interception.
 *
 * @param {boolean} enableInterception - Configuration object to set up logging.
 */
export function setupLogInterception(enableInterception: boolean): void {
  Object.assign(masterLoggingConfig, {
    ...masterLoggingConfig,
    interceptLogs: enableInterception,
  });
  if (enableInterception) {
    initializeLoggingMiddleware();
  } else {
    stopLoggingMiddleware();
  }
}

/**
 * Initializes tags if they haven't been loaded yet.
 * This function checks if tags are loaded and, if not, loads the tag colors.
 */
export function initializeTags(): void {
  const config = getLoggingConfiguration();

  // Check if the tags have already been loaded
  if (!config.loadedTags) loadTagColors();
}
