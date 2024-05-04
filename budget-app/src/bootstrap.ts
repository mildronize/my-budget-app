import { QueueServiceClient } from "@azure/storage-queue";
import { env } from "./env";
import { AzureStorageQueue } from "./libs/azure-storage-queue";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { TableClient } from "@azure/data-tables";
import { AzureTable } from "./libs/azure-table";
import { SelectEntity } from "./entites/select.entity";
import { TransactionCacheEntity } from "./entites/transaction.entity";
import {
  MonthlyBudgetCacheEntity,
  MonthlyBudgetSummaryCacheEntity,
} from "./entites/monthly-budget.entity";

/**
 * Azure Storage Queue Client
 */

const queueServiceClient = QueueServiceClient.fromConnectionString(
  env.AZURE_STORAGE_CONNECTION_STRING
);

export const queue = new AzureStorageQueue(
  queueServiceClient,
  env.AZURE_STORAGE_QUEUE_BUDGET_QUEUE_NAME
);

export const longQueue = new AzureStorageQueue(
  queueServiceClient,
  env.AZURE_STORAGE_QUEUE_BUDGET_LONG_QUEUE_NAME
);

/**
 * Azure Storage Queue Poison Client
 *
 * This queue is used to store the failed messages
 * Automatically created by the Azure Function
 */
export const poisonQueue = new AzureStorageQueue(
  queueServiceClient,
  `${env.AZURE_STORAGE_QUEUE_BUDGET_QUEUE_NAME}-poison`
);

export const longPoisonQueue = new AzureStorageQueue(
  queueServiceClient,
  `${env.AZURE_STORAGE_QUEUE_BUDGET_LONG_QUEUE_NAME}-poison`
);

/**
 * Azure Table Client
 */

export const selectTable = new AzureTable<SelectEntity>(
  TableClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
    env.AZURE_STORAGE_TABLE_BUDGET_TABLE_NAME
  )
);
export const transactionCacheTable = new AzureTable<TransactionCacheEntity>(
  TableClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
    env.AZURE_STORAGE_TABLE_TRANSACTION_CACHE_TABLE_NAME
  )
);
export const monthlyBudgetTable = new AzureTable<MonthlyBudgetCacheEntity>(
  TableClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
    env.AZURE_STORAGE_TABLE_MONTHLY_BUDGET_CACHE_TABLE_NAME
  )
);
export const monthlyBudgetSummaryTable =
  new AzureTable<MonthlyBudgetSummaryCacheEntity>(
    TableClient.fromConnectionString(
      env.AZURE_STORAGE_CONNECTION_STRING,
      env.AZURE_STORAGE_TABLE_MONTHLY_BUDGET_SUMMARY_CACHE_TABLE_NAME
    )
  );
/**
 * Google Sheet Service
 */

const serviceAccountAuth = new JWT({
  email: env.GSHEET_CLIENT_EMAIL,
  key: env.GSHEET_PRIVATE_KEY,
  /**
   * Authentication Scope, read more: https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=auth-scopes
   */
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ],
});

export const sheetDoc = new GoogleSpreadsheet(
  env.GSHEET_SPREADSHEET_ID,
  serviceAccountAuth
);
