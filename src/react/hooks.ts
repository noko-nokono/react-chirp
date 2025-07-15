import { useRef } from 'react';
import { ChirpLogger, ChirpOptions, LogLevel } from '../types';
import { chirp } from '../index';

const globalLogger = chirp();

interface EnhancedLogger extends Omit<ChirpLogger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'> {
  trace(msg: string, options?: ChirpOptions): void;
  debug(msg: string, options?: ChirpOptions): void;
  info(msg: string, options?: ChirpOptions): void;
  warn(msg: string, options?: ChirpOptions): void;
  error(msg: string, options?: ChirpOptions): void;
  fatal(msg: string, options?: ChirpOptions): void;
}

function createEnhancedLogMethod(
  baseLogger: ChirpLogger,
  defaultAdditionalData: Record<string, any> | undefined,
  level: LogLevel
) {
  return (msg: string, opts?: ChirpOptions) => {
    if (opts) {
      const { name, ...chirpOptions } = opts;
      const tempLogger = chirp({ 
        ...chirpOptions,
        ...(name && { name })
      });
      
      // 追加データがある場合はオブジェクトとして出力
      if (defaultAdditionalData && Object.keys(defaultAdditionalData).length > 0) {
        (tempLogger as any)[LogLevel[level].toLowerCase()](defaultAdditionalData, msg);
      } else {
        (tempLogger as any)[LogLevel[level].toLowerCase()](msg);
      }
    } else {
      // 追加データがある場合はオブジェクトとして出力
      if (defaultAdditionalData && Object.keys(defaultAdditionalData).length > 0) {
        (baseLogger as any)[LogLevel[level].toLowerCase()](defaultAdditionalData, msg);
      } else {
        (baseLogger as any)[LogLevel[level].toLowerCase()](msg);
      }
    }
  };
}

export function useLogger(
  defaultAdditionalData?: Record<string, any>
): EnhancedLogger {
  const defaultAdditionalDataRef = useRef<Record<string, any> | undefined>();
  const loggerRef = useRef<ChirpLogger>();
  
  const additionalDataChanged = JSON.stringify(defaultAdditionalData) !== JSON.stringify(defaultAdditionalDataRef.current);
  
  if (!loggerRef.current || additionalDataChanged) {
    defaultAdditionalDataRef.current = defaultAdditionalData;
    loggerRef.current = globalLogger;
  }
  
  // 拡張されたロガーを作成
  const enhancedLogger: EnhancedLogger = {
    level: loggerRef.current!.level,
    child: loggerRef.current!.child.bind(loggerRef.current!),
    
    trace: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.TRACE),
    debug: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.DEBUG),
    info: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.INFO),
    warn: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.WARN),
    error: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.ERROR),
    fatal: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.FATAL)
  };
  return enhancedLogger;
}