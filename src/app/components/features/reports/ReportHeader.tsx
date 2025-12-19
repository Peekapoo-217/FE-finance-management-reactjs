import React from 'react';
import { Button } from '../../ui/interactive/button';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ReportHeaderProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export function ReportHeader({ onExportPDF, onExportExcel }: ReportHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2>Báo cáo & Thống kê</h2>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onExportPDF}>
          <FileText className="mr-2" size={16} />
          Xuất PDF
        </Button>
        <Button variant="outline" onClick={onExportExcel}>
          <FileSpreadsheet className="mr-2" size={16} />
          Xuất Excel
        </Button>
      </div>
    </div>
  );
}

