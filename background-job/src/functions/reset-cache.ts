import { func } from '../nammatham';
import { startCacheUpdate } from './cache-helper';

export default func
  .httpGet('resetCache', {
    authLevel: 'function',
  })
  .handler(async c => {
    await startCacheUpdate(c.context);
    return c.json({ message: 'Cache updated' });
  });
