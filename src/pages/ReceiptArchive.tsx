import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft, Search, ChevronRight, Calendar, FolderOpen,
  FileText, Trash2, Download, Share2, Printer,
} from 'lucide-react';
import { useReceipts } from '@/hooks/useReceipts';
import ReceiptTemplate from '@/components/ReceiptTemplate';
import ExportDialog from '@/components/ExportDialog';
import ShareDialog from '@/components/ShareDialog';

type BrowseLevel = 'year' | 'month' | 'class' | 'student' | 'receipts';

export default function ReceiptArchive() {
  const navigate = useNavigate();
  const { receipts, isLoading, deleteLatestReceipt } = useReceipts();

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<BrowseLevel>('year');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const [previewReceipt, setPreviewReceipt] = useState<any>(null);
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const filteredReceipts = useMemo(() => {
    if (!search) return receipts;
    const q = search.toLowerCase();
    return receipts.filter(
      (r) =>
        r.student_name.toLowerCase().includes(q) ||
        r.receipt_number.toString().includes(q) ||
        r.class.toLowerCase().includes(q)
    );
  }, [receipts, search]);

  // Hierarchy data
  const years = useMemo(() => {
    const set = new Set(filteredReceipts.map((r) => new Date(r.date).getFullYear().toString()));
    return Array.from(set).sort().reverse();
  }, [filteredReceipts]);

  const months = useMemo(() => {
    const filtered = filteredReceipts.filter(
      (r) => new Date(r.date).getFullYear().toString() === selectedYear
    );
    const set = new Set(filtered.map((r) => (new Date(r.date).getMonth() + 1).toString().padStart(2, '0')));
    return Array.from(set).sort().reverse();
  }, [filteredReceipts, selectedYear]);

  const classes = useMemo(() => {
    const filtered = filteredReceipts.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getFullYear().toString() === selectedYear &&
        (d.getMonth() + 1).toString().padStart(2, '0') === selectedMonth
      );
    });
    const set = new Set(filtered.map((r) => r.class));
    return Array.from(set).sort();
  }, [filteredReceipts, selectedYear, selectedMonth]);

  const students = useMemo(() => {
    const filtered = filteredReceipts.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getFullYear().toString() === selectedYear &&
        (d.getMonth() + 1).toString().padStart(2, '0') === selectedMonth &&
        r.class === selectedClass
      );
    });
    const set = new Set(filtered.map((r) => r.student_name));
    return Array.from(set).sort();
  }, [filteredReceipts, selectedYear, selectedMonth, selectedClass]);

  const studentReceipts = useMemo(() => {
    return filteredReceipts.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getFullYear().toString() === selectedYear &&
        (d.getMonth() + 1).toString().padStart(2, '0') === selectedMonth &&
        r.class === selectedClass &&
        r.student_name === selectedStudent
      );
    });
  }, [filteredReceipts, selectedYear, selectedMonth, selectedClass, selectedStudent]);

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const latestReceiptNumber = receipts.length > 0 ? receipts[0].receipt_number : null;

  const goBack = () => {
    if (level === 'receipts') setLevel('student');
    else if (level === 'student') setLevel('class');
    else if (level === 'class') setLevel('month');
    else if (level === 'month') setLevel('year');
  };

  const breadcrumb = () => {
    const parts: string[] = [];
    if (selectedYear) parts.push(selectedYear);
    if (selectedMonth) parts.push(monthNames[parseInt(selectedMonth)]);
    if (selectedClass) parts.push(`Class ${selectedClass}`);
    if (selectedStudent) parts.push(selectedStudent);
    return parts;
  };

  const renderItems = (items: string[], onSelect: (item: string) => void, icon: React.ReactNode) => (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border card-hover text-left"
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-foreground">{item}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      ))}
      {items.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No receipts found</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto flex items-center gap-3 py-3 px-4">
          <Button variant="ghost" size="icon" onClick={level === 'year' ? () => navigate('/') : goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-bold">Receipt Archive</h1>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 animate-fade-in">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, receipt number, or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Breadcrumb */}
        {level !== 'year' && (
          <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground flex-wrap">
            <button onClick={() => setLevel('year')} className="hover:text-foreground transition-colors">
              Archive
            </button>
            {breadcrumb().map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                <span className={i === breadcrumb().length - 1 ? 'text-foreground font-medium' : ''}>
                  {part}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading receipts...</p>
        ) : (
          <>
            {level === 'year' &&
              renderItems(
                years,
                (y) => { setSelectedYear(y); setLevel('month'); },
                <Calendar className="w-5 h-5 text-primary" />
              )}
            {level === 'month' &&
              renderItems(
                months.map((m) => monthNames[parseInt(m)]),
                (m) => {
                  const idx = monthNames.indexOf(m).toString().padStart(2, '0');
                  setSelectedMonth(idx);
                  setLevel('class');
                },
                <FolderOpen className="w-5 h-5 text-accent" />
              )}
            {level === 'class' &&
              renderItems(
                classes.map((c) => `Class ${c}`),
                (c) => { setSelectedClass(c.replace('Class ', '')); setLevel('student'); },
                <FolderOpen className="w-5 h-5 text-primary" />
              )}
            {level === 'student' &&
              renderItems(
                students,
                (s) => { setSelectedStudent(s); setLevel('receipts'); },
                <FileText className="w-5 h-5 text-accent" />
              )}
            {level === 'receipts' && (
              <div className="space-y-2">
                {studentReceipts.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border card-hover"
                  >
                    <button
                      className="flex items-center gap-3 text-left flex-1"
                      onClick={() => setPreviewReceipt(r)}
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-receipt font-bold text-receipt-red text-sm">
                          No. {r.receipt_number}
                        </span>
                        <p className="text-xs text-muted-foreground">{r.description} — ₹{r.amount.toLocaleString('en-IN')}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => { setPreviewReceipt(r); setShowExport(true); }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => { setPreviewReceipt(r); setShowShare(true); }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      {r.receipt_number === latestReceiptNumber && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete latest receipt?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete receipt No. {r.receipt_number}. Only the latest receipt can be deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteLatestReceipt.mutate()}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Preview Dialog */}
      {previewReceipt && !showExport && !showShare && (
        <Dialog open={!!previewReceipt} onOpenChange={(o) => !o && setPreviewReceipt(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                Receipt No. {previewReceipt.receipt_number}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center bg-muted rounded-lg p-4 overflow-auto">
              <div className="transform scale-[0.75] origin-top">
                <ReceiptTemplate
                  receiptNumber={previewReceipt.receipt_number}
                  studentName={previewReceipt.student_name}
                  className={previewReceipt.class}
                  division={previewReceipt.division}
                  description={previewReceipt.description}
                  amount={previewReceipt.amount}
                  date={previewReceipt.date}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowExport(true)} className="flex-1 gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
              <Button variant="outline" onClick={() => setShowShare(true)} className="flex-1 gap-2">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.print()}>
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Export & Share */}
      {previewReceipt && (
        <>
          <ExportDialog
            open={showExport}
            onOpenChange={setShowExport}
            receipt={previewReceipt}
          />
          <ShareDialog
            open={showShare}
            onOpenChange={setShowShare}
            receiptNumber={previewReceipt.receipt_number}
          />
        </>
      )}
    </div>
  );
}
