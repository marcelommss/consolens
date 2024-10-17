import {
  getLoggingConfiguration,
  updateLoggingConfiguration,
} from './configurations';
import { LoggingConfiguration } from './types';

const aquaPalette = [
  '#00BFFF', // Deep Sky Blue
  '#6A5ACD', // Slate Blue (Purple)
  '#00FF7F', // Spring Green (Emerald)
  '#00CED1', // Dark Turquoise
  '#8A2BE2', // Blue Violet (Purple)
  '#5F9EA0', // Cadet Blue
  '#A52A2A', // Brown
  '#40E0D0', // Turquoise
  '#48D1CC', // Medium Turquoise
  '#D2691E', // Chocolate (Brown)
  '#9370DB', // Medium Purple
  '#00FFFF', // Aqua
  '#4682B4', // Steel Blue
  '#7FFFD4', // Aquamarine
  '#20B2AA', // Light Sea Green
  '#8B4513', // Saddle Brown
  '#008B8B', // Dark Cyan
  '#B0E0E6', // Powder Blue
  '#4B0082', // Indigo (Purple)
];

/**
 * Loads tag colors from localStorage into masterLoggingConfig.
 * This function sets the `loaded` property of masterLoggingConfig to true after completion.
 */
const loadTagColors = () => {
  try {
    // resetTagColors();
    const config = { ...getLoggingConfiguration() } as LoggingConfiguration;
    const savedTagColors = localStorage.getItem('tagColors');

    if (savedTagColors) {
      Object.assign(config.tagColors, JSON.parse(savedTagColors));
      config.colorCounter = Object.keys(config.tagColors).length;
    }

    updateLoggingConfiguration({
      ...config,
      loadedTags: true,
    });
  } catch (error) {}
};

/**
 * Saves the current tag colors from masterLoggingConfig into localStorage.
 * This function ensures that any newly generated tag colors are persisted across sessions.
 */
const saveTagColors = () => {
  const masterLoggingConfig = getLoggingConfiguration();
  localStorage.setItem(
    'tagColors',
    JSON.stringify(masterLoggingConfig.tagColors)
  );
};

/**
 * Retrieves or generates a consistent color for a given tag.
 *
 * @param {string} tag - The tag for which to retrieve or generate a color.
 * @returns {string} - The color associated with the tag.
 *
 * If the tag already has an assigned color in masterLoggingConfig, it will return that color.
 * Otherwise, a new color is generated from the aqua palette, and the `colorCounter` is incremented.
 */
const getTagColor = (tag: string): string => {
  const masterLoggingConfig = getLoggingConfiguration();
  if (!Object.keys(masterLoggingConfig.tagColors).length) loadTagColors();

  if (masterLoggingConfig.tagColors[tag])
    return masterLoggingConfig.tagColors[tag];

  const color =
    aquaPalette[masterLoggingConfig.colorCounter % aquaPalette.length];
  masterLoggingConfig.tagColors[tag] = color;
  masterLoggingConfig.colorCounter++;
  saveTagColors();

  return color;
};

/**
 * Resets all tag colors by clearing the tagColors mapping, resetting the colorCounter,
 * and removing any saved colors from localStorage.
 */
const resetTagColors = () => {
  const config = { ...getLoggingConfiguration() };

  // Clear the tagColors object
  config.tagColors = {};

  // Reset the color counter
  config.colorCounter = 0;

  // Remove stored tag colors from localStorage
  localStorage.removeItem('tagColors');

  // Mark the configuration as not loaded, since colors are now reset
  config.loadedTags = false;

  updateLoggingConfiguration(config);
};

export { getTagColor, loadTagColors, saveTagColors, resetTagColors };
