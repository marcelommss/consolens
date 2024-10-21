import { LogGroup, LogMessage } from '../types/index';

// Internal groups object
let logGroups: LogGroup[] = [];

/**
 * Recursively finds a group or subgroup within the logGroups array.
 * @param {LogGroup[]} groups - The array of groups or subgroups to search within.
 * @param {string} groupId - The ID of the group we are trying to find.
 * @returns {LogGroup | undefined} - The found LogGroup or undefined if not found.
 */
function findGroupRecursively(
  groups: LogGroup[],
  groupId: string
): LogGroup | undefined {
  for (const group of groups) {
    // Check if this group matches the groupId
    if (group.id === groupId) {
      return group;
    }
    // Recursively search subgroups if they exist
    if (group.children && group.children.length > 0) {
      const foundGroup = findGroupRecursively(group.children, groupId);
      if (foundGroup) {
        return foundGroup;
      }
    }
  }
  return undefined; // Return undefined if group not found
}

/**
 * Adds a new message to the appropriate group and updates logGroups.
 * If the group or parentGroup doesn't exist, they are created.
 *
 * @param {LogMessage} message - The log message to be added.
 */
export function addMessage(message: LogMessage): void {
  // Validation: Ensure the group and parentGroup values are valid
  if (message.group?.trim() === '') message.group = undefined;
  if (message.parentGroup?.trim() === '') message.parentGroup = undefined;

  // Validation: Ensure parentGroup cannot exist without a group
  if (message.parentGroup && !message.group) {
    message.group = message.parentGroup;
    message.parentGroup = undefined;
  }

  // Validation: Ensure group and parentGroup are not the same
  if (
    message.parentGroup &&
    message.group &&
    message.parentGroup === message.group
  ) {
    message.parentGroup = undefined;
  }

  // Return if no group is provided
  if (!message.group) return;

  let messageGroup: LogGroup | undefined;

  // Handle parentGroup (subgroup scenario)
  if (message.parentGroup) {
    let parentGroup = findGroupRecursively(logGroups, message.parentGroup);

    if (!parentGroup) {
      // If parentGroup doesn't exist, create it
      parentGroup = {
        id: message.parentGroup,
        children: [],
        messages: [],
        level: 1,
      };
      logGroups.push(parentGroup);
    }

    // Find or create the subgroup inside the parentGroup
    messageGroup = findGroupRecursively(
      parentGroup.children || [],
      message.group
    );
    if (!messageGroup) {
      messageGroup = {
        id: message.group,
        messages: [],
        level: parentGroup.level + 1,
      };
      parentGroup.children = parentGroup.children ?? [];
      parentGroup.children.push(messageGroup);
    }
  } else {
    // Handle as a top-level group message
    messageGroup = findGroupRecursively(logGroups, message.group);
    if (!messageGroup) {
      messageGroup = { id: message.group, messages: [], level: 1 };
      logGroups.push(messageGroup);
    }
  }

  // Add the message to the group
  messageGroup.messages.push(message);
}

/**
 * Gets all the groups from logGroups and clears the stack.
 * @returns {LogGroup[]} - Returns an array of all LogGroups with their messages.
 */
function getAllGroups(): LogGroup[] {
  const allGroups = [...logGroups]; // Shallow copy of logGroups
  logGroups = []; // Clear logGroups stack
  return allGroups;
}

/**
 * Gets a specific group by ID and removes it from logGroups.
 * If no ID is provided, returns the first group.
 *
 * @param {string} [id] - The ID of the group to read messages from.
 * @returns {LogGroup | undefined} - Returns the found LogGroup or undefined if not found.
 */
function getGroup(id?: string): LogGroup | undefined {
  if (logGroups.length === 0) {
    return undefined; // No groups in the stack
  }

  if (id) {
    // Find the index of the group with the given ID
    const groupIndex = logGroups.findIndex((group) => group.id === id);
    if (groupIndex === -1) return undefined;

    // Remove and return the group
    const [foundGroup] = logGroups.splice(groupIndex, 1);
    return foundGroup;
  }

  // If no ID is provided, return and remove the first group
  return logGroups.shift();
}

/**
 * Recursively finds all messages within a group and its subgroups.
 * @param {LogGroup} group - The log group object containing all the messages.
 * @returns {LogMessage[]} - An array of all LogMessages in the group and its subgroups.
 */
const findGroupMessages = (group: LogGroup): LogMessage[] => {
  const messages: LogMessage[] = [];

  // Add messages from the group
  if (group.messages) {
    messages.push(...group.messages);
  }

  // Recursively add messages from subgroups
  if (group.children) {
    for (const subGroup of group.children) {
      messages.push(...findGroupMessages(subGroup));
    }
  }

  return messages;
};

/**
 * Gets all messages of a group by its ID.
 * If no groupId is provided, returns the messages of the first group.
 *
 * @param {string} [groupId] - The group identifier.
 * @returns {LogMessage[]} - Returns an array of LogMessages for the specified group.
 */
export const getGroupMessages = (groupId?: string): LogMessage[] => {
  const group = getGroup(groupId);
  return group ? findGroupMessages(group) : [];
};

/**
 * Gets all messages from all groups.
 * Clears the logGroups stack after reading.
 *
 * @returns {LogMessage[]} - Returns an array of all LogMessages from all groups.
 */
export const getAllMessages = (): LogMessage[] => {
  const groups = getAllGroups();
  if (!groups.length) return []; // Early return if no groups
  const messages: LogMessage[] = [];
  groups.forEach((group) => messages.push(...findGroupMessages(group)));
  return messages;
};
