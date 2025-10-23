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

interface AvailabilitySlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export default function AdminSchedule() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("restart_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadAvailability();
    } else {
      router.push("/admin");
    }
  }, [router]);

  const loadAvailability = () => {
    // Mock data - in real app this would come from API
    const mockAvailability: AvailabilitySlot[] = [
      { id: 1, dayOfWeek: 1, startTime: "08:00", endTime: "12:00", active: true },
      { id: 2, dayOfWeek: 1, startTime: "13:00", endTime: "19:00", active: true },
      { id: 3, dayOfWeek: 2, startTime: "08:00", endTime: "12:00", active: true },
      { id: 4, dayOfWeek: 2, startTime: "13:00", endTime: "19:00", active: true },
      { id: 5, dayOfWeek: 3, startTime: "08:00", endTime: "12:00", active: true },
      { id: 6, dayOfWeek: 3, startTime: "13:00", endTime: "19:00", active: true },
      { id: 7, dayOfWeek: 4, startTime: "08:00", endTime: "12:00", active: true },
      { id: 8, dayOfWeek: 4, startTime: "13:00", endTime: "19:00", active: true },
      { id: 9, dayOfWeek: 5, startTime: "08:00", endTime: "12:00", active: true },
      { id: 10, dayOfWeek: 5, startTime: "13:00", endTime: "19:00", active: true },
    ];
    setAvailability(mockAvailability);
  };

  if (!isAuthenticated) {
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

  const handleSaveSlot = (slot: AvailabilitySlot) => {
    if (editingSlot) {
      setAvailability(prev => prev.map(s => s.id === editingSlot ? slot : s));
      setEditingSlot(null);
    } else {
      const newSlot = { ...slot, id: Date.now() };
      setAvailability(prev => [...prev, newSlot]);
      setIsAddingSlot(false);
    }
  };

  const handleDeleteSlot = (slotId: number) => {
    setAvailability(prev => prev.filter(s => s.id !== slotId));
  };

  const toggleSlotActive = (slotId: number) => {
    setAvailability(prev => prev.map(s => 
      s.id === slotId ? { ...s, active: !s.active } : s
    ));
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