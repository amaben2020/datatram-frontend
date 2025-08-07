'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Upload,
  Edit,
  Trash2,
  Database,
  FileText,
  Search,
  ChevronLeft,
} from 'lucide-react';
import {
  useCreateSource,
  useDeleteSource,
  useSources,
  useUpdateSource,
} from '@/hooks/services';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SourcesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    type: '',
    metadata: {},
  });
  const [filePreview, setFilePreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: sources, isLoading, error } = useSources();
  const router = useRouter();
  console.log(sources);
  const createMutation = useCreateSource();
  const updateMutation = useUpdateSource();
  const deleteMutation = useDeleteSource();

  // Filter sources based on search term
  const filteredSources = useMemo(() => {
    if (!sources?.data || !searchTerm.trim()) {
      return sources?.data || [];
    }
    return sources.data.filter((source) =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sources?.data, searchTerm]);

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
      <div className="min-h-screen flex items-center justify-center min-w-[100%]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center min-w-[100%]">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading sources</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 min-w-[100%]">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Data Sources</h1>
            <p className="text-purple-600">
              Manage your data connections and file uploads
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 bg-purple-600 text-white font-bold"
          >
            <Plus size={20} />
            Add Source
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600"
            />
            <input
              type="text"
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-purple-100 rounded-lg text-purple-600 placeholder-purple-600 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            Loading...
          </div>
        )}

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources?.map((source) => (
            <div
              key={source.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-100 hover:border-blue-400/50 transition-all duration-300 group shadow-md shadow-purple-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {source.image ? (
                    <>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL!}/uploads/${
                          source.image
                        }`}
                        alt={source.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        height={10}
                        width={10}
                      />
                    </>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br bg-purple-600 rounded-lg flex items-center justify-center">
                      <Database size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-purple-600 font-semibold text-lg">
                      {source.name}
                    </h3>
                    {source.host && (
                      <p className="text-purple-600 text-sm">{source.host}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(source)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-purple-600" />
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
                  <div className="flex items-center gap-2 text-purple-600">
                    <FileText size={14} />
                    <span>Type: {source.type}</span>
                  </div>
                )}
                {source.file && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Upload size={14} />
                    <span>File attached</span>
                  </div>
                )}
                <div className="text-purple-600 text-xs">
                  Created: {new Date(source.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}

          {!filteredSources?.length && !searchTerm && (
            <p className="text-purple-600">No sources yet</p>
          )}

          {!filteredSources?.length && searchTerm && (
            <div className="col-span-full text-center py-8">
              <p className="text-purple-600">
                No sources found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {sources?.length === 0 && (
          <div className="text-center py-16">
            <Database size={64} className="text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-purple-600 mb-2">
              No sources yet
            </h3>
            <p className="text-purple-600 mb-6">
              Create your first data source to get started
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              {editingSource ? 'Edit Source' : 'Create Source'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-purple-100 rounded-lg px-3 py-2 text-purple-600 placeholder-purple-600 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter source name"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Host
                </label>
                <input
                  type="text"
                  value={
                    formData.host ||
                    'https://datatram-844630248083.europe-west3.run.app/upload_csv'
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, host: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-purple-100 rounded-lg px-3 py-2 text-purple-600 placeholder-purple-600 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter host URL"
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full bg-white/10 border border-purple-100 rounded-lg px-3 py-2 text-purple-600 focus:border-purple-400 focus:outline-none"
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
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'file')}
                  className="w-full bg-white/10 border border-purple-100 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                />
                {filePreview && (
                  <p className="text-purple-600 text-sm mt-1">
                    Selected: {filePreview}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="w-full bg-white/10 border border-purple-100 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
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
                  className="flex-1 bg-white hover:bg-purple-700  py-2 px-4 rounded-lg transition-colors text-red-600 border border-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 bg-purple-800 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50"
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
