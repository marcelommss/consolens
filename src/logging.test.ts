import {
  logInfo,
  logWarning,
  logError,
  log,
  clearLog,
  getCallingFileName,
  logDev,
} from './logging';
import isDev from './helpers/DevDetect';
import { LOG_TYPE } from './types';

jest.mock('../helpers/DevDetect'); // Mock isDev to control its return value

describe('Logging functions', () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleClearSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleClearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logInfo', () => {
    it('should log an info message with the correct content (ignoring styles)', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is an info log',
        args: ['extraArg1', 'extraArg2'],
        isEffect: false,
        messageColor: '#ff0000',
      };

      logInfo(params);

      // Ensure console.info is called with the correct message and arguments (ignoring styles)
      const logMessage = consoleInfoSpy.mock.calls[0][0]; // Get the first argument (data string)
      expect(logMessage).toContain('sourceFile'); // Ensure sourceFile is present
      expect(logMessage).toContain('myFunction'); // Ensure functionName is present
      expect(logMessage).toContain('This is an info log'); // Ensure description is present
      expect(logMessage).toMatch(/\d{2}:\d{2}:\d{2}/); // Ensure timestamp is present

      // Ensure extra arguments are logged at the correct index (styles are in between)
      expect(
        consoleInfoSpy.mock.calls[0][consoleInfoSpy.mock.calls[0].length - 2]
      ).toBe('extraArg1');
      expect(
        consoleInfoSpy.mock.calls[0][consoleInfoSpy.mock.calls[0].length - 1]
      ).toBe('extraArg2');
    });

    it('should log without a source and function name when they are undefined (ignoring styles)', () => {
      const params = {
        description: 'This is a log without source or function name',
        args: ['extraArg1'],
        isEffect: false,
        messageColor: '#00ff00',
      };

      logInfo(params);

      // Ensure console.info is called with the correct message and arguments (ignoring styles)
      const logMessage = consoleInfoSpy.mock.calls[0][0]; // Get the first argument (data string)
      expect(logMessage).not.toContain('sourceFile'); // Ensure sourceFile is not present
      expect(logMessage).toContain(
        'This is a log without source or function name'
      ); // Ensure description is present
      expect(logMessage).toMatch(/\d{2}:\d{2}:\d{2}/); // Ensure timestamp is present

      // Ensure extra arguments are logged at the correct index
      expect(
        consoleInfoSpy.mock.calls[0][consoleInfoSpy.mock.calls[0].length - 1]
      ).toBe('extraArg1');
    });
  });

  describe('logWarning', () => {
    it('should log a warning message with the correct arguments', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is a warning log',
        args: ['additionalArg1', 'additionalArg2'],
      };

      logWarning(params);

      // Verify the correct call with all expected arguments
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\d{2}:\d{2}:\d{2}/), // Timestamp pattern (HH:MM:SS)
        '[sourceFile]', // Source string
        'This is a warning log', // Description
        'additionalArg1', // First additional argument
        'additionalArg2' // Second additional argument
      );
    });
  });

  describe('logError', () => {
    it('should log an error message with the correct arguments', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is an error log',
        args: ['additionalArg1', 'additionalArg2'],
      };

      logError(params);

      // Verify the correct call with all expected arguments
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\d{2}:\d{2}:\d{2}/), // Timestamp pattern (HH:MM:SS)
        '[sourceFile]', // Source string
        'This is an error log', // Description
        'additionalArg1', // First additional argument
        'additionalArg2' // Second additional argument
      );
    });
  });

  describe('log', () => {
    it('should call logInfo when LOG_TYPE is INFORMATION', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is an info log',
        args: [],
      };

      log(LOG_TYPE.INFORMATION, params);

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should call logWarning when LOG_TYPE is WARNING', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is a warning log',
        args: [],
      };

      log(LOG_TYPE.WARNING, params);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should call logError when LOG_TYPE is ERROR', () => {
      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is an error log',
        args: [],
      };

      log(LOG_TYPE.ERROR, params);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('logDev', () => {
    it('should log in dev mode when isDev returns true', () => {
      (isDev as jest.Mock).mockReturnValue(true);

      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is a dev log',
        args: [],
      };

      logDev(LOG_TYPE.INFORMATION, params);

      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should not log in production mode when isDev returns false', () => {
      (isDev as jest.Mock).mockReturnValue(false);

      const params = {
        source: 'sourceFile',
        functionName: 'myFunction',
        description: 'This is a dev log',
        args: [],
      };

      logDev(LOG_TYPE.INFORMATION, params);

      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });
  });

  describe('clearLog', () => {
    it('should clear the console log', () => {
      clearLog();

      expect(consoleClearSpy).toHaveBeenCalled();
    });
  });

  describe('getCallingFileName', () => {
    it('should return the correct file name and line number from the stack trace', () => {
      const mockStack = `
        Error
            at Object.<anonymous> (/path/to/file.js:10:20)
            at Module._compile (internal/modules/cjs/loader.js:1158:30)
      `;
      jest
        .spyOn(global, 'Error')
        .mockImplementation(() => ({ stack: mockStack } as any));

      const result = getCallingFileName();
      expect(result).toBe('/path/to/file.js:10:20');
    });

    it('should return null if no stack trace is available', () => {
      jest
        .spyOn(global, 'Error')
        .mockImplementation(() => ({ stack: undefined } as any));

      const result = getCallingFileName();
      expect(result).toBeNull();
    });
  });
});
