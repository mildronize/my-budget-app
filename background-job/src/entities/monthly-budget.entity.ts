import { AzureTableEntityBase } from '../libs/azure-table';

/**
 * Monthly Budget Cache Entity
 *
 * This entity is used to cache monthly budget data from Google Sheet
 *
 * Partition Key: MonthKey
 * Row Key: id
 */

export interface MonthlyBudgetCacheEntity extends AzureTableEntityBase {
  /**
   * Rowkey is same value of `id`
   */
  id: string;
  title: string;
  hide: boolean;
  type: string;
  categoryGroup: string;
  categoryGroupID: string;
  selectable: boolean;
  baseOrder: number;
  order: number;
  /**
   * for partition key, we use MonthKey
   *
   * pattern is 'YYYY-MM'
   * e.g. '2021-01'
   */
  filterMonth: Date;
  assigned: number;
  activity: number;
  cumulativeAssigned: number;
  cumulativeActivity: number;
  available: number;
}

/**
 * Monthly Budget Summary Cache Entity
 *
 * This entity is used to cache monthly budget summary data from Google Sheet
 *
 * Partition Key: year from filterMonth (e.g. '2021')
 * Row Key: MonthKey from filterMonth (e.g. '2021-01')
 */

export interface MonthlyBudgetSummaryCacheEntity extends AzureTableEntityBase {
  latestUpdate: Date;
  startBudgetDate: Date;
  filterMonth: Date;
  startDate: Date;
  endDate: Date;
  readyToAssign: number;
  totalIncome: number;
  totalAssigned: number;
  totalActivity: number;
  totalAvailable: number;
}
