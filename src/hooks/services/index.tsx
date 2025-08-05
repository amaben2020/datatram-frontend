// hooks/api/useApi.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Configure axios defaults
const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust to your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor (assuming you're using Clerk)
api.interceptors.request.use(async (config) => {
  // Get auth token from Clerk or your auth provider
  const token = await window.Clerk?.session?.getToken();

  console.log('TOKEN INSIDE INTERCEPTOR', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Source {
  id: number;
  name: string;
  host?: string;
  image?: string;
  type?: string;
  file?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
  userId: number;
}

export interface Destination {
  id: number;
  name: string;
  projectId?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
  userId: number;
}

export interface Connection {
  id: number;
  sourceId: number;
  destinationId: number;
  sourceName?: string;
  destinationName?: string;
}

export interface CreateSourceData {
  name: string;
  host?: string;
  type?: string;
  metadata?: any;
  file?: File;
  image?: File;
}

export interface CreateDestinationData {
  name: string;
  projectId?: string;
  metadata?: any;
  image?: File;
}

export interface CreateConnectionData {
  sourceId: number;
  destinationId: number;
}

// ============ SOURCES HOOKS ============

export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async (): Promise<Source[]> => {
      const { data } = await api.get('/sources/all');
      return data;
    },
  });
};

export const useSource = (id: number) => {
  return useQuery({
    queryKey: ['sources', id],
    queryFn: async (): Promise<Source> => {
      const { data } = await api.get(`/sources/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceData: CreateSourceData) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', sourceData.name);
      if (sourceData.host) formData.append('host', sourceData.host);
      if (sourceData.type) formData.append('type', sourceData.type);
      if (sourceData.metadata)
        formData.append('metadata', JSON.stringify(sourceData.metadata));

      // Add files
      if (sourceData.file) formData.append('file', sourceData.file);
      if (sourceData.image) formData.append('image', sourceData.image);

      const { data } = await api.post('/sources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });
};

export const useUpdateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...sourceData
    }: CreateSourceData & { id: number }) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', sourceData.name);
      if (sourceData.host) formData.append('host', sourceData.host);
      if (sourceData.type) formData.append('type', sourceData.type);
      if (sourceData.metadata)
        formData.append('metadata', JSON.stringify(sourceData.metadata));

      // Add files
      if (sourceData.file) formData.append('file', sourceData.file);
      if (sourceData.image) formData.append('image', sourceData.image);

      const { data } = await api.patch(`/sources/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      queryClient.invalidateQueries({ queryKey: ['sources', variables.id] });
    },
  });
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/sources/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
  });
};

// ============ DESTINATIONS HOOKS ============

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async (): Promise<Destination[]> => {
      const { data } = await api.get('/destinations/all');
      return data;
    },
  });
};

export const useDestination = (id: number) => {
  return useQuery({
    queryKey: ['destinations', id],
    queryFn: async (): Promise<Destination> => {
      const { data } = await api.get(`/destinations/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationData: CreateDestinationData) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', destinationData.name);
      if (destinationData.projectId)
        formData.append('projectId', destinationData.projectId);
      if (destinationData.metadata)
        formData.append('metadata', JSON.stringify(destinationData.metadata));

      // Add image
      if (destinationData.image)
        formData.append('image', destinationData.image);

      const { data } = await api.post('/destinations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...destinationData
    }: CreateDestinationData & { id: number }) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', destinationData.name);
      if (destinationData.projectId)
        formData.append('projectId', destinationData.projectId);
      if (destinationData.metadata)
        formData.append('metadata', JSON.stringify(destinationData.metadata));

      // Add image
      if (destinationData.image)
        formData.append('image', destinationData.image);

      const { data } = await api.patch(`/destinations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      queryClient.invalidateQueries({
        queryKey: ['destinations', variables.id],
      });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/destinations/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};

// ============ CONNECTIONS HOOKS ============

export const useConnections = () => {
  return useQuery({
    queryKey: ['connections'],
    queryFn: async (): Promise<Connection[]> => {
      const { data } = await api.get('/connections/all');
      return data;
    },
  });
};

export const useConnection = (id: number) => {
  return useQuery({
    queryKey: ['connections', id],
    queryFn: async (): Promise<Connection> => {
      const { data } = await api.get(`/connections/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionData: CreateConnectionData) => {
      const { data } = await api.post('/connections', connectionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

export const useUpdateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...connectionData
    }: CreateConnectionData & { id: number }) => {
      const { data } = await api.patch(`/connections/${id}`, connectionData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({
        queryKey: ['connections', variables.id],
      });
    },
  });
};

export const useDeleteConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/connections/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
