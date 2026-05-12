import { FullConfig } from '@playwright/test';
import { testLogger } from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(_fullConfig: FullConfig): Promise<void> {
  testLogger.info('🧹 Global teardown starting...');

  // Clean up storageState files
  const storageDir = path.join(process.cwd(), 'storageState');
  if (fs.existsSync(storageDir)) {
    const files = fs.readdirSync(storageDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(storageDir, file));
      }
    }
    testLogger.info(`🧹 Cleaned up ${files.length} storage state files`);
  }

  testLogger.info('🧹 Global teardown complete');
}

export default globalTeardown;
