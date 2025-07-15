import { Transport, LogEntry, LogLevel } from '../types';

export class ConsoleTransport implements Transport {
  private asObject: boolean;

  constructor(options: { asObject?: boolean } = {}) {
    this.asObject = options.asObject ?? false;
  }

  write(entry: LogEntry): void {
    const consoleMethod = this.getConsoleMethod(entry.level);
    
    if (this.asObject) {
      consoleMethod(entry);
    } else {
      const formatted = this.formatEntry(entry);
      consoleMethod(formatted);
    }
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  private formatEntry(entry: LogEntry): string {
    const timestamp = new Date(entry.time).toISOString();
    const levelName = LogLevel[entry.level];
    const { level, time, msg, ...rest } = entry;
    
    let formatted = `[${timestamp}] ${levelName}: ${msg}`;
    
    if (Object.keys(rest).length > 0) {
      formatted += ` ${JSON.stringify(rest)}`;
    }
    
    return formatted;
  }
}