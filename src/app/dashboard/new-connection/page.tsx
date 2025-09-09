//@ts-nocheck
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Link,
  ArrowRight,
  Database,
  Target,
  CableCarIcon,
  ChevronLeft,
  CableIcon,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  History,
} from 'lucide-react';
import {
  useConnections,
  useCreateConnection,
  useDeleteConnection,
  useDestinations,
  useSources,
  useUpdateConnection,
} from '@/hooks/services';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { useConnectBigQuery } from './hook/useConnectToBigQuery';
import { useConnectionHistories } from './hook/useConnectionHistory'; // Import the new hook
import { ConnectionAnimation } from './Loading';

const ConnectionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [formData, setFormData] = useState({
    sourceId: '',
    destinationId: '',
  });
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('all');

  // Existing hooks
  const { data: connectionsFromHook, isLoading, error } = useConnections();
  const [connections, setConnections] = useState(connectionsFromHook || []);
  const router = useRouter();
  const { data: sources = [] } = useSources();
  const { data: destinations = [] } = useDestinations();
  const createMutation = useCreateConnection();
  const updateMutation = useUpdateConnection();
  const deleteMutation = useDeleteConnection();
  const connectBigQueryMutation = useConnectBigQuery();

  const { userId } = useAuth();

  // New hook for connection histories
  const {
    data: connectionHistories = [],
    isLoading: historiesLoading,
    error: historiesError,
  } = useConnectionHistories();
  console.log('connectionHistories ===>', connectionHistories);

  // Filter histories by selected source
  const filteredHistories = useMemo(() => {
    return connectionHistories.filter(
      (history) => history.metadata.userId === userId
    );
  }, [connectionHistories, userId]);

  // Get unique sources from histories for filter dropdown
  const availableSources = useMemo(() => {
    const sourceIds = [
      ...new Set(connectionHistories.map((h) => h.sourceId).filter(Boolean)),
    ];
    return sourceIds.map((sourceId) => {
      const history = connectionHistories.find((h) => h.sourceId === sourceId);
      return {
        id: sourceId,
        name: history?.sourceName || `Source ${sourceId}`,
      };
    });
  }, [connectionHistories]);

  // Add BigQuery connection handler
  const handleConnectToBigQuery = async (connection) => {
    console.log('connection', connection);
    try {
      await connectBigQueryMutation.mutateAsync({
        connectionId: connection.id,
        destinationId: connection.destinationId,
      });
    } catch (err) {
      console.error('BigQuery connection failed:', err);
    }
  };

  // Keep local connections synced when hook data changes (initial load)
  useEffect(() => {
    setConnections(connectionsFromHook || []);
  }, [connectionsFromHook]);

  const handleOpenModal = (connection) => {
    if (connection) {
      setEditingConnection(connection);
      setFormData({
        sourceId: connection.sourceId.toString(),
        destinationId: connection.destinationId.toString(),
      });
    } else {
      setEditingConnection(null);
      setFormData({ sourceId: '', destinationId: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConnection(null);
    setFormData({ sourceId: '', destinationId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sourceId || !formData.destinationId) {
      alert('Please select both source and destination');
      return;
    }

    try {
      const connectionData = {
        sourceId: parseInt(formData.sourceId, 10),
        destinationId: parseInt(formData.destinationId, 10),
      };

      if (editingConnection) {
        await updateMutation.mutateAsync({
          id: editingConnection.id,
          ...connectionData,
        });
      } else {
        const created = await createMutation.mutateAsync(connectionData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving connection:', err);
      alert('Failed to save connection. See console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting connection:', err);
        alert('Failed to delete connection. See console for details.');
      }
    }
  };

  const getSourceName = (sourceId) => {
    return (
      sources?.data?.find((s) => s.id === sourceId)?.name || 'Unknown Source'
    );
  };

  const getDestinationName = (destinationId) => {
    return (
      destinations?.find((d) => d.id === destinationId)?.name ||
      'Unknown Destination'
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failure':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failure':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div
        className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-purple-600 rounded-full p-2"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center min-w-[100%]">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading connections</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex w-[80vw]">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <button
            type="button"
            className="flex gap-2 items-center mb-8 text-purple-600 cursor-pointer hover:text-purple-900"
            onClick={() => router.back()}
          >
            <ChevronLeft color="purple" />
            Back
          </button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-purple mb-2">
                Connections
              </h1>
              <p className="text-purple-500">
                Create a connection between a source and destination
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-600/20 font-bold"
            >
              <Plus size={20} />
              New Connection
            </button>
          </div>

          {connectBigQueryMutation.isPending && (
            <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
              <div className="fixed top-10 left-96 w-[60vw] h-[calc(100vh-5rem)] flex items-center justify-center p-4 z-50">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center bg-white rounded-2xl shadow-2xl p-8 border border-purple-200">
                    <ConnectionAnimation />
                    <p className="mt-6 text-purple-600 text-lg font-medium">
                      Establishing connection to BigQuery...
                    </p>
                    <p className="mt-2 text-gray-500 text-sm">
                      Processing your data
                    </p>
                    <div className="mt-6 w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Connections List */}
          <div className="space-y-6">
            {connectionsFromHook?.data?.map((connection) => (
              <div
                key={connection.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-500 group shadow-md shadow-purple-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Source */}
                    <div className="flex items-center gap-3">
                      <div className="w-fit rounded-lg flex items-center justify-center shadow-lg">
                        {connection?.sourceImage == null ? (
                          <div className="bg-purple-600 p-3 rounded-lg px-5">
                            <Database size={20} className="text-white" />
                          </div>
                        ) : (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${connection.sourceImage}`}
                            height={60}
                            width={60}
                            alt=""
                            className="rounded-lg"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-purple font-semibold">
                          {connection.sourceName ||
                            getSourceName(connection.sourceId)}
                        </h3>
                        <p className="text-purple-500 text-sm">Source</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight size={24} className="text-purple-400" />
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-3">
                      <div>
                        {connection.destinationName
                          ?.toLowerCase()
                          ?.includes('Query'.toLowerCase()) && (
                          <Image
                            src="/bigquery.svg"
                            height={50}
                            width={50}
                            alt="Big query icon"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-purple font-semibold">
                          {connection.destinationName ||
                            getDestinationName(connection.destinationId)}
                        </h3>
                        <p className="text-purple-500 text-sm">Destination</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(connection)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Edit connection"
                    >
                      <Edit size={16} className="text-purple-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(connection.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      aria-label="Delete connection"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                    <button
                      onClick={() => handleConnectToBigQuery(connection)}
                      disabled={connectBigQueryMutation.isPending}
                      className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors flex gap-2 items-center disabled:opacity-50"
                      aria-label="Connect to BigQuery"
                    >
                      {connectBigQueryMutation.isPending ? (
                        <Loader2
                          size={16}
                          className="text-purple-600 animate-spin"
                        />
                      ) : (
                        <CableIcon size={16} className="text-purple-600" />
                      )}
                      {connectBigQueryMutation.isPending
                        ? 'Connecting...'
                        : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {connections?.length === 0 && (
            <div className="text-center py-16">
              <Link size={64} className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-purple mb-2">
                No connections yet
              </h3>
              <p className="text-purple-500 mb-6">
                Create your first connection to link sources and destinations
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:scale-105"
              >
                <Plus size={20} />
                New Connection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connection History Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto max-h-[96vh]">
        <div className="sticky top-0 bg-gray-50 pb-4 mb-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <History size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Connection History
            </h2>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {historiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-purple-600" />
            </div>
          ) : historiesError ? (
            <div className="text-red-500 text-sm text-center py-8">
              Failed to load history
            </div>
          ) : filteredHistories.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              {selectedSourceFilter === 'all'
                ? 'No connection history yet'
                : 'No history for selected source'}
            </div>
          ) : (
            filteredHistories.map((history) => (
              <div
                key={history.id}
                className={`p-2 rounded-lg border-2 ${getStatusColor(
                  history.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(history.status)}
                    <span className="font-medium text-sm capitalize">
                      {history.status || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    #{history.id}{' '}
                    <span className="text-gray-700 font-bold">
                      for connection {history.connectionId}
                    </span>
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex gap-3 items-center">
                    <div>
                      <span className="font-medium">Source:</span>{' '}
                      {history.sourceName || `ID ${history.sourceId}`}
                    </div>
                    <div>
                      <span className="font-medium">Destination:</span>{' '}
                      {history.destinationName || `ID ${history.destinationId}`}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Time:</span>{' '}
                    {formatDate(history.attemptedAt)}
                  </div>

                  {history.metadata &&
                    Object.keys(history.metadata).length > 0 && (
                      <div className="mt-1 p-1 bg-white/50 rounded text-xs">
                        <div className="font-medium mb-1">Details:</div>
                        {history.metadata.rowsProcessed && (
                          <div>Rows: {history.metadata.rowsProcessed}</div>
                        )}
                        {history.metadata.duration && (
                          <div>
                            Duration:{' '}
                            {Math.round(history.metadata.duration / 1000)}s
                          </div>
                        )}
                        {history.metadata.fileName && (
                          <div className=" ">
                            File Uploaded: {history.metadata.fileName}
                          </div>
                        )}

                        {history.metadata.error && (
                          <div className="text-red-600">
                            Error: {history.metadata.error}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal (unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 border border-white/10 shadow-lg z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <CableCarIcon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple">
                    {editingConnection ? 'Edit Connection' : 'New Connection'}
                  </h2>
                  <p className="text-purple-500 text-sm">
                    Link a source to a destination
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="text-purple-500 hover:text-purple p-2 rounded-md transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-500 mb-2 font-medium">
                  Source
                </label>
                <select
                  value={formData.sourceId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sourceId: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-purple-600 rounded-lg px-3 py-2 text-purple placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors"
                  required
                  aria-required
                >
                  <option value="">Select a source</option>
                  {sources?.data?.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-800">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-purple-500 mb-2 font-medium">
                  Destination
                </label>
                <select
                  value={formData.destinationId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      destinationId: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-purple placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors border border-purple-600"
                  required
                >
                  <option value="">Select a destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-800">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-white/5 text-purple-600 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingConnection
                    ? 'Save Changes'
                    : 'Create Connection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
