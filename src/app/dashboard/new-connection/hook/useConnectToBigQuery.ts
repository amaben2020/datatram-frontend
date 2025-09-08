import { api } from '@/hooks/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface ConnectBigQueryData {
  connectionId: number;
  destinationId: number;
}

interface BigQueryResponse {
  success: boolean;
  message: string;
  data: any;
  rowsProcessed: number;
}

export const useConnectBigQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<BigQueryResponse, Error, ConnectBigQueryData>({
    mutationFn: async (connectionData: ConnectBigQueryData) => {
      const { data } = await api.post(
        '/connections/connect-to-bigquery',
        connectionData
      );

      return data;
    },
    onSuccess: (data) => {
      console.log('DATA IN USE QUERY', data);
      console.log('DATA IN USE QUERY rowsProcessed', data.rowsProcessed);
      // Show success message
      toast.success('Data loaded to BigQuery successfully!', {
        description: `Rows processed successfully`,
        duration: 8000,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['connectionHistory'] });
    },
    onError: (error) => {
      // Show error message
      toast.error('Failed to connect to BigQuery', {
        description: error.message || 'An unexpected error occurred',
        duration: 7000,
      });

      console.error('BigQuery connection error:', error);
    },
  });
};
