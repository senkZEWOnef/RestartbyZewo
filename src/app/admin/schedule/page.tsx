"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  ArrowLeft, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import { useAuth, getAuthHeaders } from "@/contexts/AuthContext";

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export default function AdminSchedule() {
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [providerId, setProviderId] = useState<string>("");
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push("/admin");
      return;
    }

    if (isAuthenticated && user?.role === 'ADMIN' && token) {
      loadAvailability();
    }
  }, [isAuthenticated, user, token, isLoading, router]);

  const loadAvailability = async () => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      const response = await fetch('/api/admin/availability', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability);
        setProviderId(data.providerId);
      } else {
        setError('Failed to load availability data');
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setError('Failed to load availability data');
    } finally {
      setDataLoading(false);
    }
  };

  if (isLoading || dataLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupedAvailability = availability.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<number, AvailabilitySlot[]>);

  const handleSaveSlot = async (slot: AvailabilitySlot) => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);

      if (editingSlot) {
        // Update existing slot
        const response = await fetch(`/api/admin/availability/${editingSlot}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            active: slot.active
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAvailability(prev => prev.map(s => s.id === editingSlot ? data.availability : s));
          setEditingSlot(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to update availability slot');
        }
      } else {
        // Create new slot
        const response = await fetch('/api/admin/availability', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            providerId
          })
        });

        if (response.ok) {
          const data = await response.json();
          setAvailability(prev => [...prev, data.availability]);
          setIsAddingSlot(false);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to create availability slot');
        }
      }
    } catch (error) {
      console.error('Error saving slot:', error);
      setError('Failed to save availability slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      const response = await fetch(`/api/admin/availability/${slotId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setAvailability(prev => prev.filter(s => s.id !== slotId));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete availability slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      setError('Failed to delete availability slot');
    }
  };

  const toggleSlotActive = async (slotId: string) => {
    if (!token) return;

    const slot = availability.find(s => s.id === slotId);
    if (!slot) return;

    try {
      const headers = getAuthHeaders(token);
      const response = await fetch(`/api/admin/availability/${slotId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          active: !slot.active
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(prev => prev.map(s => 
          s.id === slotId ? data.availability : s
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to toggle availability slot');
      }
    } catch (error) {
      console.error('Error toggling slot:', error);
      setError('Failed to toggle availability slot');
    }
  };

  const AvailabilitySlotEditor = ({ 
    slot, 
    onSave, 
    onCancel 
  }: { 
    slot?: AvailabilitySlot; 
    onSave: (slot: AvailabilitySlot) => void;
    onCancel: () => void;
  }) => {
    const [dayOfWeek, setDayOfWeek] = useState(slot?.dayOfWeek || 1);
    const [startTime, setStartTime] = useState(slot?.startTime || "08:00");
    const [endTime, setEndTime] = useState(slot?.endTime || "17:00");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        id: slot?.id || 0,
        dayOfWeek,
        startTime,
        endTime,
        active: slot?.active ?? true
      });
    };

    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">
            {slot ? 'Edit' : 'Add'} Availability Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <Heart className="h-6 w-6 text-gray-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Schedule Management</h1>
                <p className="text-sm text-gray-400">Manage your availability and working hours</p>
              </div>
            </div>
            <Button onClick={() => setIsAddingSlot(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-md mb-6">
            {error}
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Current Hours Overview */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Current Business Hours</CardTitle>
            <CardDescription className="text-gray-400">
              Your current availability schedule (8:00 AM - 7:00 PM)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {daysOfWeek.map((day, dayIndex) => {
                const daySlots = groupedAvailability[dayIndex] || [];
                return (
                  <div key={dayIndex} className="space-y-2">
                    <h3 className="font-medium text-white text-sm">{day}</h3>
                    {daySlots.length === 0 ? (
                      <p className="text-xs text-gray-500">Closed</p>
                    ) : (
                      daySlots.map((slot) => (
                        <div 
                          key={slot.id}
                          className={`p-2 rounded text-xs ${
                            slot.active 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-gray-800 text-gray-500'
                          }`}
                        >
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add New Slot */}
        {isAddingSlot && (
          <div className="mb-6">
            <AvailabilitySlotEditor
              onSave={handleSaveSlot}
              onCancel={() => setIsAddingSlot(false)}
            />
          </div>
        )}

        {/* Availability Slots Management */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Manage Time Slots</CardTitle>
            <CardDescription className="text-gray-400">
              Edit or disable individual time slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availability.map((slot) => (
                <div key={slot.id}>
                  {editingSlot === slot.id ? (
                    <AvailabilitySlotEditor
                      slot={slot}
                      onSave={handleSaveSlot}
                      onCancel={() => setEditingSlot(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-white">
                            {daysOfWeek[slot.dayOfWeek]}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            slot.active 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {slot.active ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSlotActive(slot.id)}
                        >
                          {slot.active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSlot(slot.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}