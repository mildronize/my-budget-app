import { env } from './env';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GoogleSheetRowClient } from './libs/google-sheet';
import { TableClient } from '@azure/data-tables';
import { AzureTable } from './libs/azure-table';
import { TransactionCacheEntity } from './entities/transaction.entity';
import { AzureTableCache } from './libs/azure-table-cache';
import { MonthlyBudgetCacheEntity, MonthlyBudgetSummaryCacheEntity } from './entities/monthly-budget.entity';

/**
 * Google Sheet Service
 */

const serviceAccountAuth = new JWT({
  email: env.GSHEET_CLIENT_EMAIL,
  key: env.GSHEET_PRIVATE_KEY,
  /**
   * Authentication Scope, read more: https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=auth-scopes
   */
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
});

export const sheetDoc = new GoogleSpreadsheet(env.GSHEET_SPREADSHEET_ID, serviceAccountAuth);

const commonOptions = {
  pageSize: env.GSHEET_PAGE_SIZE,
  skipRowKeyword: env.GSHEET_SKIP_ROW_KEYWORD,
};

export const sheetClient = {
  transaction: new GoogleSheetRowClient(sheetDoc, env.GSHEET_SHEET_TRANSACTION_SHEET_ID, {
    ...commonOptions,
    headers: {
      Id: 'string',
      Amount: 'number',
      Payee: 'string',
      Category: 'string',
      Account: 'string',
      Date: 'date',
      Memo: 'string',
      UpdatedAt: 'date',
    },
  }),
  monthlyBudget: new GoogleSheetRowClient(sheetDoc, env.GSHEET_SHEET_MONTHLY_BUDGET_SHEET_ID, {
    ...commonOptions,
    headers: {
      Id: 'string',
      Title: 'string',
      Hide: 'boolean',
      Type: 'string',
      CategoryGroup: 'string',
      CategoryGroupID: 'string',
      Selectable: 'boolean',
      BaseOrder: 'number',
      Order: 'number',
      /**
       * for partition key, we use MonthKey
       *
       * pattern is 'YYYY-MM'
       * e.g. '2021-01'
       */
      FilterMonth: 'string',
      Assigned: 'number',
      Activity: 'number',
      CumulativeAssigned: 'number',
      CumulativeActivity: 'number',
      Available: 'number',
    },
  }),
  monthlyBudgetSummary: new GoogleSheetRowClient(sheetDoc, env.GSHEET_SHEET_MONTHLY_BUDGET_SUMMARY_SHEET_ID, {
    ...commonOptions,
    headerRow: 2,
    headers: {
      LatestUpdate: 'date',
      StartBudgetDate: 'date',
      FilterMonth: 'date',
      StartDate: 'date',
      EndDate: 'date',
      ReadyToAssign: 'number',
      TotalIncome: 'number',
      TotalAssigned: 'number',
      TotalActivity: 'number',
      TotalAvailable: 'number',
    },
  }),
};

/**
 * ----------------------------------------
 * Azure Table Service
 * ----------------------------------------
 */
/**
 * Azure Table, Transaction Cache Table
 */
const transactionCacheTableClient = TableClient.fromConnectionString(
  env.AzureWebJobsStorage,
  env.AZURE_STORAGE_TABLE_TRANSACTION_CACHE_TABLE_NAME
);
const transactionCacheTable = new AzureTable<TransactionCacheEntity>(transactionCacheTableClient);
export const transactionTableCache = new AzureTableCache(transactionCacheTable, {
  /**
   * Default field in Azure Table
   */
  lastUpdatedField: 'timestamp',
});

/**
 * Azure Table, Monthly Budget Cache Table
 */
const monthlyBudgetCacheTableClient = TableClient.fromConnectionString(
  env.AzureWebJobsStorage,
  env.AZURE_STORAGE_TABLE_MONTHLY_BUDGET_CACHE_TABLE_NAME
);
const monthlyBudgetCacheTable = new AzureTable<MonthlyBudgetCacheEntity>(monthlyBudgetCacheTableClient);
export const monthlyBudgetTableCache = new AzureTableCache(monthlyBudgetCacheTable, {
  /**
   * Default field in Azure Table
   */
  lastUpdatedField: 'timestamp',
});

/**
 * Azure Table, Monthly Budget Summary Cache Table
 */
const monthlyBudgetSummaryCacheTableClient = TableClient.fromConnectionString(
  env.AzureWebJobsStorage,
  env.AZURE_STORAGE_TABLE_MONTHLY_BUDGET_SUMMARY_CACHE_TABLE_NAME
);
const monthlyBudgetSummaryCacheTable = new AzureTable<MonthlyBudgetSummaryCacheEntity>(
  monthlyBudgetSummaryCacheTableClient
);
export const monthlyBudgetSummaryTableCache = new AzureTableCache(monthlyBudgetSummaryCacheTable, {
  /**
   * Default field in Azure Table
   */
  lastUpdatedField: 'timestamp',
});
