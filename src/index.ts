import { Logger } from './core';
import { ConsoleTransport } from './transports';
import { ChirpOptions, ChirpLogger, LogLevel } from './types';

export function chirp(options?: ChirpOptions): ChirpLogger {
  const defaultOptions: ChirpOptions = {
    level: LogLevel.INFO,
    transport: new ConsoleTransport(),
    ...options,
  };
  
  return new Logger(defaultOptions);
}

export * from './types';
export * from './core';
export * from './transports';
export * from './react';