import {
  getTagColor,
  loadTagColors,
  saveTagColors,
  resetTagColors,
} from './tags';
import {
  getLoggingConfiguration,
  updateLoggingConfiguration,
} from './configurations';

// Mock the configurations and localStorage
jest.mock('./configurations', () => ({
  getLoggingConfiguration: jest.fn(),
  updateLoggingConfiguration: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    removeItem: (key: string) => delete store[key],
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

describe('Tags Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Default logging configuration mock
    (getLoggingConfiguration as jest.Mock).mockReturnValue({
      loadedTags: false,
      tagColors: {},
      colorCounter: 0,
    });
  });

  it('should load tag colors from localStorage if they exist', () => {
    const storedTagColors = { tag1: '#FF5733', tag2: '#00BFFF' };
    localStorage.setItem('tagColors', JSON.stringify(storedTagColors));

    loadTagColors();

    expect(updateLoggingConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        tagColors: storedTagColors,
        colorCounter: Object.keys(storedTagColors).length,
        loadedTags: true,
      })
    );
  });

  it('should not fail when there are no tag colors in localStorage', () => {
    // No colors in localStorage
    loadTagColors();

    expect(updateLoggingConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        tagColors: {},
        colorCounter: 0,
        loadedTags: true,
      })
    );
  });

  it('should save tag colors to localStorage', () => {
    const mockTagColors = { tag1: '#FF5733', tag2: '#00BFFF' };
    (getLoggingConfiguration as jest.Mock).mockReturnValue({
      loadedTags: true,
      tagColors: mockTagColors,
      colorCounter: 2,
    });

    saveTagColors();

    expect(localStorage.getItem('tagColors')).toEqual(
      JSON.stringify(mockTagColors)
    );
  });

  it('should return the existing color for a tag if it exists', () => {
    const mockTagColors = { tag1: '#FF5733', tag2: '#00BFFF' };
    (getLoggingConfiguration as jest.Mock).mockReturnValue({
      loadedTags: true,
      tagColors: mockTagColors,
      colorCounter: 2,
    });

    const color = getTagColor('tag1');

    expect(color).toBe('#FF5733');
  });

  it('should generate a new color for a tag if it does not exist', () => {
    const mockTagColors = { tag1: '#FF5733' };
    (getLoggingConfiguration as jest.Mock).mockReturnValue({
      loadedTags: true,
      tagColors: mockTagColors,
      colorCounter: 1,
    });

    const color = getTagColor('tag2');

    expect(color).toBe('#00BFFF'); // First color in aquaPalette after tag1
    expect(updateLoggingConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        tagColors: {
          tag1: '#FF5733',
          tag2: '#00BFFF',
        },
        colorCounter: 2,
      })
    );
  });

  it('should reset tag colors and clear localStorage', () => {
    const mockTagColors = { tag1: '#FF5733', tag2: '#00BFFF' };
    (getLoggingConfiguration as jest.Mock).mockReturnValue({
      loadedTags: true,
      tagColors: mockTagColors,
      colorCounter: 2,
    });

    resetTagColors();

    expect(updateLoggingConfiguration).toHaveBeenCalledWith(
      expect.objectContaining({
        tagColors: {},
        colorCounter: 0,
        loadedTags: false,
      })
    );

    expect(localStorage.getItem('tagColors')).toBeNull(); // localStorage should be cleared
  });
});
