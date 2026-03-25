import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FilePlus, Archive } from 'lucide-react';
import logoHome from '@/assets/logo_home.png';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <img src={logoHome} alt="MAAS Academy" className="h-10 w-10 rounded-lg object-cover" />
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">MAAS Academy</h1>
              <p className="text-xs text-muted-foreground">Receipt Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg animate-fade-in">
          <img src={logoHome} alt="MAAS Academy" className="h-40 mx-auto mb-6 object-contain" />
          <p className="text-muted-foreground mb-10 text-lg">
            Generate, organize, and export professional receipts with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button
              size="lg"
              onClick={() => navigate('/generate')}
              className="h-28 flex-col gap-3 text-base card-hover receipt-shadow"
            >
              <FilePlus className="w-7 h-7" />
              Generate Receipt
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/archive')}
              className="h-28 flex-col gap-3 text-base card-hover receipt-shadow"
            >
              <Archive className="w-7 h-7" />
              View Archive
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
