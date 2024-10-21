# Consolens

**Consolens** is a customizable logging package for JavaScript/TypeScript projects that enhances console logging with structured messages, auto-tagging, contextual information, and custom icons. It provides advanced features like development-only logs, styled headers, and middleware for intercepting default console logs.

![consolens example](https://github.com/marcelommss/consolens/blob/main/consolensexample.png?raw=true)

## Features

- **Dynamic informations**: Automatically designs your log based on the context and its informations, dynamically providing unique symbols and behaviours to your logs.
- **Improved console UI**: Massivelly improves the readability of your logs with a much cleanner, space UI.
- **Enhanced Grouping!**: Enhanced grouping with multiple groups amd multiple levels, choose the behaviour that works best for you!
    Enhanced grouping of three types:
  - at start: only show group messages, holding other messages until the grouping ends
  - at end: show group messages only when the group ends and showGroup is triggered
  - traditional: as common console.group, all messages are displayed inside a group when grouping starts
- **Customizable output**: Modify colors, tags, and formatting for logs.
- **Development logging**: Choose which logs are going to appear only in  development environments.
- **Tagging**: Auto-tag logs with colors for easy identification.
- **Formatted headers**: Create structured, styled log headers for readability.
- **Full TypeScript support**: Leverage powerful type definitions with rich autocompletion and documentation.
- **Middleware interception**: Automatically intercept and handle `console.log`, `console.warn`, and `console.error` calls.
- **Non-intrusive**: Bypass middleware interception for specific logs, such as styled headers.

---

### VS CODE INTEGRATION

We have recently launched our cool snippets extensions on VS CODE:
   `consolens-snippets`

https://marketplace.visualstudio.com/items?itemName=Hackem.consolens-snippets

---

## Table of Contents

- [Consolens](#consolens)
  - [Features](#features)
    - [VS CODE INTEGRATION](#vs-code-integration)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Setup](#basic-setup)
    - [How to log with Consolens](#how-to-log-with-consolens)
  - [Logging Functions](#logging-functions)
      - [log](#log)
      - [logInfo, logWarning, logError](#loginfo-logwarning-logerror)
      - [Dev functions](#dev-functions)
  - [Context](#context)
      - [How Context works](#how-context-works)
      - [Example](#example)
  - [TAGS](#tags)
    - [How Tags Work](#how-tags-work)
    - [Example:](#example-1)
  - [Dynamic Symbols](#dynamic-symbols)
  - [Grouping Logs](#grouping-logs)
    - [Displaying Groups](#displaying-groups)
    - [How it works](#how-it-works)
  - [Framework specicific](#framework-specicific)
  - [Headers](#headers)
  - [Callouts](#callouts)
  - [Configuration](#configuration)
      - [setupLogging](#setuplogging)
        - [CLOCK\_TYPE](#clock_type)
  - [Full Example](#full-example)
  - [UPCOMING FEATURES](#upcoming-features)
  - [LICENCE](#licence)
  - [Contributions](#contributions)
  - [Questions or Feedback?](#questions-or-feedback)

---

## Installation

To install Consolens, run:

```bash
npm install consolens
```

or with Yarn:
```bash
yarn add consolens
```

---

## Usage

### Basic Setup

First, you can configure the logging package:
```typescript
import { setupLogging } from 'consolens';

// Set up the logging configuration
setupLogging({
  // If true middleware interception or false to not interfer on other logs
  interceptLogs: true, 
  //CLOCK_TYPE.TIME: Display only time in logs
  datetimeDisplayType: CLOCK_TYPE.TIME, 
  //LOG_HEADER_TYPE.H2: Sets the size of the header text
  defaultHeaderSize: LOG_HEADER_TYPE.H2, 
  //LOG_HEADER_TYPE.H3: Sets the size of the callout text
  defaultCalloutSize: LOG_HEADER_TYPE.H3, 
  //color of the callout border
  defaultCalloutBorder: '#FFFFFF55', 
});
```

or skip this step if you want the default configuration:
```typescript
  interceptLogs: false,
  //CLOCK_TYPE.DATETIME: Display both date and time in logs
  datetimeDisplayType: CLOCK_TYPE.DATETIME,
```

To intercept default console entries, you must call setupLogging on your system start with interceptLogs: true.

### How to log with Consolens

All logging functions have the following optional parameters that help format the console entry UI:

- **`source?`**: The source file or component emitting the log (e.g., `'App.tsx'`). This helps identify where the log was generated.

- **`functionName?`**: The name of the function that generated the log (e.g., `'fetchData'`). Useful for tracing the log back to a specific function.

- **`isEffect?`**: A boolean indicating whether this log is related to a side effect. Helps categorize logs that are tied to asynchronous actions or state changes.

- **`description?`**: A string providing a description of the log message, explaining its purpose or context.

- **`args?`**: Additional arguments or data to log, such as responses, objects, or any other relevant information. Can accept any type or an array of any types.

- **`messageColor?`**: A custom color for the log message. This allows you to apply custom styling to logs, making it easier to visually distinguish them in the console.

- **`line?`**: The line number where the log occurred. Helps in pinpointing the exact line of code responsible for the log.

- **`context?`**: Additional context information relevant to the log message. This can be used to provide extra details about the log.

- **`tags?`**: An array of tags used to categorize the log message (e.g., `['performance', 'api']`). This can help in filtering or grouping logs by category.

- **`group?`**: Used to group log messages and display them together. By default, messages with a group are hidden initially and can be displayed together using `logGroup`.

- **`parentGroup?`**: Indicates if the group belongs to another parent group. `Consolens` automatically detects subgroups, but if a subgroup hasn’t been created yet, you must specify its parent group when logging for the first time.

- **`groupColor?`**: A boolean indicating whether this group should receive a background color with transparency. Each group will have a unique color, defined dynamically by Colorlens. The default is `false`.

---

## Logging Functions

#### log
Create a log where you define the type: INFORMATION, ERROR or WARNING.

```typescript
import { log } from 'consolens';

// Simple information log
log({
  type: LOG_TYPE.INFORMATION
  source: 'ComponentName',
  description: 'paginationData has changed',
  args: [paginationData]
});

// Warning on user authentication failure
log({
  type: LOG_TYPE.WARNING
  source: 'Login.tsx',
  functionName: 'authentication',
  description: 'Authenticate user failed',
});
```

#### logInfo, logWarning, logError
Logs informational messages with optional metadata such as source, function name, description, and more.

```typescript
import { logInfo, logWarning, logError } from 'consolens';

// this will create a consolens log
logInfo({
  source: 'App.tsx',
  functionName: 'initializeApp',
  isEffect: true,
  description: 'Application initialized successfully!',
  tags: [loading, error],
});
```

#### Dev functions
This functions will only log during development mode.

```typescript
import { logDevInfo, logDevWarning, logDevError } from 'consolens';

// Information log: Logs informational messages with optional metadata such as source, function name, description, and more.
logDevInfo({
  source: 'App.tsx',
  functionName: 'initializeApp',
  description: 'Application initialized successfully!',
  tags: ['init', 'app'],
});

// Warning log: Logs warnings with metadata such as source, function name, description, and more.
logDevWarning({
  source: 'App.tsx',
  functionName: 'fetchData',
  description: 'Data fetch returned incomplete results.',
  tags: ['fetch', dataObject],
});

// Error log: Logs errors with metadata, providing detailed information and arguments.
logDevError({
  source: 'App.tsx',
  functionName: 'processData',
  description: 'Error processing data.',
  args: [error],
  tags: ['error', 'processing'],
});
```

---

## Context

The **Context** feature allows you to include additional information about the environment or specific part of your application where a log entry occurs. Context can help narrow down the scope of a log, providing more clarity when reading through multiple logs or debugging complex systems.
You can create only one context, that is always a yellow chip.

#### How Context works

- Context is a string that you can define to indicate a certain part of the application or an environment, such as auth, dashboard, or network.
- It is displayed prominently in the log output to give immediate insight into where the log message originated.
- This can be useful for filtering or grouping logs that are related to specific parts of your codebase.

#### Example

```typescript
logInfo({
  source: 'LoginPage.tsx',
  functionName: 'authenticateUser',
  description: 'User authentication failed.',
  context: 'auth',
});
```

---

## TAGS

Tags in **Consolens** allow you to categorize and highlight specific log entries. Each tag is automatically assigned a color from the palette, making it easier to visually scan through logs and identify related entries. Tags can represent various components, features, or categories within your application, such as `auth`, `api`, `fetch`, or `error`.

### How Tags Work
- Tags are automatically assigned colors from the palette, ensuring consistent visuals for the same tag.
- You can pass multiple tags to a single log entry, allowing finer-grained categorization.
- Tags are stored and re-used between logs to maintain color consistency across sessions.

### Example:
```typescript
logDevInfo({
  source: 'Component.tsx',
  functionName: 'getData',
  description: 'Data successfully fetched from API.',
  tags: ['api', 'fetch', 'data'],
});
```

In this example, the log message includes three tags: api, fetch, and data. Each tag will be consistently colored across your logs, making it easier to follow related log entries.

Each tag receives a dynamic color. Recurring tags keeps the same color everytime. 

---

## Dynamic Symbols

**Consolens** allows you to enhance your log messages with **Dynamic Symbols**, which are automatically selected based on the context, log type, source file, functions name, description or custom tags provided. This makes it easier to understand the nature of the log at a glance, whether it's informational, a warning, or an error.

- **Icons are automatically chosen** based on certain keywords, tags, or the log type (INFO, WARNING, ERROR).
- Icons help you visually distinguish log entries, making the console output more readable and engaging.

---

## Grouping Logs

**Consolens** provides the ability to group log messages into logical units, making your console output more organized and readable.

A **LogGroup** is a collection of related log messages grouped under a single title, enhancing the console UI by visually separating these groups. Any log messages assigned to a group are hidden by default and are only displayed when the entire group is shown.

### Displaying Groups

- To display all messages within a specific group, use the `logGroup(groupId)` function. This will reveal all the messages associated with the specified group.
- To display all groups and their corresponding messages, call `logGroups()`, which outputs every group and its messages at once.

This grouping feature makes it easier to navigate through grouped logs, especially in complex debugging scenarios.

### How it works

Each message that is sent with the `group` and/or `parentGroup` properties is stored in the group stacks. When a group is displayed, all the messages from that group, including any nested subgroups, are shown. After the group is displayed, the stack for that group is cleared.

This ensures that grouped logs are presented in a structured manner, showing all related messages at once, along with any subgroups, before resetting the group stack.

---

## Framework specicific

**Consolens** allows you to integrate with your modern javascript framework.

- **React** if you are logging something inside an useEffect for example, you can set the property *isEffect: true* and you get an especiall identifier on your log. 


---

## Headers

You can create styled headers for better log separation and readability using **logHeader**.

```typescript
import { logHeader, LOG_HEADER_TYPE } from 'consolens';

logHeader({
  title: 'Application Initialization',
  type: LOG_HEADER_TYPE.H1, // Available types: H1, H2, H3, H4, H5
});
```
This will print the header with padding and center it in the console with appropriate font sizes based on the header type.

---

## Callouts

You can create styled headers for better log separation and readability using **logHeader**.

```typescript
import { logCallout, LOG_HEADER_TYPE } from 'consolens';

logCallout({
  title: 'Application Initialization',
  icon: Icons.Cloud, // Available types: H1, H2, H3, H4, H5
});
```
This will print a callout with a title and an icon

---

## Configuration

**Consolens**  allows you to customize your logging setup with the following options:

#### setupLogging

```typescript
setupLogging({
  interceptLogs: true,           // Whether to intercept console logs
  datetimeDisplayType: CLOCK_TYPE.DATETIME,  // Display both date and time in logs
});
```

##### CLOCK_TYPE

- CLOCK_TYPE.DATETIME: Displays both date and time.
- CLOCK_TYPE.DATE: Displays only the date.
- CLOCK_TYPE.TIME: Displays only the time.

---

## Full Example

```typescript
import { setupLogging, logDevInfo, logHeader, LOG_HEADER_TYPE } from 'consolens';

// Set up logging middleware and configuration
setupLogging({
  interceptLogs: true,
  datetimeDisplayType: CLOCK_TYPE.TIME, // Only show time in logs
});

// Create a styled header
logHeader({
  title: 'Application Started',
  type: LOG_HEADER_TYPE.H1,
});

// Log some information
logDevInfo({
  source: 'App.tsx',
  functionName: 'startApp',
  description: 'Application has started successfully.',
  tags: ['start', 'app'],
});
```

---

## UPCOMING FEATURES

We are constantly improving our package, so these are a few things that what you could expect for the next releases:

- Automatic informations(source, line, functions)
- Framework hooks identification
- Framework snippets for VS Code
- Theming 🎨

And of course:
- guide website (work in-progress)
- codelens-examples repository

---

## LICENCE

Consolens is open-source software, released under the MIT License.

---

## Contributions

We welcome contributions! If you'd like to report an issue or submit a pull request, please visit the GitHub repository.

---

## Questions or Feedback?

Feel free to reach out to the maintainers through the GitHub Issues page for any questions or feedback.