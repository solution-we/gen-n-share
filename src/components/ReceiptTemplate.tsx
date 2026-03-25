import React from 'react';

interface ReceiptTemplateProps {
  receiptNumber: number;
  studentName: string;
  className: string;
  division: string;
  description: string;
  amount: number;
  date: string;
  layout?: 'landscape' | 'square';
}

const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ receiptNumber, studentName, className, division, description, amount, date, layout = 'landscape' }, ref) => {
    const isSquare = layout === 'square';
    const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) : '';

    return (
      <div
        ref={ref}
        className={`bg-[#ffffff] ${isSquare ? 'w-[500px] p-6' : 'w-[720px] p-8'}`}
        style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a2e' }}
      >
        {/* Outer border */}
        <div className="border-2 border-[#1a1a2e] p-1">
          <div className="border border-[#1a1a2e] p-4">
            {/* Header */}
            <div className="text-center mb-4">
              <h1
                className="text-2xl font-bold tracking-wide"
                style={{ fontFamily: 'Playfair Display, serif', color: '#1a1a2e' }}
              >
                MAAS ACADEMY
              </h1>
              <p className="text-xs mt-1" style={{ color: '#555' }}>
                Excellence in Education
              </p>
            </div>

            {/* Receipt title + number row */}
            <div className="flex items-center justify-between border-t border-b border-[#1a1a2e] py-2 mb-4">
              <span className="text-sm font-semibold tracking-widest uppercase">Receipt</span>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#b91c1c' }}
              >
                No. {receiptNumber}
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-end mb-3">
              <span className="text-sm">
                <span className="font-medium">Date: </span>
                {formattedDate}
              </span>
            </div>

            {/* Student Info */}
            <div className={`${isSquare ? 'space-y-2' : 'grid grid-cols-3 gap-3'} mb-4`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-[50px]">Name:</span>
                <span className="text-sm border-b border-dashed border-[#999] flex-1 pb-0.5">
                  {studentName || '\u00A0'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-[40px]">Class:</span>
                <span className="text-sm border-b border-dashed border-[#999] flex-1 pb-0.5">
                  {className || '\u00A0'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-[40px]">Div:</span>
                <span className="text-sm border-b border-dashed border-[#999] flex-1 pb-0.5">
                  {division || '\u00A0'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium min-w-[50px] mt-0.5">For:</span>
                <span className="text-sm border-b border-dashed border-[#999] flex-1 pb-0.5 min-h-[20px]">
                  {description || '\u00A0'}
                </span>
              </div>
            </div>

            {/* Amount box */}
            <div className="flex justify-end mb-4">
              <div className="border-2 border-[#1a1a2e] px-4 py-2 flex items-center gap-2">
                <span className="text-lg font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>₹</span>
                <span className="text-lg font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {amount > 0 ? amount.toLocaleString('en-IN') : '—'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end pt-4 border-t border-[#1a1a2e]">
              <p className="text-[10px]" style={{ color: '#888' }}>Thank you for your payment</p>
              <div className="text-center">
                <div className="border-t border-[#1a1a2e] w-32 mb-1"></div>
                <span className="text-xs">Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = 'ReceiptTemplate';
export default ReceiptTemplate;
