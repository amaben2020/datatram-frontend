'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import {
  useCreateDestination,
  useDeleteDestination,
  useDestinations,
  useUpdateDestination,
} from '@/hooks/services';
import Image from 'next/image';

const DestinationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    metadata: {},
    url: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { data: destinations, isLoading, error } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();

  // TODO: Change Modal to accertinity
  const handleOpenModal = (destination) => {
    if (destination) {
      setEditingDestination(destination);
      setFormData({
        name: destination.name,
        projectId: destination.projectId || '',
        metadata: destination.metadata || {},
        url: destination.url || '',
      });
      setImagePreview(destination.image || null);
    } else {
      setEditingDestination(null);
      setFormData({ name: '', projectId: '', metadata: {}, url: '' });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDestination(null);
    setFormData({ name: '', projectId: '', metadata: {}, url: '' });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDestination) {
        await updateMutation.mutateAsync({
          id: editingDestination.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting destination:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div
        className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-purple-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Error loading destinations
          </h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 min-w-[100%]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Destinations</h1>
            <p className="text-purple-600">
              Manage your data output destinations and endpoints
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="   px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 bg-purple-600 text-white"
          >
            <Plus size={20} />
            Add Destination
          </button>
        </div>

        {/* Destinations Grid */}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <LucideClockFading /> */}
            Loading...
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations?.map((destination) => (
            <div
              key={destination.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group   shadow-md shadow-purple-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {destination.image ? (
                    <Image
                      height={10}
                      width={10}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL!}/uploads/${
                        destination.image
                      }`}
                      alt={destination.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br bg-purple-600 rounded-lg flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-purple-600 font-semibold text-lg">
                      {destination.name}
                    </h3>
                    {destination.projectId && (
                      <p className="text-purple-600 text-sm">
                        {destination.projectId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(destination)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(destination.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {destination.metadata &&
                  Object.keys(destination.metadata).length > 0 && (
                    <div className="text-purple-600">
                      <span className="font-medium">Metadata:</span>
                      <div className="text-xs mt-1">
                        {Object.entries(destination.metadata).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span>{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                <div className="text-purple-600 text-xs">
                  Created:{' '}
                  {new Date(destination.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {destinations?.length === 0 && (
          <div className="text-center py-16">
            <Target size={64} className="text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-purple-600 mb-2">
              No destinations yet
            </h3>
            <p className="text-purple-600 mb-6">
              Create your first destination to get started
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Destination
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingDestination ? 'Edit Destination' : 'Create Destination'}
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
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter destination name"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Project ID
                </label>
                <input
                  type="text"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectId: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter project ID"
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Url
                </label>
                <input
                  type="text"
                  value={formData?.url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter Url"
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Metadata
                </label>
                <textarea
                  type="text"
                  value={formData.metadata}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter Metadata"
                />
              </div>

              <div>
                <label className="block text-purple-600 text-sm font-medium mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />

                {imagePreview && (
                  <Image
                    src={`http://localhost:8000/uploads/${imagePreview}`}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg mx-auto mt-3"
                    height={26}
                    width={26}
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingDestination
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

export default DestinationsPage;
