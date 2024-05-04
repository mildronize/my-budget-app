import { z } from 'zod';
import { func } from '../nammatham';
import { startCacheUpdate } from './cache-helper';
import { output } from '@azure/functions';
import { generateRealtimeMessage } from '../libs/signalr';

const longQueueSchema = z.object({
  type: z.enum(['update_monthly_budget']),
});

const signalrOutput = output.generic({
  type: 'signalR',
  hubName: 'serverless',
  connectionStringSetting: 'AzureSignalRConnectionString',
});

export default func
  .storageQueue('handleLongQueue', {
    connection: 'AzureWebJobsStorage',
    queueName: 'budgetlongqueue',
    extraOutputs: [signalrOutput],
  })
  .handler(async c => {
    const context = c.context;
    context.log('Storage queue function processed work item:', c.trigger);
    const triggerMetadata = c.context.triggerMetadata;
    context.log('Queue metadata (dequeueCount):', triggerMetadata?.dequeueCount);
    const data = longQueueSchema.parse(c.trigger);
    context.log('data:', data);

    if (data.type === 'update_monthly_budget') {
      await startCacheUpdate(c.context, true);
      context.extraOutputs.set(signalrOutput, [generateRealtimeMessage('monthlyBudgetUpdated')]);
    } else {
      throw new Error('Invalid type');
    }
  });
