import { api } from '@/hooks/services';
import { useQuery } from '@tanstack/react-query';

interface ConnectionHistory {
  id: number;
  connectionId: number | null;
  sourceId: number | null;
  destinationId: number | null;
  attemptedAt: string;
  status: string | null;
  metadata: any;
  sourceName?: string | null;
  destinationName?: string | null;
}

export const useConnectionHistories = () => {
  return useQuery<ConnectionHistory[], Error>({
    queryKey: ['connectionHistories'],
    queryFn: async () => {
      const { data } = await api.get('/connection-histories/all');
      return data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
