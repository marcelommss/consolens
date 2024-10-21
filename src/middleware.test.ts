import { interceptConsoleLogs } from './middleware';
import { logDevInfo, logWarning, logError } from './logging';

jest.mock('./logging', () => ({
  logDevInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
}));

describe('Console Log Interception Middleware', () => {
  beforeEach(() => {
    // Reset the mock functions and intercept the console logs before each test
    jest.clearAllMocks();
    interceptConsoleLogs();
  });

  it('should call logDevInfo when console.log is used', () => {
    console.log('Test log message', { additionalData: true });

    expect(logDevInfo).toHaveBeenCalledWith({
      source: expect.any(String), // Source file and line number
      functionName: 'console.log',
      message: 'Test log message',
      args: [{ additionalData: true }],
    });
  });

  it('should call logWarning when console.warn is used', () => {
    console.warn('Test warning message', { warningData: true });

    expect(logWarning).toHaveBeenCalledWith({
      source: expect.any(String), // Source file and line number
      functionName: 'console.warn',
      message: 'Test warning message',
      args: [{ warningData: true }],
    });
  });

  it('should call logError when console.error is used', () => {
    console.error('Test error message', { errorData: true });

    expect(logError).toHaveBeenCalledWith({
      source: expect.any(String), // Source file and line number
      functionName: 'console.error',
      message: 'Test error message',
      args: [{ errorData: true }],
    });
  });

  it('should prevent recursion and call the original console.log', () => {
    const originalLog = jest.spyOn(global.console, 'log');

    // Ensure that logDevInfo is called
    console.log('Test recursion prevention', { additionalData: true });
    expect(logDevInfo).toHaveBeenCalled();

    // Simulate a call within logDevInfo to ensure recursion is prevented
    logDevInfo({
      source: 'TestSource',
      functionName: 'logDevInfo',
      message: 'Simulated internal log',
      args: [],
    });

    expect(originalLog).toHaveBeenCalledWith({
      source: 'TestSource',
      functionName: 'logDevInfo',
      message: 'Simulated internal log',
      args: [],
    });

    originalLog.mockRestore(); // Restore original console.log
  });

  it('should prevent recursion and call the original console.warn', () => {
    const originalWarn = jest.spyOn(global.console, 'warn');

    // Ensure that logWarning is called
    console.warn('Test recursion prevention', { warningData: true });
    expect(logWarning).toHaveBeenCalled();

    // Simulate a call within logWarning to ensure recursion is prevented
    logWarning({
      source: 'TestSource',
      functionName: 'logWarning',
      message: 'Simulated internal warning',
      args: [],
    });

    expect(originalWarn).toHaveBeenCalledWith({
      source: 'TestSource',
      functionName: 'logWarning',
      message: 'Simulated internal warning',
      args: [],
    });

    originalWarn.mockRestore(); // Restore original console.warn
  });

  it('should prevent recursion and call the original console.error', () => {
    const originalError = jest.spyOn(global.console, 'error');

    // Ensure that logError is called
    console.error('Test recursion prevention', { errorData: true });
    expect(logError).toHaveBeenCalled();

    // Simulate a call within logError to ensure recursion is prevented
    logError({
      source: 'TestSource',
      functionName: 'logError',
      message: 'Simulated internal error',
      args: [],
    });

    expect(originalError).toHaveBeenCalledWith({
      source: 'TestSource',
      functionName: 'logError',
      message: 'Simulated internal error',
      args: [],
    });

    originalError.mockRestore(); // Restore original console.error
  });
});
