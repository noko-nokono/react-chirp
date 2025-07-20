import { useRef, useCallback } from 'react';
import { log } from '../core/logger';
import { Transport } from '../types';

interface LogHookConfig {
  transport?: Transport;
}

export function useLog(config?: LogHookConfig) {
  const loggerRef = useRef(log(config));

  const trace = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.trace(msg, data);
  }, []);

  const debug = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.debug(msg, data);
  }, []);

  const info = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.info(msg, data);
  }, []);

  const warn = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.warn(msg, data);
  }, []);

  const error = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.error(msg, data);
  }, []);

  const fatal = useCallback((msg: string, data?: Record<string, string>) => {
    loggerRef.current.fatal(msg, data);
  }, []);

  return {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
  };
}