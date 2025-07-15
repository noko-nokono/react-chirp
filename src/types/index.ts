export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

export interface LogEntry {
  level: LogLevel;
  time: number;
  msg: string;
  [key: string]: any;
}

export interface Transport {
  write(entry: LogEntry): void | Promise<void>;
}

export interface ChirpOptions {
  level?: LogLevel;
  name?: string;
  base?: Record<string, any>;
  browser?: {
    asObject?: boolean;
    write?: {
      error?: Transport['write'];
      warn?: Transport['write'];
      info?: Transport['write'];
      debug?: Transport['write'];
      trace?: Transport['write'];
    };
  };
  transport?: Transport | Transport[];
}

export interface ChirpLogger {
  level: LogLevel;
  trace(obj: object, msg?: string, ...args: any[]): void;
  trace(msg: string, ...args: any[]): void;
  debug(obj: object, msg?: string, ...args: any[]): void;
  debug(msg: string, ...args: any[]): void;
  info(obj: object, msg?: string, ...args: any[]): void;
  info(msg: string, ...args: any[]): void;
  warn(obj: object, msg?: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(obj: object, msg?: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
  fatal(obj: object, msg?: string, ...args: any[]): void;
  fatal(msg: string, ...args: any[]): void;
  child(bindings: Record<string, any>): ChirpLogger;
}