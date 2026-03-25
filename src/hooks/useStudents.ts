import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useStudents(searchTerm: string) {
  return useQuery({
    queryKey: ['students', searchTerm],
    queryFn: async () => {
      let query = supabase.from('students').select('*').order('name');
      if (searchTerm.length > 0) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length > 0,
  });
}
