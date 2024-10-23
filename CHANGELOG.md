# Changelog

## [1.0.16] - 2024-10-23
### Added
Added `loglens` command to identify any kind of log(console.log, console.warn and console.error)

### Changed
Mapped default functions(*all can be used*):
- `log`=`loglens`
- `logInfo`=`logInfomation`
- `logWarn`=`logWarning`

### Fixed
- Issue with incorrect logging format when using `loglens`.

## [1.0.15] - 2024-10-22
### Fixed
- Fixed recurrency on intercepted logs.
- Added missing logging options.

## [1.0.14] - 2024-10-22
### Changes
- Changed logCallout and logHeader parameters.
- Upgraded list of symbols.

## [1.0.13] - 2024-10-21
### Changes
- Changed description to message on log functions.

## [1.0.12] - 2024-10-20
### Added
- Created grouping engine.

## [1.0.11] - 2024-10-20
### Added
- Improved informations detection.
- Added default configurations.
- 
### Changes
- Shrink logs when its has no extra infos.

...

## [1.0.1] - 2024-10-17
### Added
- Exported types

## [1.0.0] - 2024-10-17
### Added
- Support for Javascript and TypeScript.
- New feature to log data.
