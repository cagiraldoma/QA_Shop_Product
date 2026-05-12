export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

const isSilent = process.env.CI === 'true' || process.env.LOG_LEVEL === 'silent';

export const testLogger: Logger = {
  debug: (msg, ...args) => !isSilent && console.debug(`[QA:DEBUG] ${msg}`, ...args),
  info: (msg, ...args) => !isSilent && console.info(`[QA:INFO] ${msg}`, ...args),
  warn: (msg, ...args) => !isSilent && console.warn(`[QA:WARN] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[QA:ERROR] ${msg}`, ...args),
};
