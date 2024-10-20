import { loadTagColors } from './tags';
import {
  CLOCK_TYPE,
  GROUP_BEHAVIOUR,
  LOG_HEADER_TYPE,
  LoggingConfiguration,
  LoggingSetup,
} from './types/index';

// Internal master configuration object
const masterLoggingConfig: LoggingConfiguration = {
  datetimeDisplayType: CLOCK_TYPE.DATETIME, // Default value for datetimeDisplayType
  interceptLogs: false, // Default value for interceptLogs
  loadedTags: false, // Indicates if the tag colors have been loaded
  tagColors: {}, // Empty object to store tag colors
  colorCounter: 0, // Counter starts at 0
  defaultHeaderSize: LOG_HEADER_TYPE.H2,
  defaultCalloutSize: LOG_HEADER_TYPE.H3,
  defaultCalloutBorder: '#FFFFFF55',
  defaultGroupBehaviour: GROUP_BEHAVIOUR.DISPLAY_ON_END,
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
