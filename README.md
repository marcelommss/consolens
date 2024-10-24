# Consolens

**Consolens** is a customizable logging package for JavaScript/TypeScript projects that enhances console logging with structured messages, auto-tagging, contextual information, and custom icons. It provides advanced features like development-only logs, styled headers, and middleware for intercepting default console logs.

![consolens example](https://github.com/marcelommss/consolens/blob/main/consolensexample.png?raw=true)

---

### VS CODE EXTENSION

Enhance consolens usage by taking advantage of our cool snippets extensions on VS CODE:
   `consolens-snippets`

https://marketplace.visualstudio.com/items?itemName=Hackem.consolens-snippets

---

## Features

- **Improved console UI**: Massivelly improves the readability of your logs with a much cleanner, spaced and informative UI.
- **Dynamic informations**: Automatically designs your log based on the context and informations, dynamically providing unique symbols and behaviours to your logs.
- **Tagging and Context**: Auto-tag logs with colors for easy identification; context info.
- **Customizable output**: Modify colors, tags, and formatting for logs.
- **Development logging**: Choose which logs are going to appear only in  development environments.
- **Formatted headers and callouts**: Create structured, styled log headers and callouts with icons.
- **Frameworks identification**: Automatic creation of framwework specific info.
- **Enhanced Grouping!**: Enhanced grouping with multiple groups amd multiple levels, enabling concurrent groups, choose the behaviour that works best for you!
    Enhanced grouping of three types:
  - at start: only show group messages, holding other messages until the grouping ends
  - at end: show group messages only when the group ends and showGroup is triggered
  - traditional: as common console.group, all messages are displayed inside a group when grouping starts
- **Middleware interception**: Automatically intercept and handle `console.log`, `console.warn`, and `console.error` calls.
- **Full TypeScript support**: Leverage powerful type definitions with rich autocompletion and documentation.

---

## Table of Contents

- [Consolens](#consolens)
      - [Breaking Changes](#breaking-changes)
  - [Features](#features)
    - [VS CODE INTEGRATION](#vs-code-integration)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Setup](#basic-setup)
    - [How to log with Consolens](#how-to-log-with-consolens)
      - [\*Dynamic information detection](#dynamic-information-detection)
  - [Logging Functions](#logging-functions)
      - [log](#log)
      - [logInfo, logWarn, logError](#loginfo-logWarn-logerror)
      - [Dev functions](#dev-functions)
  - [Context](#context)
      - [How Context works](#how-context-works)
      - [Example](#example)
  - [TAGS](#tags)
    - [How Tags Work](#how-tags-work)
    - [Example:](#example-1)
  - [Dynamic Symbols ⭐](#dynamic-symbols-)
  - [Grouping Logs](#grouping-logs)
    - [Displaying Groups](#displaying-groups)
    - [How it works](#how-it-works)
  - [Framework specicific](#framework-specicific)
  - [Headers](#headers)
  - [Callouts](#callouts)
  - [Dividers](#dividers)
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
or
yarn add consolens
or
pnpm add consolens
```

---

## Usage

### Basic Setup

You can change the configuration of consolens at any time by:

```typescript
import { setupLogging } from 'consolens';

// Set up consolens configuration
setupLogging({
  // log in multiple lines to facilitate reading
  multiline: true, 
  // show value's titles like(message, args, function)
  displayTitles: true, 
  // enables middleware interception of logs
  interceptLogs: true, 
  // display style for date and time in logs
  datetimeDisplayType: CLOCK_TYPE.TIME, 
  // sets the default size of header text
  defaultHeaderSize: LOG_HEADER_TYPE.H3, 
  // sets the default size of callout text
  defaultCalloutSize: LOG_HEADER_TYPE.H4, 
  // color of the callout border
  defaultCalloutBorder: '#FFFFFF55', 
});
```

or skip this step if you want the default configuration:
```typescript
  interceptLogs: false,
  multiline: true, 
  displayTitles: true, 
  datetimeDisplayType: CLOCK_TYPE.DATETIME,
```

To intercept default console entries, you must call setupLogging on your system start with interceptLogs: true or call interceptLogs(true).

---

## Logging Functions

#### logInfo, logWarn, logError

Type specific functions *recommended*

```typescript
import { logInfo, logWarn, logError } from 'consolens';

// this will create a console log
// same as logInformation
logInfo({
  message: 'Application initialized successfully!',
});

// this will create a console warn
// same as logWarning
logWarn({
  message: 'Attention, this feature will be disabled soon!',
});

// this will create a console error passing the error as parameter
logError({
  message: 'There was an error while loading data',
  args: [error],
});

```

---

#### log
Create a log where you define the type: INFORMATION, ERROR or WARNING.

```typescript
import { log } from 'consolens';

// Simple information log
loglens({
  message: 'paginationData has changed',
});

// Warning on user authentication failure
// loglens and log are the same and both recognized functions on consolens,
// optional context parameter
// but we recommend the use of loglens for easier sepparation and identification
loglens({
  type: LOG_TYPE.WARNING
  message: 'Authenticate user failed',
  context: 'AUTH',
  args: [paginationData, argum]
});
```

---

#### Dev functions

This functions will only log during development mode.

```typescript
import { logDevInfo, logDevWarn, logDevError } from 'consolens';

// Information log: Logs informational messages with optional metadata such as source, function name, message, and more.
logDevInfo({
  message: 'Application initialized successfully!',
  tags: ['init', 'app'],
});

// Warning log: Logs warnings with metadata such as source, function name, message, and more.
logDevWarn({
  message: 'Data fetch returned incomplete results.',
  tags: ['fetch', dataObject],
});

// Error log: Logs errors with metadata, providing detailed information and arguments.
logDevError({
  message: 'Error processing data.',
  args: [error],
  tags: ['error', 'processing'],
});
```

---

### How to log with Consolens

All logging functions have the following optional parameters that help format the console entry UI:

- **`message?`**: A string providing a log message.

- **`args?`**: Additional arguments or data to log, such as responses, objects, or any other relevant information. Can accept any type or an array of any types.

- **`messageColor?`**: A custom color for the log message. This allows you to apply custom styling to logs, making it easier to visually distinguish them in the console.

- **`line?`**: The line number where the log occurred. Helps in pinpointing the exact line of code responsible for the log.

- **`context?`**: Additional context information relevant to the log message. This can be used to provide extra details about the log.

- **`tags?`**: An array of tags used to categorize the log message (e.g., `['performance', 'api']`). This can help in filtering or grouping logs by category.

- **`group?`**: Used to group log messages and display them together. By default, messages with a group are hidden initially and can be displayed together using `logGroup`.

- **`parentGroup?`**: Indicates if the group belongs to another parent group. `Consolens` automatically detects subgroups, but if a subgroup hasn’t been created yet, you must specify its parent group when logging for the first time.

- **`groupColor?`**: A boolean indicating whether this group should receive a background color with transparency. Each group will have a unique color, defined dynamically by Colorlens. The default is `false`.

- * **`source?`**: (automatic information) The source file or component emitting the log (e.g., `'App.tsx'`). This helps identify where the log was generated.

- * **`functionName?`**: (automatic information) The name of the function that generated the log (e.g., `'fetchData'`). Useful for tracing the log back to a specific function.

- * **`isEffect?`**:(automatic information) A boolean indicating whether this log is related to a side effect. Helps categorize logs that are tied to asynchronous actions or state changes. 

#### *Dynamic information detection

(automatic information)
 We have created a functionallity that detects automatically the multiple informations,
 But if the code is minified and without any sourceMap,
  these informations that are mapped from key-names can not be identied.
 So, if you still want to see the correct source(filename) and functionName,
  you can use the following properties for that. 
  Like this example:

```typescript
// this will always show the filename and functionName, despite minification
loglens({
  source: 'App.tsx',
  functionName: 'startApp',
)}

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
  message: 'User authentication failed.',
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
  message: 'Data successfully fetched from API.',
  tags: ['api', 'fetch', 'data'],
});
```

In this example, the log message includes three tags: api, fetch, and data. Each tag will be consistently colored across your logs, making it easier to follow related log entries.

Each tag receives a dynamic color. Recurring tags keeps the same color everytime. 

---

## Dynamic Symbols ⭐

**Consolens** allows you to enhance your log messages with **Dynamic Symbols**, which are automatically selected based on the context, log type, source file, functions name, message or custom tags provided. This makes it easier to understand the nature of the log at a glance, whether it's informational, a warning, or an error.

- **Icons are automatically chosen** based on certain keywords, tags, or the log type (INFO, WARNING, ERROR).
- Icons help you visually distinguish log entries, making the console output more readable and engaging.

---

## Grouping Logs

**Consolens** provides the ability to group log messages into logical units, making your console output more organized and readable.

A **LogGroup** is a collection of related log messages grouped under a single title, enhancing the console UI by visually separating these groups. Any log messages assigned to a group are hidden by default and are only displayed when the entire group is shown.

This is still a beta function.. 
  ...We are releasing the final version still in 10/2024

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

## Dividers

You can create dividers on console to facilitate separation of informations.

```typescript
import { logDivider } from 'consolens';

//optionally you can pass a custom char and the length of the divider

logDivider();

```
This will print a divider on console:

===========================

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
  message: 'Application has started successfully.',
  tags: ['start', 'app'],
});
```

---

**Important‼️** 
### Breaking Changes 

We have moved description property to message, so it could be more logically aligned to console information purposes:

| log.**description** | parameter has changed to log.**message** |

---

## UPCOMING FEATURES

We are constantly improving our package, so these are a few things that what you could expect for the next releases:

- ✅ Simples log(without typed parameters / any)
  - ✅ message and args recognition

- ☐ Setup configuration
  -  ✅ complete configurations
     - ✅ toggle multilne
     - ✅ toggle properties titles
    - ☐ switch group behavior
      - ☐ tradional
      - ☐ show on start
      - ☐ show on end(requested)
    - ☐ switch group display
      - ☐ default
      - ☐ rounded centered
      - ☐ squared anchored right
  - ☐ Theming 🎨
    - ☐ at least 4 options of themes

- ☐ enhanced grouping
  - ✅ TRADITIONAL
  - ☐ DISPLAY_ON_START
  - ☐ DISPLAY_ON_END

- ✅ snippets for VS Code 
  - ✅ consoles-snippets for VS Code (released) 
  - ☐ framework focused snippets 

- ✅ Automatic informations(source, line, functions)
  - ☐ Framework hooks identification

- ☐ source file openning

We are also working on:
- ☐ consolens website - tutorials, examples and documentation (work in-progress)
- ☐ youtube guidance video
- ☐ a codelens-examples repository on github
- ☐ a Chrome extension -> consolens to all sites 

- ☐ Fix know issues
  - ✅ default console log tracing

---

## LICENCE

Consolens is open-source software, released under the MIT License.

---

## Contributions

We welcome contributions! If you'd like to report an issue or submit a pull request, please visit the GitHub repository.

---

## Questions or Feedback?

Feel free to reach out to the maintainers through the GitHub Issues page for any questions or feedback.