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

**Factory Pattern**: The main `log()` function in `/src/core/logger.ts` acts as a factory, creating Logger instances with default console transport.

**Transport Architecture**: Implements a pluggable output system where a single Transport implementation handles log output. Each Transport implements a simple `write(entry: LogEntry)` interface.

**Simple Method Signature**: Logger methods support a clean call pattern:
- `logger.info("message")` - Simple string logging
- `logger.info("message", { userId: "123" })` - Message + Record<string, string> data

**React Hook Pattern**: `useLog()` hook provides the same logging functionality as the core log function but optimized for React components with useRef and useCallback.

### Key Type Relationships

- `Logger` class provides the core logging functionality
- `LogEntry` is the standardized internal log format with level, timestamp, message, and additional string fields
- `Transport` interface abstracts output destinations
- `LogConfig` configures logger behavior with optional transport setting

### React Integration Strategy

The `/src/react/` directory provides React-specific abstractions:
- `useLog` hook works without any Provider setup, creating a logger instance via useRef
- Hook methods are optimized with useCallback for performance
- Configuration is passed directly to the hook rather than through Context providers

### Transport Configuration

The Logger class uses a single Transport instance:
- Default transport is ConsoleTransport for console output
- Custom transports can be configured via the config parameter: `log({ transport: customTransport })`
- Transport configuration is separate from the execution logic

### Level Filtering

Numeric log levels (TRACE=10, DEBUG=20, INFO=30, WARN=40, ERROR=50, FATAL=60) are defined but currently not used for filtering in this simplified implementation.

## Important Implementation Details

### Simplified API
The current implementation follows the document.txt specification:
- First argument is always a string message (required)
- Second argument is optional Record<string, string> for additional data
- No complex formatting or child logger functionality

### Transport Handling
Logger constructor accepts a single Transport instance rather than arrays, simplifying the architecture.

### Message Handling
No printf-style formatting - messages are passed through as-is.

### React Hook Implementation
The `useLog` hook:
- Creates a logger instance via useRef for persistence
- Wraps each log method with useCallback for performance
- Accepts optional transport configuration
- Returns object with all logging methods

### TypeScript Configuration
- Compiles to ES2020 with DOM support
- Outputs declaration files to `dist/`
- Uses strict TypeScript settings with React JSX support

### Peer Dependencies
React >=16.8.0 is required for hook support in the React integration layer.

## Core Functions

### log(config?)
- Creates Logger instance
- Accepts optional LogConfig with transport setting
- Returns logger with trace, debug, info, warn, error, fatal methods

### useLog(config?)
- React hook that provides logging functionality
- Returns object with optimized logging methods
- Accepts same configuration as log function

### Logger Methods
All methods follow signature: `methodName(msg: string, data?: Record<string, string>): void`

## Important Notes for Development

- Always use the simplified API specified in document.txt
- First argument must be string message, second argument optional Record<string, string>
- Default transport is ConsoleTransport
- Custom transports configured via config object
- React hook provides same functionality as core log function but optimized for React