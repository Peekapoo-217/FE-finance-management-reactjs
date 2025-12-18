import { Transaction, Budget } from '../services/api';

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.category?.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function calculateTotalExpense(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function calculateTotalWalletBalance(wallets: any[]): number {
  return wallets.reduce((sum, w) => sum + Number(w.balance), 0);
}

export function getCategoryExpenseData(transactions: Transaction[]) {
  return transactions
    .filter(t => t.category?.type === 'expense')
    .reduce((acc: any, t) => {
      const categoryName = t.category?.name || 'Khác';
      const existing = acc.find((item: any) => item.name === categoryName);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ name: categoryName, value: Number(t.amount) });
      }
      return acc;
    }, []);
}

export function getMonthlyData(transactions: Transaction[]) {
  const now = new Date();
  const months: Array<{ month: string; income: number; expense: number }> = [];
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `T${date.getMonth() + 1}`;
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.transactionDate);
      return tDate.getFullYear() === date.getFullYear() && 
             tDate.getMonth() === date.getMonth();
    });
    
    const income = monthTransactions
      .filter(t => t.category?.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = monthTransactions
      .filter(t => t.category?.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    months.push({ month: monthLabel, income, expense });
  }
  
  return months;
}

export function getBudgetAlerts(budgets: Budget[]) {
  return budgets.filter(budget => {
    const percentage = (Number(budget.spentAmount) / Number(budget.limitAmount)) * 100;
    return percentage >= 80;
  });
}

