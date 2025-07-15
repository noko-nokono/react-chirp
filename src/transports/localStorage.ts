import { Transport, LogEntry } from '../types';

export interface LocalStorageTransportOptions {
  key?: string;
  maxEntries?: number;
  serialize?: (entry: LogEntry) => string;
}

export class LocalStorageTransport implements Transport {
  private key: string;
  private maxEntries: number;
  private serialize: (entry: LogEntry) => string;

  constructor(options: LocalStorageTransportOptions = {}) {
    this.key = options.key ?? 'chirp-logs';
    this.maxEntries = options.maxEntries ?? 1000;
    this.serialize = options.serialize ?? JSON.stringify;
  }

  write(entry: LogEntry): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const logs = this.getLogs();
      logs.push(entry);
      
      if (logs.length > this.maxEntries) {
        logs.splice(0, logs.length - this.maxEntries);
      }
      
      localStorage.setItem(this.key, JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to write log to localStorage:', error);
    }
  }

  getLogs(): LogEntry[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to read logs from localStorage:', error);
      return [];
    }
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.warn('Failed to clear logs from localStorage:', error);
    }
  }

  export(): string {
    const logs = this.getLogs();
    return logs.map(this.serialize).join('\n');
  }
}