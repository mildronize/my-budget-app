import { InvocationContext } from '@azure/functions';
import {
  monthlyBudgetSummaryTableCache,
  monthlyBudgetTableCache,
  sheetClient,
  transactionTableCache,
} from '../bootstrap';
import { MonthlyBudgetCacheService, MonthlyBudgetSummaryCacheService } from '../services/monthly-budget-cache.service';
import { TransactionCacheService } from '../services/transaction-cache.service';

export async function startCacheUpdate(context: InvocationContext, partial = false) {
  const workers: Promise<void>[] = [];

  if (!partial) {
    workers.push(
      new TransactionCacheService(context, sheetClient.transaction, transactionTableCache).updateWhenExpired()
    );
    workers.push(
      new TransactionCacheService(context, sheetClient.transaction, transactionTableCache).deleteNonExistentRows()
    );
  }

  workers.push(
    new MonthlyBudgetSummaryCacheService(
      context,
      sheetClient.monthlyBudgetSummary,
      monthlyBudgetSummaryTableCache
    ).forceUpdate()
  );

  workers.push(
    new MonthlyBudgetCacheService(context, sheetClient.monthlyBudget, monthlyBudgetTableCache).forceUpdate()
  );

  const result = await Promise.allSettled(workers);
  let isError = false;
  const errors: string[] = [];
  for (const res of result) {
    if (res.status === 'rejected') {
      isError = true;
      errors.push(res.reason);
    }
  }
  if (isError) {
    throw new Error(errors.join('\n'));
  }
}
