import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useReports, useReportCategories } from "../../hooks/useReports";
import { useReportExport } from "../../hooks/useReportExport";
import { parseReportData } from "../../utils/reportUtils";
import { ReportHeader } from "../features/reports/ReportHeader";
import { ReportFilters } from "../features/reports/ReportFilters";
import { ReportSummary } from "../features/reports/ReportSummary";
import { ReportPieChart } from "../features/reports/ReportPieChart";
import { ReportBarChart } from "../features/reports/ReportBarChart";
import { ReportLineChart } from "../features/reports/ReportLineChart";
import { ReportTable } from "../features/reports/ReportTable";
import { CategoryBudgetStatus } from "../features/reports/CategoryBudgetStatus";
import { CategoryComparisonChart } from "../features/reports/CategoryComparisonChart";

export function ReportsPage() {
  const [category, setCategory] = useState('all');
  const { loading, error, report, reportId, refetch } = useReports(category);
  const { categories } = useReportCategories();
  const { handleExportPDF, handleExportExcel } = useReportExport();

  const { data, error: parseError } = parseReportData(report);

  if (error || parseError) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-red-500 mb-2">Lỗi: {(error || parseError)?.message}</p>
          <button 
            onClick={refetch}
            className="text-blue-600 hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin mr-2" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Không có dữ liệu báo cáo</p>
          <button 
            onClick={refetch}
            className="text-blue-600 hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const isAllCategories = category === 'all';

  return (
    <div className="space-y-6">
      <ReportHeader 
        onExportPDF={() => handleExportPDF(reportId)} 
        onExportExcel={() => handleExportExcel(reportId)} 
      />

      <ReportFilters
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
      />

      {isAllCategories ? (
        <>
          <ReportSummary
            totalIncome={data.totalIncome}
            totalExpense={data.totalExpense}
            savings={data.savings}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportPieChart data={data.categoryExpenseData} />
            <CategoryComparisonChart data={data.categoryExpenseData} />
          </div>

          <CategoryBudgetStatus budgetStatus={data.budgetStatus} />

          <ReportBarChart data={data.monthlyComparison} />

          <ReportTable data={data.categoryExpenseData} totalExpense={data.totalExpense} />
        </>
      ) : (
        <>
          <ReportSummary
            totalIncome={data.totalIncome}
            totalExpense={data.totalExpense}
            savings={data.savings}
            categoryName={category}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportBarChart data={data.monthlyComparison} />
            <ReportLineChart data={data.trendData} />
          </div>

          <CategoryBudgetStatus budgetStatus={data.budgetStatus} categoryName={category} />

          {data.categoryExpenseData.length > 0 && (
            <>
              <CategoryComparisonChart data={data.categoryExpenseData} />
              <ReportTable data={data.categoryExpenseData} totalExpense={data.totalExpense} />
            </>
          )}
        </>
      )}
    </div>
  );
}

