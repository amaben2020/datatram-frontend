//@ts-nocheck
'use client';

import React, { useState, useMemo, FormEvent } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Target,
  Search,
  ChevronLeft,
  Database,
} from 'lucide-react';
import {
  useCreateDestination,
  useDeleteDestination,
  useDestinations,
  useUpdateDestination,
} from '@/hooks/services';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// Define the destination types
const DESTINATION_TYPES = {
  bigquery: 'BigQuery',
  snowflake: 'Snowflake',
  s3: 'Amazon S3',
} as const;

const DestinationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'bigquery',
    projectId: '',
    url: '',
    serviceKeyJson: '',
    datasetId: '',
    targetTableName: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useUser();
  const { data: destinations, isLoading, error } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();

  const IS_ADMIN = [
    'uzochukwubenamara@gmail.com',
    'gadgetboy.naija@gmail.com',
  ].includes(user?.emailAddresses[0].emailAddress);

  // Filter destinations based on search term
  const filteredDestinations = useMemo(() => {
    if (!destinations || !searchTerm.trim()) {
      return destinations || [];
    }
    return destinations.filter((destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [destinations, searchTerm]);
  const router = useRouter();

  const handleOpenModal = (destination: any) => {
    if (destination) {
      setEditingDestination(destination);
      setFormData({
        name: destination.name,
        type: destination.type || 'bigquery',
        projectId: destination.projectId || '',
        url: destination.url || '',
        serviceKeyJson: destination.serviceKeyJson || '',
        datasetId: destination.datasetId || '',
        targetTableName: destination.targetTableName || '',
        image: null,
      });
      setImagePreview(destination.image || null);
    } else {
      setEditingDestination(null);
      setFormData({
        name: '',
        type: 'bigquery',
        projectId: '',
        url: '',
        serviceKeyJson: '',
        datasetId: '',
        targetTableName: '',
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDestination(null);
    setFormData({
      name: '',
      type: 'bigquery',
      projectId: '',
      url: '',
      serviceKeyJson: '',
      datasetId: '',
      targetTableName: '',
      image: null,
    });
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        // Parse JSON if it's a string
        serviceKeyJson:
          typeof formData.serviceKeyJson === 'string'
            ? JSON.parse(formData.serviceKeyJson || '{}')
            : formData.serviceKeyJson,
      };

      if (editingDestination) {
        await updateMutation.mutateAsync({
          id: editingDestination.id,
          ...submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving destination:', error);
    }
  };

  const handleDelete = async (id: number) => {
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
      <div className="min-h-screen min-w-screen flex items-center justify-center bg-white  ">
        <div className="text-center">
          {/* Main spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-t-purple-600 animate-spin"></div>
            <div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-r-purple-400 animate-spin"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-b-purple-300 animate-spin"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen p-8 min-w-[100%] bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          type="button"
          className="flex gap-2 items-center mb-8 text-purple-500 hover:text-white cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {IS_ADMIN && (
          <div className="flex justify-between mb-8 items-center max-w-[80%]">
            <div>
              <h1 className="text-4xl font-bold text-purple-700 mb-2">
                Destinations
              </h1>
              <p className="text-purple-500">
                Manage your data output destinations and endpoints
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 bg-purple-600 text-white font-bold hover:bg-purple-700"
            >
              <Plus size={20} />
              Add Destination
            </button>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
            />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none  "
            />
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations?.map((destination) => (
            <div
              key={destination.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-400/20 hover:border-purple-400/50 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {destination.image ? (
                    <Image
                      height={40}
                      width={40}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL!}/uploads/${
                        destination.image
                      }`}
                      alt={destination.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center">
                      {/* <Database size={20} className="text-white" /> */}
                      {destination.type === 'bigquery' ? (
                        <Image
                          src="/bigquery.svg"
                          height={40}
                          width={40}
                          alt=""
                        />
                      ) : (
                        'Please add logo'
                      )}

                      <h3 className="text-white font-semibold text-lg">
                        {destination.name}
                      </h3>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-purple-600/20 text-purple-500 text-xs rounded-full capitalize">
                        {destination.type}
                      </span>
                      {/* {destination.projectId && (
                        <span className="text-purple-500 text-sm">
                          • {destination.projectId}
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(destination)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-purple-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(destination.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {/* BigQuery Specific Details */}
                {destination.type === 'bigquery' && (
                  <>
                    {destination.datasetId && (
                      <div className="text-purple-500">
                        <span className="font-medium">Dataset:</span>{' '}
                        {destination.datasetId}
                      </div>
                    )}
                    {destination.targetTableName && (
                      <div className="text-purple-500">
                        <span className="font-medium">Table:</span>{' '}
                        {destination.targetTableName}
                      </div>
                    )}
                    {/* {destination.serviceKeyJson && (
                      <div className="text-purple-500 text-xs">
                        <span className="font-medium">Service Account:</span>{' '}
                        Configured
                      </div>
                    )} */}
                  </>
                )}

                {destination.url && (
                  <div className="text-purple-500 truncate">
                    <span className="font-medium">URL:</span> {destination.url}
                  </div>
                )}

                <div className="text-purple-500 text-xs">
                  Created:{' '}
                  {new Date(destination.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}

          {!filteredDestinations?.length && searchTerm && (
            <div className="col-span-full text-center py-8">
              <p className="text-purple-500">
                No destinations found matching "{searchTerm}"
              </p>
            </div>
          )}

          {!filteredDestinations?.length && !searchTerm && (
            <div className="col-span-full text-center py-8">
              <p className="text-purple-500">No destinations added yet.</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {destinations?.length === 0 && !searchTerm && (
          <div className="text-center py-16">
            <Database size={64} className="text-purple-400 mx-auto mb-4" />

            <h3 className="text-2xl font-semibold text-white mb-2">
              No destinations yet
            </h3>
            <p className="text-purple-500 mb-6">
              Create your first destination to get started
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-purple-700"
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
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-purple-400/20 ">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingDestination ? 'Edit Destination' : 'Create Destination'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-purple-500 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter destination name"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-500 text-sm font-medium mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="bigquery">BigQuery</option>
                  <option value="snowflake">Snowflake</option>
                  <option value="s3">Amazon S3</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-500 text-sm font-medium mb-2">
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
                  className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter project ID"
                />
              </div>

              {/* <div>
                <label className="block text-purple-500 text-sm font-medium mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter endpoint URL"
                />
              </div> */}

              {/* BigQuery Specific Fields */}
              {formData.type === 'bigquery' && (
                <>
                  {/* <div>
                    <label className="block text-purple-500 text-sm font-medium mb-2">
                      Service Account JSON *
                    </label>
                    <textarea
                      value={formData.serviceKeyJson}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceKeyJson: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none h-32 font-mono text-sm"
                      placeholder='Paste service account JSON ({"type": "service_account", ...})'
                      required
                    />
                  </div> */}

                  <div>
                    <label className="block text-purple-500 text-sm font-medium mb-2">
                      Dataset ID *
                    </label>
                    <input
                      type="text"
                      value={formData.datasetId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          datasetId: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Enter dataset ID"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-500 text-sm font-medium mb-2">
                      Target Table Name *
                    </label>
                    <input
                      type="text"
                      value={formData.targetTableName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetTableName: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Enter target table name"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-purple-500 text-sm font-medium mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:hover:bg-purple-700"
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg mx-auto mt-3"
                    height={64}
                    width={64}
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-white/10 border border-red-400/30 text-red-300 py-2 px-4 rounded-lg transition-colors hover:bg-red-400/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg transition-all hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingDestination
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
