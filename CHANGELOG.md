# Changelog

## [1.1.1] - 2024-10-24
### Added
- Added `hideLoggingPath` to setup

### Changed
Changed default configuration `displayTitles` to true
  
## [1.1.0] - 2024-10-24
### Added
Added `interceptLogs` function.
- `true`: enables the interception of console logs
- `false`: disables this mechanism

## [1.0.18] - 2024-10-23
### Added
Added `multiline` and `displayTitles` options on configuration setup.
- `multiline`: makes the log breaks into multiple lines if there is too much info
- `displayTitles`: show/hide display titles for the log infos
Users can set all available configurations by calling setupLogging function.

## [1.0.17] - 2024-10-23
### Added
Added `loglens` command to identify any kind of log(console.log, console.warn and console.error)

### Changed
Mapped default functions(*all can be used*):
- `log`=`loglens`
- `logInfo`=`logInfomation`
- `logWarn`=`logWarning`

### Fixed
- Issue with incorrect logging format when using `loglens`.

## [1.0.16] - 2024-10-22
### Fixed
- Fixed recurrency on intercepted logs.
- Added missing logging options.

## [1.0.15] - 2024-10-22
### Changes
- Changed logCallout and logHeader parameters.
- Upgraded list of symbols.

## [1.0.14] - 2024-10-21
### Changes
- Changed description to message on log functions.

## [1.0.13] - 2024-10-20
### Added
- Created grouping engine.

## [1.0.12] - 2024-10-20
### Added
- Improved informations detection.
- Added default configurations.
- 
### Changes
- Shrink logs when its has no extra infos.

...

## [1.0.0] - 2024-10-17
### Added
- Support for Javascript and TypeScript.
- New feature to log data.
