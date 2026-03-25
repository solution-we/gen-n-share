import React from 'react';
import logoImg from '@/assets/logo.png';

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

    const dots = (count: number) => '.'.repeat(count);

    return (
      <div
        ref={ref}
        className={`bg-[#ffffff] ${isSquare ? 'w-[500px] p-5' : 'w-[720px] p-6'}`}
        style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a2e' }}
      >
        {/* Outer border */}
        <div style={{ border: '3px solid #1a1a2e', padding: '4px' }}>
          <div style={{ border: '1.5px solid #1a1a2e', padding: isSquare ? '16px' : '20px 24px' }}>

            {/* Header: Logo + Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              {/* Logo */}
              <img
                src={logoImg}
                alt="MAAS Academy"
                style={{ height: isSquare ? '60px' : '70px', objectFit: 'contain' }}
              />
              {/* Divider */}
              <div style={{ width: '2px', backgroundColor: '#1a1a2e', alignSelf: 'stretch', minHeight: '50px' }} />
              {/* Address */}
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isSquare ? '13px' : '15px', lineHeight: '1.4', paddingTop: '2px' }}>
                <span style={{ fontWeight: 500 }}>Majma Tower, Jamalangadi, Edavanna P.O,</span><br />
                <span style={{ fontWeight: 500 }}>Pin-676541</span>
              </div>
            </div>

            {/* No. | FEE RECEIPT | Date row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              borderTop: '1px solid #ccc',
              paddingTop: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>No.</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#b91c1c'
                }}>
                  {receiptNumber}
                </span>
              </div>

              <div style={{
                border: '2px solid #1a1a2e',
                padding: '2px 16px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                backgroundColor: '#f0f0f0'
              }}>
                FEE RECEIPT
              </div>

              <div style={{ fontSize: '14px' }}>
                <span style={{ fontWeight: 500 }}>Date</span>
                <span style={{ letterSpacing: '2px' }}>{dots(6)}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Name of Student */}
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ fontWeight: 500 }}>Name of Student</span>
              <span style={{ letterSpacing: '1.5px', borderBottom: '1px dotted #888', display: 'inline-block', minWidth: isSquare ? '280px' : '480px', paddingBottom: '2px', marginLeft: '4px' }}>
                {studentName || '\u00A0'}
              </span>
            </div>

            {/* Class, Div, Description */}
            <div style={{ marginBottom: '8px', fontSize: '14px', display: 'flex', flexWrap: 'wrap', gap: '0px' }}>
              <span style={{ fontWeight: 500 }}>Class</span>
              <span style={{ letterSpacing: '1.5px', borderBottom: '1px dotted #888', display: 'inline-block', minWidth: isSquare ? '60px' : '80px', paddingBottom: '2px', marginLeft: '4px', marginRight: '8px' }}>
                {className || '\u00A0'}
              </span>
              <span style={{ fontWeight: 500 }}>Div</span>
              <span style={{ letterSpacing: '1.5px', borderBottom: '1px dotted #888', display: 'inline-block', minWidth: isSquare ? '40px' : '50px', paddingBottom: '2px', marginLeft: '4px', marginRight: '8px' }}>
                {division || '\u00A0'}
              </span>
              <span style={{ fontWeight: 500 }}>Description</span>
              <span style={{ letterSpacing: '1.5px', borderBottom: '1px dotted #888', display: 'inline-block', flex: 1, minWidth: '100px', paddingBottom: '2px', marginLeft: '4px' }}>
                {description || '\u00A0'}
              </span>
            </div>

            {/* Extra dotted line for description overflow */}
            <div style={{ borderBottom: '1px dotted #888', marginBottom: '14px', height: '18px' }} />

            {/* Amount box */}
            <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '0px', width: isSquare ? '200px' : '250px' }}>
              <div style={{
                border: '2px solid #1a1a2e',
                padding: '6px 10px',
                fontSize: '18px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center'
              }}>
                ₹
              </div>
              <div style={{
                border: '2px solid #1a1a2e',
                borderLeft: 'none',
                padding: '6px 14px',
                fontSize: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px'
              }}>
                {amount > 0 ? amount.toLocaleString('en-IN') : '\u00A0'}
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
