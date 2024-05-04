export interface BudgetItem {
  id: string;
  name: string;
  assigned: number;
  activity: number;
  available: number;
  order: number;
  isHidden: boolean;
}

export interface BudgetGroupItem {
  id: string;
  name: string;
  totalAssigned: number,
  totalAvailable: number,
  order: number;
  countOverspent: number;
  budgetItems: BudgetItem[];
}