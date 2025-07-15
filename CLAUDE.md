# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
```bash
npm run build        # Compile TypeScript to dist/
npm run dev          # Watch mode compilation
npm run typecheck    # Type checking without emitting files
npm run lint         # ESLint for TypeScript files
```

### Testing
```bash
npm run test         # Run Jest tests
```

## Architecture Overview

### Core Design Patterns

**Factory Pattern**: The main `chirp()` function in `/src/index.ts` acts as a factory, creating Logger instances with default settings (INFO level, ConsoleTransport).

**Transport Architecture**: Implements a pluggable output system where multiple Transport implementations can be used simultaneously. Each Transport implements a simple `write(entry: LogEntry)` interface.

**Method Overloading**: Logger methods support two call patterns:
- `logger.info("message")` - Simple string logging
- `logger.info({userId: 123}, "message")` - Object context + message

**Child Logger Pattern**: `logger.child(bindings)` creates new logger instances that inherit parent configuration while adding additional context fields to all log entries.

### Key Type Relationships

- `ChirpLogger` interface defines the public API
- `LogEntry` is the standardized internal log format with level, timestamp, message, and arbitrary fields
- `Transport` interface abstracts output destinations
- `ChirpOptions` configures logger behavior including browser-specific write functions

### React Integration Strategy

The `/src/react/` directory provides React-specific abstractions:
- All hooks work without any Provider setup, using a global logger by default
- `useLogger` accepts optional default additional data that gets automatically included in all log entries
- Enhanced logger methods support runtime configuration via options parameter
- Runtime options include `name` for logger naming and full ChirpOptions for transport/level configuration
- Configuration is passed directly to hooks rather than through Context providers

### Browser-Specific Features

The Logger class includes browser-specific optimization through `ChirpOptions.browser.write` which allows custom write functions per log level, bypassing the standard Transport system for performance-critical scenarios.

### Level Filtering

Numeric log levels (TRACE=10, DEBUG=20, INFO=30, WARN=40, ERROR=50, FATAL=60) enable efficient filtering. Logs below the configured level are rejected early in the `log()` method.

## Important Implementation Details

### Enhanced useLogger Implementation
The `useLogger` hook creates an enhanced logger interface that:
- Accepts optional `defaultAdditionalData` parameter for automatic data inclusion
- Wraps each log method to support runtime options via second parameter
- Merges default additional data with log entries automatically
- Supports runtime logger configuration including `name` and transport settings

### Transport Array Handling
Logger constructor normalizes transport options into arrays, supporting both single Transport and Transport[] configurations.

### Message Formatting
The `formatMessage()` method implements printf-style formatting with %s, %d, %j, and %% placeholders.

### Runtime Logger Configuration
Enhanced logger methods accept options parameter with:
- `name`: Sets logger name for that specific log entry
- All standard ChirpOptions: level, transport, browser settings, etc.

### TypeScript Configuration
- Compiles to ES2020 with DOM support
- Outputs declaration files to `dist/`
- Uses strict TypeScript settings with React JSX support

### Peer Dependencies
React >=16.8.0 is required for hook support in the React integration layer.