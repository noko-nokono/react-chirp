import { Transport, LogEntry } from '../types';

export interface NetworkTransportOptions {
  url: string;
  batchSize?: number;
  flushInterval?: number;
  headers?: Record<string, string>;
  transform?: (entries: LogEntry[]) => any;
  onError?: (error: Error, entries: LogEntry[]) => void;
}

export class NetworkTransport implements Transport {
  private url: string;
  private batchSize: number;
  private flushInterval: number;
  private headers: Record<string, string>;
  private transform: (entries: LogEntry[]) => any;
  private onError?: (error: Error, entries: LogEntry[]) => void;
  private buffer: LogEntry[] = [];
  private timer?: number;

  constructor(options: NetworkTransportOptions) {
    this.url = options.url;
    this.batchSize = options.batchSize ?? 10;
    this.flushInterval = options.flushInterval ?? 5000;
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    this.transform = options.transform ?? ((entries) => ({ logs: entries }));
    this.onError = options.onError;

    this.scheduleFlush();
  }

  write(entry: LogEntry): void {
    this.buffer.push(entry);
    
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entriesToSend = [...this.buffer];
    this.buffer = [];

    try {
      const payload = this.transform(entriesToSend);
      
      await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (this.onError) {
        this.onError(error as Error, entriesToSend);
      } else {
        console.warn('Failed to send logs to network:', error);
      }
    }
  }

  private scheduleFlush(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
  }
}