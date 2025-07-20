# react-log

A simple, structured logging library for React applications.

## Features

- 🎯 **Level-based logging**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- 🚀 **Multiple transports**: Console, LocalStorage, Network
- ⚛️ **React integration**: Custom hooks for React components
- 📱 **TypeScript**: Full type safety with Record<string, string> data
- 🎛️ **Configurable**: Custom transport configuration support

## Installation

```bash
npm install react-log
```

## Quick Start

### Basic Usage

```typescript
import { log } from 'react-log';

// Create a logger instance
const logger = log();

// Basic logging with message only
logger.trace("trace message");
logger.debug("debug message");
logger.info("info message");
logger.warn("warning message");
logger.error("error message");
logger.fatal("fatal message");

// Logging with additional data
logger.debug("debug message", { userId: "123", action: "login" });
logger.info("user action", { userId: "123", page: "dashboard" });
```

### React Integration

```tsx
import React, { useEffect } from 'react';
import { useLog } from 'react-log';

function MyComponent({ userId }: { userId: string }) {
  // Use the log hook
  const { trace, debug, info, warn, error, fatal } = useLog();

  useEffect(() => {
    // Log component mount
    info("Component mounted");
    
    // Log with additional data
    debug("User data loaded", { userId, timestamp: Date.now().toString() });
  }, []);

  const handleClick = () => {
    info("Button clicked", { userId, action: "submit" });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Custom Transport Configuration

```typescript
import { log, NetworkTransport } from 'react-log';

// Use custom transport
const logger = log({
  transport: new NetworkTransport({ url: '/api/logs' })
});

// Or in React hook
const { info } = useLog({
  transport: new NetworkTransport({ url: '/api/logs' })
});
```

## API Reference

### log(config?)

Creates a new logger instance.

**Parameters:**
- `config?: { transport?: Transport }` - Optional configuration object

**Returns:** Logger instance with methods: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

### useLog(config?)

React hook that provides logging functionality.

**Parameters:**
- `config?: { transport?: Transport }` - Optional configuration object

**Returns:** Object with logging methods: `{ trace, debug, info, warn, error, fatal }`

### Logger Methods

All logger methods follow the same signature:

```typescript
methodName(msg: string, data?: Record<string, string>): void
```

**Parameters:**
- `msg: string` - The log message (required)
- `data?: Record<string, string>` - Additional key-value pairs to include in the log entry (optional)

## Log Levels

- `TRACE = 10` - Detailed trace information
- `DEBUG = 20` - Debug information  
- `INFO = 30` - General information
- `WARN = 40` - Warning messages
- `ERROR = 50` - Error conditions
- `FATAL = 60` - Critical failures

## Transports

### ConsoleTransport (Default)

Outputs logs to the browser console.

```typescript
import { ConsoleTransport } from 'react-log';

const transport = new ConsoleTransport({ asObject: false });
```

### LocalStorageTransport

Stores logs in browser local storage.

```typescript
import { LocalStorageTransport } from 'react-log';

const transport = new LocalStorageTransport({
  key: 'app-logs',
  maxEntries: 1000,
});
```

### NetworkTransport

Sends logs to a remote endpoint.

```typescript
import { NetworkTransport } from 'react-log';

const transport = new NetworkTransport({
  url: 'https://api.example.com/logs',
  batchSize: 20,
  flushInterval: 10000,
});
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Type checking
npm run typecheck

# Development mode (watch)
npm run dev

# Run tests
npm run test
```

## License

MIT