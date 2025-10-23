"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  DollarSign,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 15,
    price: 0,
    category: 'GENERAL',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/admin');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/admin/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        } else {
          setError('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services');
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchServices();
    }
  }, [isAuthenticated, token]);

  const formatCurrency = (cents: number) => {
    if (cents === 0) return "Free";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // If service was deactivated instead of deleted, update the list
        if (data.service) {
          setServices(prev => prev.map(service => 
            service.id === serviceId ? { ...service, isActive: false } : service
          ));
        } else {
          // Service was actually deleted
          setServices(prev => prev.filter(service => service.id !== serviceId));
        }
      } else {
        setError('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service');
    }
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
      category: service.category,
      isActive: service.isActive
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 15,
      price: 0,
      category: 'GENERAL',
      isActive: true
    });
    setShowAddForm(false);
    setEditingService(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = editingService 
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (editingService) {
          // Update existing service
          setServices(prev => prev.map(service => 
            service.id === editingService.id ? data.service : service
          ));
        } else {
          // Add new service
          setServices(prev => [data.service, ...prev]);
        }
        
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Services Management</h1>
                <p className="text-gray-400">Manage your practice services and pricing</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {service.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(service)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Category: {service.category}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      service.isActive 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <p className="text-gray-400">No services found. Create your first service to get started.</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Service Modal would go here */}
      {(showAddForm || editingService) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Consultation, Adjustment, Therapy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Brief description of the service"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (USD cents) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 8000 for $80.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="TREATMENT">Treatment</option>
                  <option value="THERAPY">Therapy</option>
                  <option value="EXAMINATION">Examination</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Service is active and available for booking
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (editingService ? 'Updating...' : 'Creating...') 
                    : (editingService ? 'Update Service' : 'Create Service')
                  }
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}