import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import 'dotenv/config';

function parseGSheetId(value: unknown, name?: string): number {
  if (value === undefined) return -1;
  const varName = name ?? 'GSHEET_SHEET_ID';
  if (typeof value !== 'string') {
    throw new Error(`${varName} must be a string`);
  }
  const data = parseInt(value);
  if (isNaN(data)) {
    throw new Error(`${varName} must be a number`);
  }
  return data;
}

export const envSchema = z.object({
  /**
   * Azure Storage Account Connection String or Azure WebJobs Storage
   */
  AzureWebJobsStorage: z.string().default('UseDevelopmentStorage=true'),
  /**
   * Azure Storage Table Name, Transaction Cache Table
   */
  AZURE_STORAGE_TABLE_TRANSACTION_CACHE_TABLE_NAME: z.string().default('BudgetTransactionCache'),
  /**
   * Azure Storage Table Name, Monthly Budget Cache Table
   */
  AZURE_STORAGE_TABLE_MONTHLY_BUDGET_CACHE_TABLE_NAME: z.string().default('MonthlyBudgetCache'),
  /**
   * Azure Storage Table Name, Monthly Budget Summary Cache Table
   */
  AZURE_STORAGE_TABLE_MONTHLY_BUDGET_SUMMARY_CACHE_TABLE_NAME: z.string().default('MonthlyBudgetSummaryCache'),
  /**
   *  Google Sheet Private Key
   *
   *  NOTE:
   *  we need to replace the escaped newline characters
   *  https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
   */
  GSHEET_PRIVATE_KEY: z.preprocess(value => {
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      throw new Error('GSHEET_PRIVATE_KEY must be a string');
    }
    return value.replace(/\\n/g, '\n');
  }, z.string()),
  /**
   * Google Sheet Client Email
   */
  GSHEET_CLIENT_EMAIL: z.string().default(''),
  /**
   * Google Sheet ID
   */
  GSHEET_SPREADSHEET_ID: z.string().default(''),
  /**
   * Google Sheet, Page Size
   */
  GSHEET_PAGE_SIZE: z.number().default(100),
  /**
   * Google Sheet, SKIP ROW KEYWORD
   */
  GSHEET_SKIP_ROW_KEYWORD: z.string().default('SKIP_ROW'),
  /**
   * Google Sheet, Transaction Sheet ID
   */
  GSHEET_SHEET_TRANSACTION_SHEET_ID: z.preprocess(
    value => parseGSheetId(value, 'GSHEET_SHEET_TRANSACTION_SHEET_ID'),
    z.number()
  ),
  /**
   * Google Sheet, Monthly Budget Sheet ID
   */
  GSHEET_SHEET_MONTHLY_BUDGET_SHEET_ID: z.preprocess(
    value => parseGSheetId(value, 'GSHEET_SHEET_MONTHLY_BUDGET_SHEET_ID'),
    z.number()
  ),
  /**
   * Google Sheet, Monthly Budget Summary Sheet ID
   */
  GSHEET_SHEET_MONTHLY_BUDGET_SUMMARY_SHEET_ID: z.preprocess(
    value => parseGSheetId(value, 'GSHEET_SHEET_MONTHLY_BUDGET_SUMMARY_SHEET_ID'),
    z.number()
  ),
  /**
   * Google Sheet, Required Field for Transaction Sheet ID
   *
   * Use for checking the required field in the row read
   * If the required field is empty, the row will be skipped
   */
  // GSHEET_SHEET_TRANSACTION_REQUIRED_FIELD: z.string().default('Title'),

  /**
   * Timezone
   */
  TIMEZONE: z.string().default('Asia/Bangkok'),

  /**
   * Azure SignalR Connection String
   */
  AzureSignalRConnectionString: z.string(),
});

function printSecretFields(data: Record<string, unknown>, secretFields: string[]) {
  const parsedEnv: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    parsedEnv[key] = secretFields.includes(key as any)
      ? `${String(value).substring(0, 10)}${value === '' ? '' : '...'}`
      : value;
  }
  return parsedEnv;
}

function parseZodPrettyError(env: Record<string, unknown>) {
  try {
    const data = envSchema.parse(env);
    const parsedEnv = printSecretFields(data, ['GSHEET_PRIVATE_KEY'] as (keyof typeof data)[]);
    console.debug('Environment Variables: ', parsedEnv);
    return data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid environment variables: ' + fromZodError(error).message);
    }
    throw error;
  }
}

export const env = parseZodPrettyError(process.env);
