# react-chirp

A high-performance, structured logging library for React applications.

## Features

- 🎯 **Level-based logging**: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
- 🚀 **Multiple transports**: Console, LocalStorage, Network
- ⚛️ **React integration**: Context Provider and custom hooks
- 🎛️ **Child loggers**: Create focused loggers with bindings
- 🌐 **Browser optimized**: Async/batch processing support
- 📱 **TypeScript**: Full type safety

## Installation

```bash
npm install react-chirp
```

## Directory Structure

```
src/
├── core/                 # Core logging functionality
│   ├── index.ts         # Core exports
│   └── logger.ts        # Main Logger class implementation
├── react/               # React-specific components and hooks
│   ├── index.ts         # React exports
│   └── hooks.ts         # Custom logging hooks
├── transports/          # Output transports
│   ├── index.ts         # Transport exports
│   ├── console.ts       # Console transport
│   ├── localStorage.ts  # LocalStorage transport
│   └── network.ts       # Network transport
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
└── index.ts             # Main library entry point
```

## Quick Start

### Basic Usage

```tsx
import { chirp } from 'react-chirp';

const logger = chirp();
logger.info('Hello, world!');
logger.error({ error: 'Something went wrong' }, 'Error occurred');
```

### React Integration

```tsx
import React from 'react';
import { useLogger, LogLevel, NetworkTransport } from 'react-chirp';

function App() {
  return <MyComponent />; // No Provider needed!
}

function MyComponent({ userId }: { userId: string }) {
  // Simple logging (no additional data)
  const logger = useLogger();

  // With default additional data (automatically included in all logs)
  const userLogger = useLogger({
    userId,
    component: 'MyComponent',
    version: '1.0.0',
  });

  useEffect(() => {
    // Basic logging
    logger.info('Component mounted');

    // Logging with automatic additional data
    userLogger.info('User action performed');
    // Output includes: { userId: "123", component: "MyComponent", version: "1.0.0", msg: "User action performed", ... }

    // Logging with custom name and options
    userLogger.info('Critical user action', {
      name: 'UserActionLogger',
      level: LogLevel.WARN,
      transport: [new NetworkTransport({ url: '/api/critical-logs' })],
    });
  }, []);

  return <div>My Component</div>;
}
```

### Alternative: Direct chirp() Usage

For cases where you want to share the same custom logger across multiple components:

```tsx
import { chirp, LogLevel, NetworkTransport } from 'react-chirp';

// Create a shared custom logger
const appLogger = chirp({
  level: LogLevel.DEBUG,
  name: 'MyApp',
  transport: [
    new ConsoleTransport(),
    new NetworkTransport({ url: '/api/logs' }),
  ],
});

function MyComponent() {
  // Use the shared logger directly
  appLogger.info('Using shared logger');

  // Or pass it to hooks for child logger creation
  const userLogger = appLogger.child({ userId: 123 });

  return <div>My Component</div>;
}
```

### Transports

```tsx
import {
  chirp,
  ConsoleTransport,
  LocalStorageTransport,
  NetworkTransport,
} from 'react-chirp';

const logger = chirp({
  transport: [
    new ConsoleTransport({ asObject: false }),
    new LocalStorageTransport({
      key: 'app-logs',
      maxEntries: 1000,
    }),
    new NetworkTransport({
      url: 'https://api.example.com/logs',
      batchSize: 20,
      flushInterval: 10000,
    }),
  ],
});
```

## API Reference

### Log Levels

- `TRACE = 10` - Detailed trace information
- `DEBUG = 20` - Debug information
- `INFO = 30` - General information
- `WARN = 40` - Warning messages
- `ERROR = 50` - Error conditions
- `FATAL = 60` - Critical failures

### useLogger Hook

```tsx
const logger = useLogger(defaultAdditionalData?: Record<string, any>)
```

**Parameters:**

- `defaultAdditionalData` - Object that will be automatically included in all log entries

**Returns:** Enhanced logger with additional functionality

### Logger Methods

```tsx
// Basic logging
logger.info('Simple message');

// Logging with runtime options
logger.info('Message with options', {
  name: 'CustomLogger',
  level: LogLevel.WARN,
  transport: [new NetworkTransport({ url: '/api/logs' })],
});
```

### Enhanced Logger Features

#### Default Additional Data

```tsx
const logger = useLogger({
  userId: '123',
  sessionId: 'abc',
  feature: 'payment',
});

logger.info('Action performed');
// Output: { userId: "123", sessionId: "abc", feature: "payment", msg: "Action performed", ... }
```

#### Runtime Logger Configuration

```tsx
logger.error('Critical error', {
  name: 'ErrorLogger',
  transport: [
    new ConsoleTransport(),
    new NetworkTransport({ url: '/api/errors' }),
  ],
});
```

### Child Loggers

```tsx
const childLogger = logger.child({ module: 'auth' });
childLogger.info('Login attempt'); // Will include module: 'auth'
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Type checking
npm run typecheck

# Run linting
npm run lint

# Development mode (watch)
npm run dev
```

## License

MIT
