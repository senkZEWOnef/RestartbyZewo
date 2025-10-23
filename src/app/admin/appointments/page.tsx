"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";

export default function AdminAppointments() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const auth = localStorage.getItem("restart_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patient: "Maria Rodriguez",
      email: "maria.r@email.com",
      phone: "(787) 555-0123",
      service: "Discovery Call",
      date: "2024-10-23",
      time: "9:00 AM",
      duration: 15,
      status: "confirmed",
      price: 0,
      notes: "First time patient, lower back pain"
    },
    {
      id: 2,
      patient: "Carlos Mendez",
      email: "carlos.m@email.com",
      phone: "(787) 555-0456",
      service: "Chiropractic Visit",
      date: "2024-10-23",
      time: "10:30 AM",
      duration: 15,
      status: "pending",
      price: 55,
      notes: "Follow-up visit"
    },
    {
      id: 3,
      patient: "Ana Vasquez",
      email: "ana.v@email.com",
      phone: "(787) 555-0789",
      service: "Recovery Visit",
      date: "2024-10-23",
      time: "2:00 PM",
      duration: 30,
      status: "confirmed",
      price: 80,
      notes: "Post-injury rehabilitation"
    },
    {
      id: 4,
      patient: "Luis Rivera",
      email: "luis.r@email.com",
      phone: "(787) 555-0321",
      service: "Initial Evaluation & Consultation",
      date: "2024-10-23",
      time: "4:00 PM",
      duration: 75,
      status: "pending",
      price: 150,
      notes: "Comprehensive assessment needed"
    },
    {
      id: 5,
      patient: "Sofia Martinez",
      email: "sofia.m@email.com",
      phone: "(787) 555-0654",
      service: "Restart Relief and Movement Visit",
      date: "2024-10-24",
      time: "10:00 AM",
      duration: 60,
      status: "confirmed",
      price: 120,
      notes: "Chronic pain management"
    }
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDate = apt.date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900 text-green-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Changing appointment ${appointmentId} status to ${newStatus}`);
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
                <h1 className="text-xl font-bold text-white">Appointment Management</h1>
                <p className="text-sm text-gray-400">Manage your patient appointments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No appointments found for the selected criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Patient Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {appointment.patient}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-2" />
                              {appointment.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2" />
                              {appointment.phone}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.status)}
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 p-2 bg-gray-800 rounded">
                          <p className="text-sm text-gray-300">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <h4 className="font-medium text-white mb-2">Service Details</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p><strong>Service:</strong> {appointment.service}</p>
                        <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                        <p><strong>Price:</strong> {appointment.price === 0 ? 'Free' : `$${appointment.price}`}</p>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        Contact Patient
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}