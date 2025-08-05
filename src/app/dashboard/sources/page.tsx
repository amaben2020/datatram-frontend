'use client';

import React, { useState } from 'react';
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Database,
  FileText,
  Image,
} from 'lucide-react';

// Mock data and hooks for demonstration
const mockSources = [
  {
    id: 1,
    name: 'Customer Database',
    host: 'postgres://localhost:5432',
    type: 'csv',
    image: null,
    file: 'customers.csv',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    metadata: {},
    userId: 1,
  },
  {
    id: 2,
    name: 'Sales Data',
    host: 'mysql://localhost:3306',
    type: 'excel',
    image: null,
    file: 'sales.xlsx',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    metadata: {},
    userId: 1,
  },
];

// Mock hooks
const useSources = () => ({
  data: mockSources,
  isLoading: false,
  error: null,
});

const useCreateSource = () => ({
  mutateAsync: async (data) => {
    console.log('Creating source:', data);
    return { id: Date.now(), ...data };
  },
  isPending: false,
});

const useUpdateSource = () => ({
  mutateAsync: async (data) => {
    console.log('Updating source:', data);
    return data;
  },
  isPending: false,
});

const useDeleteSource = () => ({
  mutateAsync: async (id) => {
    console.log('Deleting source:', id);
    return { success: true };
  },
  isPending: false,
});

const SourcesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    type: '',
    metadata: {},
  });
  const [filePreview, setFilePreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: sources, isLoading, error } = useSources();
  const createMutation = useCreateSource();
  const updateMutation = useUpdateSource();
  const deleteMutation = useDeleteSource();

  const handleOpenModal = (source) => {
    if (source) {
      setEditingSource(source);
      setFormData({
        name: source.name,
        host: source.host || '',
        type: source.type || '',
        metadata: source.metadata || {},
      });
      setImagePreview(source.image || null);
    } else {
      setEditingSource(null);
      setFormData({ name: '', host: '', type: '', metadata: {} });
      setFilePreview(null);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSource(null);
    setFormData({ name: '', host: '', type: '', metadata: {} });
    setFilePreview(null);
    setImagePreview(null);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));

      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSource) {
        await updateMutation.mutateAsync({ id: editingSource.id, ...formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving source:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting source:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading sources</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Data Sources</h1>
            <p className="text-purple-200">
              Manage your data connections and file uploads
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Plus size={20} />
            Add Source
          </button>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources?.map((source) => (
            <div
              key={source.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {source.image ? (
                    <img
                      src={source.image}
                      alt={source.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Database size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {source.name}
                    </h3>
                    {source.host && (
                      <p className="text-purple-200 text-sm">{source.host}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(source)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {source.type && (
                  <div className="flex items-center gap-2 text-purple-200">
                    <FileText size={14} />
                    <span>Type: {source.type}</span>
                  </div>
                )}
                {source.file && (
                  <div className="flex items-center gap-2 text-purple-200">
                    <Upload size={14} />
                    <span>File attached</span>
                  </div>
                )}
                <div className="text-purple-300 text-xs">
                  Created: {new Date(source.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sources?.length === 0 && (
          <div className="text-center py-16">
            <Database size={64} className="text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              No sources yet
            </h3>
            <p className="text-purple-200 mb-6">
              Create your first data source to get started
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Source
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingSource ? 'Edit Source' : 'Create Source'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter source name"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Host
                </label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, host: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter host URL"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="">Select type</option>
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'file')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
                {filePreview && (
                  <p className="text-purple-300 text-sm mt-1">
                    Selected: {filePreview}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingSource
                    ? 'Update'
                    : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesPage;
