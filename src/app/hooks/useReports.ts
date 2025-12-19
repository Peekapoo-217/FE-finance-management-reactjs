import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { reportApi, budgetApi, type Report, type BudgetCategory, type Budget } from '../services/api';

export function useReports(category: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [category]);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const newReport = await reportApi.create({ 
        category: category && category !== 'all' ? category : undefined 
      });
      
      if (typeof newReport.dataJson === 'string') {
        newReport.dataJson = JSON.parse(newReport.dataJson);
      }
      
      if (!newReport) {
        throw new Error('Không nhận được dữ liệu báo cáo');
      }
      
      setReport(newReport);
      setReportId(newReport.id);
    } catch (error: any) {
      const errorMessage = error.message || 'Lỗi không xác định';
      setError(new Error(errorMessage));
      toast.error('Lỗi tải báo cáo: ' + errorMessage);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    report,
    reportId,
    refetch: loadReport,
  };
}

export function useReportCategories() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const budgets = await budgetApi.getAll();
      const uniqueCategories = budgets
        .filter((budget: Budget) => budget.category && budget.category.type === 'expense')
        .map((budget: Budget) => budget.category!)
        .filter((category: BudgetCategory, index: number, self: BudgetCategory[]) => 
          index === self.findIndex((c: BudgetCategory) => c.id === category.id)
        );
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Lỗi tải danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    refetch: loadCategories,
  };
}

