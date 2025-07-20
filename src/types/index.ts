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

export interface LogOptions {
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

export interface Logger {
  level: LogLevel;
  trace(msg: string, ...objs: Record<string, string>[]): void;
  debug(msg: string, ...objs: Record<string, string>[]): void;
  info(msg: string, ...objs: Record<string, string>[]): void;
  warn(msg: string, ...objs: Record<string, string>[]): void;
  error(msg: string, ...objs: Record<string, string>[]): void;
  fatal(msg: string, ...objs: Record<string, string>[]): void;
  child(bindings: Record<string, any>): Logger;
}