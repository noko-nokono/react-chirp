import { LogLevel, LogEntry, Transport } from '../types';
import { ConsoleTransport } from '../transports';

interface ChirpConfig {
  transport?: Transport;
}

class ChirpLogger {
  private transport: Transport;

  constructor(config: ChirpConfig = {}) {
    this.transport = config.transport || new ConsoleTransport();
  }

  private createLogEntry(level: LogLevel, msg: string, data?: Record<string, string>): LogEntry {
    const entry: LogEntry = {
      level,
      time: Date.now(),
      msg,
    };

    if (data) {
      Object.assign(entry, data);
    }

    return entry;
  }

  private log(level: LogLevel, msg: string, data?: Record<string, string>): void {
    const entry = this.createLogEntry(level, msg, data);
    this.transport.write(entry);
  }

  trace(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.TRACE, msg, data);
  }

  debug(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.DEBUG, msg, data);
  }

  info(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.INFO, msg, data);
  }

  warn(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.WARN, msg, data);
  }

  error(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.ERROR, msg, data);
  }

  fatal(msg: string, data?: Record<string, string>): void {
    this.log(LogLevel.FATAL, msg, data);
  }
}

export function chirp(config?: ChirpConfig): ChirpLogger {
  return new ChirpLogger(config);
}
