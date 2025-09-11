type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';

const getTimestamp = (): string => {
  return new Date().toISOString();
};


const log = (level: LogLevel, message: string): void => {
  console.log(`[${level}] [${getTimestamp()}]: ${message}`);
};

export const logger = {
  info: (message: string) => log('INFO', message),
  error: (message: string) => log('ERROR', message),
  warn: (message: string) => log('WARN', message),
  debug: (message: string) => log('DEBUG', message),
};
