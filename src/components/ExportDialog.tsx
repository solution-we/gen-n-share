import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Monitor, Smartphone } from 'lucide-react';
import ReceiptTemplate from './ReceiptTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: {
    receipt_number: number;
    student_name: string;
    class: string;
    division: string;
    description: string;
    amount: number;
    date: string;
  };
  onExported?: () => void;
}

export default function ExportDialog({ open, onOpenChange, receipt, onExported }: ExportDialogProps) {
  const [layout, setLayout] = useState<'landscape' | 'square'>('landscape');
  const [exporting, setExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const doExport = async (format: 'png' | 'pdf' | 'jpg') => {
    if (!receiptRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const fileName = `receipt-${receipt.receipt_number}`;

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: layout === 'landscape' ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width / 3, canvas.height / 3],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
        pdf.save(`${fileName}.pdf`);
      } else {
        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
        link.click();
      }
      onExported?.();
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Export Receipt</DialogTitle>
        </DialogHeader>

        {/* Layout choice */}
        <div className="flex gap-3 mb-4">
          <Button
            variant={layout === 'landscape' ? 'default' : 'outline'}
            onClick={() => setLayout('landscape')}
            className="flex-1 gap-2"
          >
            <Monitor className="w-4 h-4" /> Landscape
          </Button>
          <Button
            variant={layout === 'square' ? 'default' : 'outline'}
            onClick={() => setLayout('square')}
            className="flex-1 gap-2"
          >
            <Smartphone className="w-4 h-4" /> Square
          </Button>
        </div>

        {/* Preview */}
        <div className="flex justify-center overflow-auto bg-muted rounded-lg p-4">
          <div className="transform scale-[0.65] origin-top">
            <ReceiptTemplate
              ref={receiptRef}
              receiptNumber={receipt.receipt_number}
              studentName={receipt.student_name}
              className={receipt.class}
              division={receipt.division}
              description={receipt.description}
              amount={receipt.amount}
              date={receipt.date}
              layout={layout}
            />
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex gap-3 mt-4">
          <Button onClick={() => doExport('png')} disabled={exporting} className="flex-1 gap-2">
            <Download className="w-4 h-4" /> PNG
          </Button>
          <Button onClick={() => doExport('pdf')} disabled={exporting} className="flex-1 gap-2">
            <Download className="w-4 h-4" /> PDF
          </Button>
          <Button onClick={() => doExport('jpg')} disabled={exporting} variant="outline" className="flex-1 gap-2">
            <Download className="w-4 h-4" /> JPG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
