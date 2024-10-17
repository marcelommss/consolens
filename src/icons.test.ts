import { findSymbol, KEYWORD_TYPES } from './icons';

describe('findSymbol - Load and Location Icons', () => {
  it('should return the correct symbol for load-related keywords', () => {
    const resultLoadItems = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['loaditems'],
    });
    expect(resultLoadItems).toBe('⏳'); // loaditems maps to ⏳

    const resultLoading = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['loading'],
    });
    expect(resultLoading).toBe('⏳'); // loading maps to ⏳

    const resultLoaded = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['loaded'],
    });
    expect(resultLoaded).toBe('⏳✔️'); // loaded maps to ⏳✔️
  });

  it('should return the correct symbol for location-related keywords', () => {
    const resultLocation = findSymbol({
      type: KEYWORD_TYPES.CONTEXT,
      args: ['location'],
    });
    expect(resultLocation).toBe('📌'); // location maps to 📌

    const resultPinned = findSymbol({
      type: KEYWORD_TYPES.CONTEXT,
      args: ['pinned'],
    });
    expect(resultPinned).toBe('📌'); // pinned maps to 📌
  });
});

describe('findSymbol', () => {
  it('should return the correct symbol for action result keywords', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['fetch'],
    });
    expect(result).toBe('📦'); // fetch maps to 📦
  });

  it('should return the correct symbol for context keywords', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.CONTEXT,
      args: ['financial'],
    });
    expect(result).toBe('💵'); // financial maps to 💵
  });

  it('should prioritize action result keywords over context when type is ALL', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ALL,
      args: ['fetch', 'financial'],
    });
    expect(result).toBe('📦'); // fetch is in action result and is prioritized
  });

  it('should return undefined for unknown keywords', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ALL,
      args: ['unknownKeyword'],
    });
    expect(result).toBeUndefined();
  });

  it('should return the correct symbol for multiple matching keywords', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['select', 'next'],
    });
    expect(result).toBe('🔘'); // select comes first in the keywordMappings, so it's prioritized
  });

  it('should return undefined when args are empty', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ALL,
      args: [],
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined if no matching keyword is found for the specified type', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['nonexistent'],
    });
    expect(result).toBeUndefined();
  });

  it('should match against partial strings', () => {
    const result = findSymbol({
      type: KEYWORD_TYPES.ACTION_RESULTS,
      args: ['fetchData'],
    });
    expect(result).toBe('📦'); // fetch should be found in 'fetchData'
  });
});
