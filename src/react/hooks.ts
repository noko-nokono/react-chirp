import { useRef } from 'react';
import { ChirpLogger, ChirpOptions, LogLevel } from '../types';
import { chirp } from '../index';

// シングルトンパターン: アプリケーション全体で共有されるデフォルトのロガーインスタンス
const globalLogger = chirp();

// 拡張ロガーインターフェース: 各ログメソッドにランタイム設定オプションを追加
// 元のChirpLoggerからログメソッドを除外し、オプション付きの新しいシグネチャで再定義
interface EnhancedLogger extends Omit<ChirpLogger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'> {
  trace(msg: string, options?: ChirpOptions): void;
  debug(msg: string, options?: ChirpOptions): void;
  info(msg: string, options?: ChirpOptions): void;
  warn(msg: string, options?: ChirpOptions): void;
  error(msg: string, options?: ChirpOptions): void;
  fatal(msg: string, options?: ChirpOptions): void;
}

// ファクトリー関数: 各ログレベル用の拡張ログメソッドを生成
// デフォルトの追加データとランタイムオプションの両方に対応
function createEnhancedLogMethod(
  baseLogger: ChirpLogger,
  defaultAdditionalData: Record<string, any> | undefined,
  level: LogLevel
) {
  return (msg: string, opts?: ChirpOptions) => {
    if (opts) {
      // ランタイムオプションが指定された場合、一時的な新しいロガーを作成
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
      // デフォルトロガーを使用（オプションなし）
      // 追加データがある場合はオブジェクトとして出力
      if (defaultAdditionalData && Object.keys(defaultAdditionalData).length > 0) {
        (baseLogger as any)[LogLevel[level].toLowerCase()](defaultAdditionalData, msg);
      } else {
        (baseLogger as any)[LogLevel[level].toLowerCase()](msg);
      }
    }
  };
}

/**
 * React Hook: 拡張されたロガーインスタンスを提供
 * 
 * @param defaultAdditionalData すべてのログエントリに自動的に含まれるデフォルトデータ
 * @returns ランタイムオプション対応の拡張ロガー
 * 
 * 主な機能:
 * - グローバルロガーを基盤として使用（Providerなしで動作）
 * - デフォルトの追加データを全ログエントリに自動マージ
 * - 各ログメソッドでランタイム設定をサポート（name、transport等）
 * - useRef による効率的な再レンダリング制御
 */
export function useLogger(
  defaultAdditionalData?: Record<string, any>
): EnhancedLogger {
  // useRefでインスタンスの永続化と変更検知を実装
  const defaultAdditionalDataRef = useRef<Record<string, any> | undefined>();
  const loggerRef = useRef<ChirpLogger>();
  
  // 追加データの変更を検知（JSON.stringifyによる深い比較）
  const additionalDataChanged = JSON.stringify(defaultAdditionalData) !== JSON.stringify(defaultAdditionalDataRef.current);
  
  // 初回実行または追加データ変更時にロガーを初期化
  if (!loggerRef.current || additionalDataChanged) {
    defaultAdditionalDataRef.current = defaultAdditionalData;
    loggerRef.current = globalLogger;
  }
  
  // 拡張されたロガーを作成（各ログメソッドにオプション機能を追加）
  const enhancedLogger: EnhancedLogger = {
    level: loggerRef.current!.level,
    child: loggerRef.current!.child.bind(loggerRef.current!),
    
    // 各ログレベルに対して拡張メソッドを生成
    trace: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.TRACE),
    debug: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.DEBUG),
    info: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.INFO),
    warn: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.WARN),
    error: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.ERROR),
    fatal: createEnhancedLogMethod(loggerRef.current!, defaultAdditionalData, LogLevel.FATAL)
  };
  return enhancedLogger;
}