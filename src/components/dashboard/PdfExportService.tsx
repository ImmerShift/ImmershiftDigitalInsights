import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, FileText } from 'lucide-react';

interface PdfExportServiceProps {
  contentRef: React.RefObject<HTMLDivElement>;
  documentTitle?: string;
}

export const PdfExportService: React.FC<PdfExportServiceProps> = ({ contentRef, documentTitle }) => {
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: documentTitle || 'Executive-Report',
  });

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-sm"
    >
      <FileText size={18} />
      Export to PDF
    </button>
  );
};
