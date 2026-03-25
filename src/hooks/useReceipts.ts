import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReceiptData {
  student_name: string;
  class: string;
  division: string;
  description: string;
  amount: number;
  date: string;
}

export function useReceipts() {
  const queryClient = useQueryClient();

  const receiptsQuery = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('receipt_number', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const nextNumberQuery = useQuery({
    queryKey: ['next-receipt-number'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select('receipt_number')
        .order('receipt_number', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data.length > 0 ? data[0].receipt_number + 1 : 1000;
    },
  });

  const createReceipt = useMutation({
    mutationFn: async (receipt: ReceiptData) => {
      // Get next number fresh
      const { data: latest } = await supabase
        .from('receipts')
        .select('receipt_number')
        .order('receipt_number', { ascending: false })
        .limit(1);
      const nextNumber = latest && latest.length > 0 ? latest[0].receipt_number + 1 : 1000;

      const { data, error } = await supabase
        .from('receipts')
        .insert({ ...receipt, receipt_number: nextNumber })
        .select()
        .single();
      if (error) throw error;

      // Upsert student
      await supabase
        .from('students')
        .upsert(
          { name: receipt.student_name, class: receipt.class, division: receipt.division },
          { onConflict: 'name,class,division' }
        );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['next-receipt-number'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Receipt generated successfully');
    },
    onError: (error) => {
      toast.error('Failed to generate receipt: ' + error.message);
    },
  });

  const deleteLatestReceipt = useMutation({
    mutationFn: async () => {
      const { data: latest } = await supabase
        .from('receipts')
        .select('id, receipt_number')
        .order('receipt_number', { ascending: false })
        .limit(1);
      if (!latest || latest.length === 0) throw new Error('No receipts to delete');

      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', latest[0].id);
      if (error) throw error;
      return latest[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['next-receipt-number'] });
      toast.success('Latest receipt deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  return {
    receipts: receiptsQuery.data ?? [],
    isLoading: receiptsQuery.isLoading,
    nextNumber: nextNumberQuery.data ?? 1000,
    createReceipt,
    deleteLatestReceipt,
  };
}
