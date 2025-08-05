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
} from 'lucide-react';

// Mock data
const mockSources = [
  { id: 1, name: 'Customer Database' },
  { id: 2, name: 'Sales Data' },
  { id: 3, name: 'Product Catalog' },
];

const mockDestinations = [
  { id: 1, name: 'Data Warehouse' },
  { id: 2, name: 'ML Pipeline' },
  { id: 3, name: 'Analytics Dashboard' },
];

const mockConnections = [
  {
    id: 1,
    sourceId: 1,
    destinationId: 1,
    sourceName: 'Customer Database',
    destinationName: 'Data Warehouse',
  },
  {
    id: 2,
    sourceId: 2,
    destinationId: 2,
    sourceName: 'Sales Data',
    destinationName: 'ML Pipeline',
  },
];

// Mock hooks
const useConnections = () => ({
  data: mockConnections,
  isLoading: false,
  error: null,
});

const useSources = () => ({
  data: mockSources,
  isLoading: false,
  error: null,
});

const useDestinations = () => ({
  data: mockDestinations,
  isLoading: false,
  error: null,
});

const useCreateConnection = () => ({
  mutateAsync: async (data) => {
    console.log('Creating connection:', data);
    // mock server behavior: attach names
    const sourceName =
      mockSources.find((s) => s.id === data.sourceId)?.name || 'Source';
    const destinationName =
      mockDestinations.find((d) => d.id === data.destinationId)?.name ||
      'Destination';
    return { id: Date.now(), ...data, sourceName, destinationName };
  },
  isPending: false,
});

const useUpdateConnection = () => ({
  mutateAsync: async (data) => {
    console.log('Updating connection:', data);
    const sourceName =
      mockSources.find((s) => s.id === data.sourceId)?.name || 'Source';
    const destinationName =
      mockDestinations.find((d) => d.id === data.destinationId)?.name ||
      'Destination';
    return { ...data, sourceName, destinationName };
  },
  isPending: false,
});

const useDeleteConnection = () => ({
  mutateAsync: async (id) => {
    console.log('Deleting connection:', id);
    return { success: true };
  },
  isPending: false,
});

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

  const { data: sources = [] } = useSources();
  const { data: destinations = [] } = useDestinations();
  const createMutation = useCreateConnection();
  const updateMutation = useUpdateConnection();
  const deleteMutation = useDeleteConnection();

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
        const updated = await updateMutation.mutateAsync({
          id: editingConnection.id,
          ...connectionData,
        });
        setConnections((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const created = await createMutation.mutateAsync(connectionData);
        // push created connection to local list
        setConnections((prev) => [created, ...prev]);
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
        // optimistic UI update
        setConnections((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error('Error deleting connection:', err);
        alert('Failed to delete connection. See console for details.');
      }
    }
  };

  const getSourceName = (sourceId) => {
    return sources?.find((s) => s.id === sourceId)?.name || 'Unknown Source';
  };

  const getDestinationName = (destinationId) => {
    return (
      destinations?.find((d) => d.id === destinationId)?.name ||
      'Unknown Destination'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading connections</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Connections</h1>
            <p className="text-green-200">
              Link your data sources to destinations
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            New Connection
          </button>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {connections?.map((connection) => (
            <div
              key={connection.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Source */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Database size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {connection.sourceName ||
                          getSourceName(connection.sourceId)}
                      </h3>
                      <p className="text-green-200 text-sm">Source</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight size={24} className="text-green-400" />
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {connection.destinationName ||
                          getDestinationName(connection.destinationId)}
                      </h3>
                      <p className="text-green-200 text-sm">Destination</p>
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
                    <Edit size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(connection.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    aria-label="Delete connection"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {connections?.length === 0 && (
          <div className="text-center py-16">
            <Link size={64} className="text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              No connections yet
            </h3>
            <p className="text-green-200 mb-6">
              Create your first connection to link sources and destinations
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
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
          <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl p-6 border border-white/10 shadow-lg z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Link size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingConnection ? 'Edit Connection' : 'New Connection'}
                  </h2>
                  <p className="text-green-200 text-sm">
                    Link a source to a destination
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="text-green-200 hover:text-white p-2 rounded-md"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-green-200 mb-2">
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
                  className="w-full bg-slate-800 text-white rounded-md p-2 border border-white/10"
                  required
                  aria-required
                >
                  <option value="">Select a source</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-green-200 mb-2">
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
                  className="w-full bg-slate-800 text-white rounded-md p-2 border border-white/10"
                  required
                >
                  <option value="">Select a destination</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-md bg-white/5 text-green-200 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] transition-transform"
                >
                  {editingConnection ? 'Save Changes' : 'Create Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;
