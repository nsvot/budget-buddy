export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface BudgetGoal {
  id: string;
  amount: number;
  period: string;
  notes?: string;
  createdAt: string;
}
