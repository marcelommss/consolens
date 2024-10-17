# Consolens

**Consolens** is a customizable logging package for JavaScript/TypeScript projects that enhances console logging with structured messages, auto-tagging, contextual information, and custom icons. It provides advanced features like development-only logs, styled headers, and middleware for intercepting default console logs.

## Features

- 📊 **Development-only logging**: Ensure logs only appear in development environments.
- 🎨 **Customizable output**: Modify colors, tags, and formatting for logs.
- 🔖 **Tagging**: Auto-tag logs with colors for easy identification.
- 🔗 **Middleware interception**: Automatically intercept and handle `console.log`, `console.warn`, and `console.error` calls.
- 📝 **Formatted headers**: Create structured, styled log headers for readability.
- 💡 **Full TypeScript support**: Leverage powerful type definitions with rich autocompletion and documentation.
- 🚀 **Non-intrusive**: Bypass middleware interception for specific logs, such as styled headers.

---

## Table of Contents

- [Consolens](#consolens)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Setup](#basic-setup)
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
  - [Framework specicific](#framework-specicific)
  - [Headers](#headers)
  - [Configuration](#configuration)
      - [setupLogging](#setuplogging)
        - [CLOCK\_TYPE](#clock_type)
  - [Full Example](#full-example)
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
  interceptLogs: true, // Enable middleware interception
  datetimeDisplayType: CLOCK_TYPE.DATETIME, // Display both date and time in logs
});
```

or skip this step if you want the default configuration:
```typescript
  interceptLogs: true,
  datetimeDisplayType: CLOCK_TYPE.DATETIME, 
```

---

## Logging Functions

#### log
Create a log where you define the type: INFORMATION, ERROR or WARNING.

```typescript
import { log } from 'consolens';

// Simple development log
log({
  type: LOG_TYPE.INFORMATION
  source: 'ComponentName',
  isEffect: true,
  description: 'paginationData has changed',
  args: [paginationData]
});

// Warning on user authentication failure
log({
  type: LOG_TYPE.WARNING
  source: 'Login.tsx',
  functionName: 'authentication',
  description: 'Authenticate user failer',
});
```

#### logInfo, logWarning, logError
Logs informational messages with optional metadata such as source, function name, description, and more.

```typescript
import { logInfo, logWarning, logError } from 'consolens';

// Simple development log
logInfo({
  source: 'App.tsx',
  functionName: 'initializeApp',
  description: 'Application initialized successfully!',
  tags: [parameter1, parameter2],
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
  tags: ['fetch', 'data'],
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
logDevWarning({
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

## Framework specicific

**Consolens** allows you to integrate with your modern javascript framework.

- **React** if you are logging something inside an useEffect for example, you can set the property *isEffect: true* and you get an especiall identifier on your log. 
- 

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

## LICENCE

Consolens is open-source software, released under the MIT License.

---

## Contributions

We welcome contributions! If you'd like to report an issue or submit a pull request, please visit the GitHub repository.

---

## Questions or Feedback?

Feel free to reach out to the maintainers through the GitHub Issues page for any questions or feedback.