import { Report } from '../services/api';

export interface ParsedReportData {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  categoryExpenseData: Array<{ name: string; value: number }>;
  monthlyComparison: Array<{ month: string; income: number; expense: number }>;
  trendData: Array<{ name: string; amount: number }>;
  budgetStatus: Array<{
    category: string;
    limitAmount: number;
    spentAmount: number;
    percentage: number;
  }>;
}

export function parseReportData(report: Report | null): {
  data: ParsedReportData | null;
  error: Error | null;
} {
  if (!report || !report.dataJson) {
    return { data: null, error: new Error('Không có dữ liệu báo cáo') };
  }

  try {
    let parsedData: any;
    
    if (typeof report.dataJson === 'string') {
      parsedData = JSON.parse(report.dataJson);
    } else {
      parsedData = report.dataJson;
    }

    const data: ParsedReportData = {
      totalIncome: parsedData?.totalIncome || 0,
      totalExpense: parsedData?.totalExpense || 0,
      savings: parsedData?.savings || 0,
      categoryExpenseData: Array.isArray(parsedData?.categoryExpenseData) 
        ? parsedData.categoryExpenseData 
        : [],
      monthlyComparison: Array.isArray(parsedData?.monthlyComparison) 
        ? parsedData.monthlyComparison 
        : [],
      trendData: Array.isArray(parsedData?.trendData) 
        ? parsedData.trendData 
        : [],
      budgetStatus: Array.isArray(parsedData?.budgetStatus) 
        ? parsedData.budgetStatus 
        : [],
    };

    return { data, error: null };
  } catch (err: any) {
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Không thể parse dữ liệu báo cáo') 
    };
  }
}

