import { addMessage, getGroupMessages, getAllMessages } from './groups';
import { LogMessage } from '../types/index';
import { LOG_TYPE } from '../types'; // Assuming LOG_TYPE is defined in logTypes

describe('Group functionality', () => {
  beforeEach(() => {
    // Reset the internal state before each test
    (globalThis as any).logGroups = [];
  });

  test('should add a message to a new top-level group', () => {
    const message: LogMessage = {
      group: 'group1',
      message: 'Test Message 1', // Correct field from LogMessage
      type: LOG_TYPE.INFORMATION,
    };
    addMessage(message);

    const groupMessages = getGroupMessages('group1');
    expect(groupMessages).toHaveLength(1);
    expect(groupMessages[0].message).toBe('Test Message 1');
  });

  test('should add a message to a parent group and a subgroup', () => {
    const message: LogMessage = {
      group: 'subgroup1',
      parentGroup: 'parentGroup',
      message: 'Subgroup Description',
      type: LOG_TYPE.INFORMATION,
    };
    addMessage(message);

    const groupMessages = getGroupMessages('subgroup1');
    expect(groupMessages).toHaveLength(1);
    expect(groupMessages[0].message).toBe('Subgroup Description');
  });

  test('should add multiple messages to the same group', () => {
    const message1: LogMessage = {
      group: 'group2',
      message: 'Test Message 1',
      type: LOG_TYPE.INFORMATION,
    };
    const message2: LogMessage = {
      group: 'group2',
      message: 'Test Message 2',
      type: LOG_TYPE.ERROR, // Different type
    };
    addMessage(message1);
    addMessage(message2);

    const groupMessages = getGroupMessages('group2');
    expect(groupMessages).toHaveLength(2);
    expect(groupMessages[0].message).toBe('Test Message 1');
    expect(groupMessages[1].message).toBe('Test Message 2');
  });

  test('should return all messages from all groups', () => {
    const message1: LogMessage = {
      group: 'group1',
      message: 'Test Message 1',
      type: LOG_TYPE.INFORMATION,
    };
    const message2: LogMessage = {
      group: 'group2',
      message: 'Test Message 2',
      type: LOG_TYPE.WARNING,
    };
    addMessage(message1);
    addMessage(message2);

    const allMessages = getAllMessages();
    expect(allMessages).toHaveLength(2);
    expect(allMessages[0].message).toBe('Test Message 1');
    expect(allMessages[1].message).toBe('Test Message 2');
  });

  test('should handle subgroups correctly', () => {
    const message1: LogMessage = {
      group: 'subgroup1',
      parentGroup: 'group1',
      message: 'Subgroup Message 1',
      type: LOG_TYPE.INFORMATION,
    };
    const message2: LogMessage = {
      group: 'subgroup2',
      parentGroup: 'subgroup1',
      message: 'Subgroup Message 2',
      type: LOG_TYPE.ERROR,
    };

    addMessage(message1);
    addMessage(message2);

    const groupMessages1 = getGroupMessages('subgroup1');
    const groupMessages2 = getGroupMessages('subgroup2');

    expect(groupMessages1).toHaveLength(1);
    expect(groupMessages1[0].message).toBe('Subgroup Message 1');

    expect(groupMessages2).toHaveLength(1);
    expect(groupMessages2[0].message).toBe('Subgroup Message 2');
  });
});
