import { toast } from 'sonner';
import { reportApi } from '../services/api';

export function useReportExport() {
  const handleExportPDF = async (reportId: string | null) => {
    if (!reportId) {
      toast.error('Chưa có báo cáo để xuất');
      return;
    }
    try {
      toast.loading('Đang xuất báo cáo PDF...');
      await reportApi.exportReport(reportId, 'pdf');
      toast.success('Xuất PDF thành công!');
    } catch (error: any) {
      toast.error('Lỗi xuất PDF: ' + error.message);
    }
  };

  const handleExportExcel = async (reportId: string | null) => {
    if (!reportId) {
      toast.error('Chưa có báo cáo để xuất');
      return;
    }
    try {
      toast.loading('Đang xuất báo cáo Excel...');
      await reportApi.exportReport(reportId, 'excel');
      toast.success('Xuất Excel thành công!');
    } catch (error: any) {
      toast.error('Lỗi xuất Excel: ' + error.message);
    }
  };

  return {
    handleExportPDF,
    handleExportExcel,
  };
}

