import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Instagram } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptNumber: number;
}

export default function ShareDialog({ open, onOpenChange, receiptNumber }: ShareDialogProps) {
  const message = encodeURIComponent(`Receipt No. ${receiptNumber} - MAAS Academy`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      url: `https://api.whatsapp.com/send?text=${message}`,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
    },
    {
      name: 'WA Business',
      icon: <MessageCircle className="w-5 h-5" />,
      url: `https://api.whatsapp.com/send?text=${message}&app=business`,
      color: 'bg-[#128C7E] hover:bg-[#0e7a6e]',
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      url: `https://t.me/share/url?text=${message}`,
      color: 'bg-[#0088cc] hover:bg-[#0077b3]',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: '#',
      color: 'bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-90',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Share Receipt</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button
                variant="ghost"
                className={`w-full gap-2 text-[#ffffff] ${link.color}`}
              >
                {link.icon}
                {link.name}
              </Button>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
