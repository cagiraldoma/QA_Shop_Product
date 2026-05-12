import { FullConfig, request } from '@playwright/test';
import { config, validateConfig } from '@config/config';
import { ApiClient } from '@api/api-client';
import { AuthEndpoint } from '@api/endpoints/auth.endpoint';
import { testLogger } from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(_fullConfig: FullConfig): Promise<void> {
  testLogger.info('🌍 Global setup starting...');

  // Validate environment
  validateConfig();

  // Ensure storageState directory exists
  const storageDir = path.join(process.cwd(), 'storageState');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Create API context
  const reqContext = await request.newContext({
    baseURL: config.API_BASE_URL,
  });

  const apiClient = new ApiClient(reqContext, config.API_BASE_URL);
  const authEndpoint = new AuthEndpoint(apiClient);

  // Seed admin user and save storage state
  try {
    const adminLogin = await authEndpoint.login({
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
    });
    testLogger.info(`✅ Admin authenticated: ${adminLogin.user.email}`);
    apiClient.setAuthToken(adminLogin.token);
    await reqContext.storageState({ path: path.join(storageDir, 'admin.json') });
  } catch {
    testLogger.warn('Admin login failed, attempting to register...');
    const adminRegister = await authEndpoint.register({
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      name: 'Admin User',
    });
    apiClient.setAuthToken(adminRegister.token);
    await reqContext.storageState({ path: path.join(storageDir, 'admin.json') });
  }

  // Seed customer user and save storage state
  try {
    const customerLogin = await authEndpoint.login({
      email: config.CUSTOMER_EMAIL,
      password: config.CUSTOMER_PASSWORD,
    });
    testLogger.info(`✅ Customer authenticated: ${customerLogin.user.email}`);
    apiClient.setAuthToken(customerLogin.token);
    await reqContext.storageState({ path: path.join(storageDir, 'customer.json') });
  } catch {
    testLogger.warn('Customer login failed, attempting to register...');
    const customerRegister = await authEndpoint.register({
      email: config.CUSTOMER_EMAIL,
      password: config.CUSTOMER_PASSWORD,
      name: 'Test Customer',
    });
    apiClient.setAuthToken(customerRegister.token);
    await reqContext.storageState({ path: path.join(storageDir, 'customer.json') });
  }

  await reqContext.dispose();
  testLogger.info('🌍 Global setup complete');
}

export default globalSetup;
