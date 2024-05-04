import { func } from '../nammatham';
import { startCacheUpdate } from './cache-helper';

export default func
  .timer('updateCache', {
    /**
     * Every 6 hours update the cache
     */
    schedule: '0 0 */6 * * *',
  })
  .handler(async c => {
    await startCacheUpdate(c.context);
  });
