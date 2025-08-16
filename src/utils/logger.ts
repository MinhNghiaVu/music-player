interface LogLevel {
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
  DEBUG: 'debug';
}

interface LogData {
  [key: string]: any;
}

class Logger {
  private levels: LogLevel = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    DEBUG: 'debug'
  };

  private log(level: keyof LogLevel, message: string, data?: LogData): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: this.levels[level],
      message,
      ...(data && { data })
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(logEntry, null, 2));
    }

  }

  info(message: string, data?: LogData): void {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('WARN', message, data);
  }

  error(message: string, data?: LogData): void {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: LogData): void {
    this.log('DEBUG', message, data);
  }
}

export const logger = new Logger();