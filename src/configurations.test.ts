import {
  getLoggingConfiguration,
  updateLoggingConfiguration,
  initializeLogging,
  initializeTags,
} from './configurations';
import { CLOCK_TYPE, LoggingConfiguration, LoggingSetup } from './types';
import { loadTagColors } from './tags'; // Mock this function

jest.mock('./tags', () => ({
  loadTagColors: jest.fn(),
}));

describe('Logging Configuration', () => {
  beforeEach(() => {
    // Reset configuration before each test
    const defaultConfig: LoggingConfiguration = {
      datetimeDisplayType: CLOCK_TYPE.DATETIME,
      interceptLogs: true,
      loadedTags: false,
      tagColors: {},
      colorCounter: 0,
    };

    updateLoggingConfiguration(defaultConfig);
  });

  it('should return the default logging configuration', () => {
    const config = getLoggingConfiguration();
    expect(config.datetimeDisplayType).toBe(CLOCK_TYPE.DATETIME);
    expect(config.interceptLogs).toBe(true);
    expect(config.loadedTags).toBe(false);
    expect(config.tagColors).toEqual({});
    expect(config.colorCounter).toBe(0);
  });

  it('should update the logging configuration with provided setup values', () => {
    const setupConfig: LoggingSetup = {
      interceptLogs: false,
      datetimeDisplayType: CLOCK_TYPE.TIME, // Test datetime display type change
    };

    initializeLogging(setupConfig);
    const config = getLoggingConfiguration();

    expect(config.interceptLogs).toBe(false); // Changed by setupConfig
    expect(config.datetimeDisplayType).toBe(CLOCK_TYPE.TIME); // Should reflect new datetime display type
  });

  it('should load tag colors if tags are not loaded', () => {
    initializeTags();
    const config = getLoggingConfiguration();

    expect(loadTagColors).toHaveBeenCalled();
    expect(config.loadedTags).toBe(true);
  });

  it('should not load tag colors if tags are already loaded', () => {
    // Manually set loadedTags to true
    updateLoggingConfiguration({
      ...getLoggingConfiguration(),
      loadedTags: true,
    });

    initializeTags();
    expect(loadTagColors).not.toHaveBeenCalled();
  });

  it('should update tagColors and colorCounter correctly', () => {
    const currentConfig = getLoggingConfiguration();

    // Update only tagColors and colorCounter by merging with the current config
    const configUpdate: LoggingConfiguration = {
      ...currentConfig, // Ensure all required properties are included
      tagColors: { tag1: '#FF5733' },
      colorCounter: 1,
    };

    updateLoggingConfiguration(configUpdate);
    const config = getLoggingConfiguration();

    expect(config.tagColors).toEqual({ tag1: '#FF5733' });
    expect(config.colorCounter).toBe(1);
  });
});
