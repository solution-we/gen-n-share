import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import ReceiptTemplate from '@/components/ReceiptTemplate';
import StudentAutocomplete from '@/components/StudentAutocomplete';
import ExportDialog from '@/components/ExportDialog';
import ShareDialog from '@/components/ShareDialog';
import { useReceipts } from '@/hooks/useReceipts';

export default function GenerateReceipt() {
  const navigate = useNavigate();
  const { nextNumber, createReceipt } = useReceipts();

  const [form, setForm] = useState({
    student_name: '',
    class: '',
    division: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleGenerate = async () => {
    if (!form.student_name || !form.class || !form.division || !form.description || !form.amount) return;

    const result = await createReceipt.mutateAsync({
      student_name: form.student_name,
      class: form.class,
      division: form.division,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
    });

    setGeneratedReceipt(result);
    setShowExport(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentAmount = parseFloat(form.amount) || 0;

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto flex items-center gap-3 py-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-bold">Generate Receipt</h1>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-5 animate-fade-in">
            <div className="bg-card rounded-xl p-6 receipt-shadow border border-border">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground">Receipt Details</h2>
                <span className="font-receipt text-sm text-receipt-red font-bold">
                  No. {nextNumber}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Student Name</Label>
                  <StudentAutocomplete
                    value={form.student_name}
                    onChange={(v) => setForm({ ...form, student_name: v })}
                    onSelect={(s) =>
                      setForm({ ...form, student_name: s.name, class: s.class, division: s.division })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Class</Label>
                    <Input
                      placeholder="e.g. 10"
                      value={form.class}
                      onChange={(e) => setForm({ ...form, class: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Division</Label>
                    <Input
                      placeholder="e.g. A"
                      value={form.division}
                      onChange={(e) => setForm({ ...form, division: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Tuition fee for March 2025"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleGenerate}
                  disabled={createReceipt.isPending || !form.student_name || !form.amount}
                  className="flex-1"
                >
                  {createReceipt.isPending ? 'Generating...' : 'Generate Receipt'}
                </Button>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="w-4 h-4" />
                </Button>
                {generatedReceipt && (
                  <Button variant="outline" size="icon" onClick={() => setShowShare(true)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="font-semibold text-foreground mb-3">Live Preview</h2>
            <div className="bg-muted rounded-xl p-4 overflow-auto">
              <div className="transform scale-[0.85] origin-top-left">
                <ReceiptTemplate
                  receiptNumber={nextNumber}
                  studentName={form.student_name}
                  className={form.class}
                  division={form.division}
                  description={form.description}
                  amount={currentAmount}
                  date={form.date}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Dialog */}
      {generatedReceipt && (
        <ExportDialog
          open={showExport}
          onOpenChange={setShowExport}
          receipt={generatedReceipt}
          onExported={() => setShowShare(true)}
        />
      )}

      {/* Share Dialog */}
      {generatedReceipt && (
        <ShareDialog
          open={showShare}
          onOpenChange={setShowShare}
          receiptNumber={generatedReceipt.receipt_number}
        />
      )}
    </div>
  );
}
