# React Log Validation Environment

This is a validation environment for testing the React Log logging library.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

3. Open [http://localhost:1234](http://localhost:1234) to view it in the browser.

## What this validates

- useLog hook functionality
- Different log levels (trace, debug, info, warn, error, fatal)
- Custom transport configuration
- Console transport (default)
- Message and additional data logging

## Features

- Interactive form to test logging with custom messages and data
- Real-time log display for custom transport
- Console output for default transport
- Visual representation of all log levels
- Clear logs functionality

## Usage

1. Enter a log message in the input field
2. Optionally add additional data
3. Click any log level button to test
4. Check both the custom logs section and browser console for output