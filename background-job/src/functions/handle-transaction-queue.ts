import { z } from 'zod';
import { func } from '../nammatham';
import { dateString, dateStringTimezone, dateTimeString, dateTimeStringTimezone } from '../libs/dayjs';
import { sheetClient, transactionTableCache } from '../bootstrap';
import { v4 as uuid } from 'uuid';
import { TransactionCacheService } from '../services/transaction-cache.service';
import { startCacheUpdate } from './cache-helper';
import { output } from '@azure/functions';
import { generateRealtimeMessage } from '../libs/signalr';

const transactionPostSchema = z.object({
  type: z.enum(['add_transaction_queue', 'edit_transaction_queue']),
  id: z.string().optional().nullable(),
  amount: z.number().optional().nullable(),
  payee: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  account: z.string().optional().nullable(),
  date: z.string().datetime().optional().nullable(),
  memo: z.string().optional().nullable(),
});

export interface GsheetTransactionModel {
  Id: string;
  Amount: number;
  Payee: string;
  Category: string;
  Account: string;
  Date: string;
  Memo: string;
  UpdatedAt: string;
}

function parseTransactionToGoogleSheet(data: z.infer<typeof transactionPostSchema>): GsheetTransactionModel {
  return {
    /**
     * Transaction amount is negative, however,
     * we need to store it as positive for better experience while using only google sheet
     */
    Id: data.id ? data.id : uuid(),
    Amount: data.amount ? parseFloat(data.amount.toFixed(2)) * -1 : 0,
    Payee: data.payee ?? '',
    Category: data.category ?? '',
    Account: data.account ?? '',
    Date: data.date ? dateStringTimezone(data.date) : '',
    Memo: data.memo ?? '',
    UpdatedAt: dateTimeStringTimezone(new Date()),
  };
}

const signalrOutput = output.generic({
  type: 'signalR',
  hubName: 'serverless',
  connectionStringSetting: 'AzureSignalRConnectionString',
});

const queueOutput = output.storageQueue({
  connection: 'AzureWebJobsStorage',
  queueName: 'budgetlongqueue',
});

export default func
  .storageQueue('handleTransactionQueue', {
    connection: 'AzureWebJobsStorage',
    queueName: 'budgetqueue',
    extraOutputs: [signalrOutput, queueOutput],
  })
  .handler(async c => {
    const context = c.context;
    context.log('Storage queue function processed work item:', c.trigger);
    const triggerMetadata = c.context.triggerMetadata;
    context.log('Queue metadata (dequeueCount):', triggerMetadata?.dequeueCount);
    const data = transactionPostSchema.parse(c.trigger);
    const googleSheetData = parseTransactionToGoogleSheet(data);
    context.log('Parsed data:', googleSheetData);

    if (data.type === 'edit_transaction_queue') {
      if (data.id === null || data.id === undefined) {
        throw new Error('edit_transaction_queue mode, Transaction id is required');
      }
      await sheetClient.transaction.update(data.id, googleSheetData);
      context.log('Transaction updated to google sheet');
      await new TransactionCacheService(c.context, sheetClient.transaction, transactionTableCache).updateWhenExpired(
        'normal'
      );
    } else if (data.type === 'add_transaction_queue') {
      await sheetClient.transaction.append(googleSheetData);
      context.log('Transaction added to google sheet');
      await new TransactionCacheService(c.context, sheetClient.transaction, transactionTableCache).updateWhenExpired(
        'insertOnly'
      );
      context.log('Cache updated');
    } else {
      throw new Error('Invalid transaction type');
    }

    context.extraOutputs.set(signalrOutput, [generateRealtimeMessage('transactionUpdated')]);
    /**
     * Add the transaction to the long queue to update the monthly budget
     */
    context.extraOutputs.set(queueOutput, { type: 'update_monthly_budget' });
  });
