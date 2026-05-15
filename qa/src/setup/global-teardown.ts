import { FullConfig } from '@playwright/test';
import { testLogger } from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(_fullConfig: FullConfig): Promise<void> {
  testLogger.info('🧹 Global teardown starting...');

  // Clean up storageState files (browser contexts) but preserve auth tokens
  const storageDir = path.join(process.cwd(), 'storageState');
  if (fs.existsSync(storageDir)) {
    const files = fs.readdirSync(storageDir);
    let cleanedCount = 0;
    for (const file of files) {
      // Only remove browser storage state files, not token files
      if (file.endsWith('.json') && !file.endsWith('-token.json')) {
        fs.unlinkSync(path.join(storageDir, file));
        cleanedCount++;
      }
    }
    testLogger.info(`🧹 Cleaned up ${cleanedCount} storage state files`);
  }

  testLogger.info('🧹 Global teardown complete');
}

export default globalTeardown;
