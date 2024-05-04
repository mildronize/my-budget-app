import 'dotenv/config';
import { schema } from './env.schema.js';
import { extractErorMessage } from './utils.js';
/**
 * Get environment variables
 */
export function getEnv() {
  try {
    return schema.parse(process.env);
  } catch (error) {
    console.error('Environment variables are not set correctly');
    console.error(extractErorMessage(error));
    process.exit(1);
  }
}
