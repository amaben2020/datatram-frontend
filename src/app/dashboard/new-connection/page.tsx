//@ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
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

const ConnectionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [formData, setFormData] = useState({
    sourceId: '',
    destinationId: '',
  });

  // local copy of connections so UI updates optimistically with mock hooks
  const { data: connectionsFromHook, isLoading, error } = useConnections();

  const [connections, setConnections] = useState(connectionsFromHook || []);
  const router = useRouter();
  const { data: sources = [] } = useSources();
  const { data: destinations = [] } = useDestinations();
  const createMutation = useCreateConnection();
  const updateMutation = useUpdateConnection();
  const deleteMutation = useDeleteConnection();

  const connectBigQueryMutation = useConnectBigQuery();
  // Add BigQuery connection handler
  const handleConnectToBigQuery = async (connection) => {
    console.log('connection', connection);
    try {
      await connectBigQueryMutation.mutateAsync({
        connectionId: connection.id,
        destinationId: connection.destinationId,
      });
    } catch (err) {
      // Error handling is done in the hook
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
        // update via hook then optimistically update local list
        await updateMutation.mutateAsync({
          id: editingConnection.id,
          ...connectionData,
        });
        // setConnections((prev) =>
        //   prev.map((c) => (c.id === updated.id ? updated : c))
        // );
      } else {
        const created = await createMutation.mutateAsync(connectionData);
        // push created connection to local list
        // setConnections((prev) => [created, ...prev]);
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
        //TODO: Use optimistic update here
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
      <div className="min-h-screen  flex items-center justify-center min-w-[100%]">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading connections</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 min-w-[100%]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <button
          type="button"
          className="flex gap-2 items-center mb-8 text-purple-600 cursor-pointer hover:text-purple-900"
          onClick={() => router.back()}
        >
          <ChevronLeft color="purple" />
          Back
        </button>
        <div className="flex justify-between items-center mb-8 min-w-3xl">
          <div>
            <h1 className="text-4xl font-bold text-purple mb-2">Connections</h1>
            <p className="text-purple-500">
              Create a connection between a source and destination
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 hover:bg-purple-700 text-purple px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-600/20 text-white font-bold"
          >
            <Plus size={20} />
            New Connection
          </button>
        </div>

        {connectBigQueryMutation.isPending && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

            {/* Modal Container */}
            <div className="fixed top-10 left-96 w-[60vw] h-[calc(100vh-5rem)] flex items-center justify-center p-4 z-50">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Content */}
                <div className="text-center bg-white rounded-2xl shadow-2xl p-8 border border-purple-200">
                  <ConnectionAnimation />
                  <p className="mt-6 text-purple-600 text-lg font-medium">
                    Establishing connection to BigQuery...
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    Processing your data
                  </p>

                  {/* Progress bar */}
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
                          <Database size={20} className="text-purple" />
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
                      {/* {connection?.destinationImage == null ? (
                        <div className="bg-purple-600 p-3 rounded-lg px-5">
                          <Target size={20} className="text-purple" />
                        </div>
                      ) : (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${connection.destinationImage}`}
                          height={60}
                          width={60}
                          alt=""
                          className="rounded-lg h-12 w-14"
                        />
                      )} */}

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

                  {/* TODO: Add connect button here */}

                  {/* <div className="min-h-screen w-[40vw] flex items-center justify-center p-4 bg-white fixed top-10 left-0">
                    <div className="text-center">
                      <ConnectionAnimation />
                      <p className="mt-6 text-purple-400 text-lg font-medium">
                        Establishing connection to BigQuery...
                      </p>
                    </div>
                  </div> */}

                  {/* Updated Connect Button */}
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

        {/* TODO: Add connections here  */}
        {/* <div>ALL CONNECTIONS</div> */}

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
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-purple px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:scale-105"
            >
              <Plus size={20} />
              New Connection
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
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
                  <CableCarIcon size={20} className="text-purple" />
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
                  className="w-full bg-white/10   rounded-lg px-3 py-2 text-purple placeholder-purple-400 focus:border-purple-400 focus:outline-none transition-colors border border-purple-600"
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
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-purple hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-purple-500/20 text-white"
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
const ConnectionAnimation = ({ status = 'connecting', size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const statusColors = {
    connecting: 'text-purple-600',
    success: 'text-green-500',
    error: 'text-red-500',
    idle: 'text-gray-400',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Main Orbital Animation */}
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        {/* Central Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-1/4 h-1/4 bg-current rounded-full animate-pulse ${statusColors[status]}`}
          >
            <div className="w-full h-full bg-current rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Orbiting Nodes */}
        <div className="absolute inset-0">
          {/* Fast orbit */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-3 h-3 bg-current rounded-full animate-orbit-fast ${statusColors[status]}`}
            ></div>
          </div>

          {/* Medium orbit */}
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-4 h-4 bg-current rounded-full animate-orbit-medium ${statusColors[status]}`}
            ></div>
          </div>

          {/* Slow orbit */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div
              className={`w-5 h-5 bg-current rounded-full animate-orbit-slow ${statusColors[status]}`}
            ></div>
          </div>

          {/* Very slow orbit */}
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-6 h-6 bg-current rounded-full animate-orbit-very-slow ${statusColors[status]}`}
            ></div>
          </div>
        </div>

        {/* Connection Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-current border-dashed rounded-full opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-current border-dashed rounded-full opacity-15"></div>
        </div>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full border-4 border-current rounded-full animate-ping-slow opacity-0"></div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <div
          className={`text-sm font-semibold uppercase tracking-widest mb-2 ${statusColors[status]}`}
        >
          {status}
        </div>
        <div className="flex space-x-1 justify-center">
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-current rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="w-48 h-2 mt-6 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-pulse"></div>

      {/* CSS Styles (add to your global CSS) */}
      <style jsx>{`
        @keyframes orbit-fast {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
        @keyframes orbit-medium {
          0% {
            transform: rotate(0deg) translateX(32px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(32px) rotate(-360deg);
          }
        }
        @keyframes orbit-slow {
          0% {
            transform: rotate(0deg) translateX(24px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(24px) rotate(-360deg);
          }
        }
        @keyframes orbit-very-slow {
          0% {
            transform: rotate(0deg) translateX(16px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(16px) rotate(-360deg);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-orbit-fast {
          animation: orbit-fast 1.5s linear infinite;
        }
        .animate-orbit-medium {
          animation: orbit-medium 2s linear infinite;
        }
        .animate-orbit-slow {
          animation: orbit-slow 2.5s linear infinite;
        }
        .animate-orbit-very-slow {
          animation: orbit-very-slow 3s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};
