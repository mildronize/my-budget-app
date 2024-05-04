import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  /**
   * Enable Microsoft Entra Identity
   */
  ENABLE_MICROSOFT_ENTRA_IDENTITY: z.preprocess((value: unknown) => {
    if (value === "true") {
      return true;
    } else {
      return false;
    }
  }, z.boolean()),
  /**
   * Allowlist of emails that can access the application
   * @default "*" means all emails are allowed
   *
   * @example
   * ALLOW_WHITELIST_PRINCIPAL_NAMES="aaa@gmail.com,bbb@gmail.com"
   *
   * @note
   * Works only if ENABLE_MICROSOFT_ENTRA_IDENTITY is true
   */
  ALLOW_WHITELIST_PRINCIPAL_NAMES: z.preprocess((value: unknown) => {
    if (value === undefined || value === "") {
      return ["*"];
    } else if (typeof value === "string") {
      return value.split(",");
    }
    throw new Error(
      "Invalid ALLOW_WHITELIST_PRINCIPAL_NAMES, example: 'aaa@gmail.com,bbb@gmail.com'"
    );
  }, z.array(z.string())),

  /**
   * Azure Storage Connection String
   */
  AZURE_STORAGE_CONNECTION_STRING: z
    .string()
    .default("UseDevelopmentStorage=true"),

  /**
   * Azure Storage Queue Name
   * 
   * It's should be `transactionqueue`
   */
  AZURE_STORAGE_QUEUE_BUDGET_QUEUE_NAME: z.string().default("budgetqueue"),

  /**
   * Azure Storage Budget Long Queue Name
   */
  AZURE_STORAGE_QUEUE_BUDGET_LONG_QUEUE_NAME: z.string().default("budgetlongqueue"),

  /**
   * Azure Storage Table Name for Select Table
   */
  AZURE_STORAGE_TABLE_BUDGET_TABLE_NAME: z.string().default("BudgetSelect"),
  /**
   * Azure Storage Table Name for Transaction Cache Table
   */
  AZURE_STORAGE_TABLE_TRANSACTION_CACHE_TABLE_NAME: z
    .string()
    .default("BudgetTransactionCache"),
  /**
   * Azure Storage Table Name, Monthly Budget Cache Table
   */
  AZURE_STORAGE_TABLE_MONTHLY_BUDGET_CACHE_TABLE_NAME: z
    .string()
    .default("MonthlyBudgetCache"),
  /**
   * Azure Storage Table Name, Monthly Budget Summary Cache Table
   */
  AZURE_STORAGE_TABLE_MONTHLY_BUDGET_SUMMARY_CACHE_TABLE_NAME: z
    .string()
    .default("MonthlyBudgetSummaryCache"),

  /**
   *  Google Sheet Private Key
   *
   *  NOTE:
   *  we need to replace the escaped newline characters
   *  https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
   */
  GSHEET_PRIVATE_KEY: z.preprocess((value) => {
    if (value === undefined) return "";
    if (typeof value !== "string") {
      throw new Error("GSHEET_PRIVATE_KEY must be a string");
    }
    return value.replace(/\\n/g, "\n");
  }, z.string()),
  /**
   * Google Sheet Client Email
   */
  GSHEET_CLIENT_EMAIL: z.string().default(""),
  /**
   * Google Sheet ID
   */
  GSHEET_SPREADSHEET_ID: z.string().default(""),
  /**
   * Google Sheet, Transaction Sheet ID
   */
  GSHEET_SHEET_TRANSACTION_SHEET_ID: z.preprocess((value) => {
    if (value === undefined) return -1;
    if (typeof value !== "string") {
      throw new Error("GSHEET_SHEET_TRANSACTION_SHEET_ID must be a string");
    }
    return parseInt(value, 10);
  }, z.number()),
  /**
   * Timezone
   */
  TIMEZONE: z.string().default("Asia/Bangkok"),

  /**
   * Reset Cache PATH
   */
  AZURE_FUNCTION_RESET_CACHE_PATH: z.string().default("/api/resetcache"),
  /**
   * Azure Function URL
   */
  NEXT_PUBLIC_AZURE_FUNCTION_URL: z.string().default("http://localhost:7071"),
});

function printSecretFields(
  data: Record<string, unknown>,
  secretFields: string[]
) {
  const parsedEnv: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    parsedEnv[key] = secretFields.includes(key as any)
      ? `${String(value).substring(0, 10)}${value === "" ? "" : "..."}`
      : value;
  }
  return parsedEnv;
}

function parseZodPrettyError(env: Record<string, unknown>) {
  try {
    const data = envSchema.parse(env);
    const parsedEnv = printSecretFields(data, [
      "AZURE_STORAGE_CONNECTION_STRING",
      "GSHEET_PRIVATE_KEY",
    ] as (keyof typeof data)[]);
    console.debug("Environment Variables: ", parsedEnv);
    return data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Invalid environment variables: " + fromZodError(error).message
      );
    }
    throw error;
  }
}

export const env = parseZodPrettyError(process.env);
