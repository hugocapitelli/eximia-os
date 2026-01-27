/**
 * Centralized logger for the application
 * Replaces console.log/error with structured logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = typeof window === 'undefined' ? false : process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  }

  private createEntry(level: LogLevel, message: string, data?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
    };
  }

  debug(message: string, data?: Record<string, unknown>) {
    if (!this.isDevelopment) return;
    const entry = this.createEntry('debug', message, data);
    console.debug(this.formatMessage(entry), entry.data || '');
  }

  info(message: string, data?: Record<string, unknown>) {
    const entry = this.createEntry('info', message, data);
    console.log(this.formatMessage(entry), entry.data || '');
  }

  warn(message: string, data?: Record<string, unknown>) {
    const entry = this.createEntry('warn', message, data);
    console.warn(this.formatMessage(entry), entry.data || '');
  }

  error(message: string, error?: Error | Record<string, unknown>, data?: Record<string, unknown>) {
    let errorObj: Error | undefined;
    let errorData = data;

    if (error instanceof Error) {
      errorObj = error;
    } else if (error && typeof error === 'object') {
      errorData = error;
    }

    const entry = this.createEntry('error', message, errorData, errorObj);
    console.error(this.formatMessage(entry), {
      error: errorObj?.message,
      stack: errorObj?.stack,
      ...entry.data,
    });
  }
}

export const logger = new Logger();
