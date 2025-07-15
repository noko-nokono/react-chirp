import { LogLevel, LogEntry, ChirpOptions, ChirpLogger, Transport } from '../types';

export class Logger implements ChirpLogger {
  public level: LogLevel;
  private name?: string;
  private base: Record<string, any>;
  private transports: Transport[];
  private browserOptions: ChirpOptions['browser'];

  constructor(options: ChirpOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.name = options.name;
    this.base = options.base ?? {};
    this.browserOptions = options.browser;
    
    if (options.transport) {
      this.transports = Array.isArray(options.transport) 
        ? options.transport 
        : [options.transport];
    } else {
      this.transports = [];
    }
  }

  private createLogEntry(level: LogLevel, obj: any, msg?: string, ...args: any[]): LogEntry {
    const entry: LogEntry = {
      level,
      time: Date.now(),
      msg: '',
      ...this.base,
    };

    if (this.name) {
      entry.name = this.name;
    }

    if (typeof obj === 'object' && obj !== null) {
      Object.assign(entry, obj);
      entry.msg = msg ? this.formatMessage(msg, ...args) : '';
    } else {
      entry.msg = this.formatMessage(obj, msg, ...args);
    }

    return entry;
  }

  private formatMessage(template: string, ...args: any[]): string {
    if (args.length === 0) return template;
    
    return template.replace(/%[sdj%]/g, (match) => {
      if (args.length === 0) return match;
      
      const arg = args.shift();
      switch (match) {
        case '%s': return String(arg);
        case '%d': return Number(arg).toString();
        case '%j': return JSON.stringify(arg);
        case '%%': return '%';
        default: return match;
      }
    });
  }

  private log(level: LogLevel, obj: any, msg?: string, ...args: any[]): void {
    if (level < this.level) return;

    const entry = this.createLogEntry(level, obj, msg, ...args);
    
    for (const transport of this.transports) {
      transport.write(entry);
    }

    if (this.browserOptions?.write) {
      const { write } = this.browserOptions;
      switch (level) {
        case LogLevel.TRACE:
          if (write.trace) write.trace(entry);
          break;
        case LogLevel.DEBUG:
          if (write.debug) write.debug(entry);
          break;
        case LogLevel.INFO:
          if (write.info) write.info(entry);
          break;
        case LogLevel.WARN:
          if (write.warn) write.warn(entry);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          if (write.error) write.error(entry);
          break;
      }
    }
  }

  trace(obj: object, msg?: string, ...args: any[]): void;
  trace(msg: string, ...args: any[]): void;
  trace(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.TRACE, obj, msg, ...args);
  }

  debug(obj: object, msg?: string, ...args: any[]): void;
  debug(msg: string, ...args: any[]): void;
  debug(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, obj, msg, ...args);
  }

  info(obj: object, msg?: string, ...args: any[]): void;
  info(msg: string, ...args: any[]): void;
  info(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.INFO, obj, msg, ...args);
  }

  warn(obj: object, msg?: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  warn(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.WARN, obj, msg, ...args);
  }

  error(obj: object, msg?: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
  error(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, obj, msg, ...args);
  }

  fatal(obj: object, msg?: string, ...args: any[]): void;
  fatal(msg: string, ...args: any[]): void;
  fatal(obj: any, msg?: string, ...args: any[]): void {
    this.log(LogLevel.FATAL, obj, msg, ...args);
  }

  child(bindings: Record<string, any>): ChirpLogger {
    return new Logger({
      level: this.level,
      name: this.name,
      base: { ...this.base, ...bindings },
      browser: this.browserOptions,
      transport: this.transports,
    });
  }
}