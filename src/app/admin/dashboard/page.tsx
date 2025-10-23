"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Settings,
  Image,
  BarChart3,
  LogOut,
  MessageSquare,
  Eye,
  Stethoscope
} from "lucide-react";
import { useAuth, getAuthHeaders } from "@/contexts/AuthContext";

interface AdminStats {
  todayAppointments: number;
  totalPatients: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  unreadMessages: number;
}

interface RecentAppointment {
  id: string;
  startTime: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    name: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading, token } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    unreadMessages: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push("/admin");
      return;
    }

    if (isAuthenticated && user?.role === 'ADMIN' && token) {
      fetchAdminData();
    }
  }, [isAuthenticated, user, isLoading, router, token]);

  const fetchAdminData = async () => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      const response = await fetch('/api/admin/stats', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentAppointments(data.recentAppointments);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  if (isLoading || dataLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }


  const messages = [
    { id: 1, name: "Sofia Martinez", message: "Question about scheduling availability for next week", time: "2 hours ago" },
    { id: 2, name: "Pedro Gonzalez", message: "Thank you for the great treatment session!", time: "5 hours ago" },
    { id: 3, name: "Carmen Lopez", message: "Need to reschedule Friday appointment", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="h-8 w-8 text-gray-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Restart Admin</h1>
                <p className="text-sm text-gray-400">Welcome back, {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.todayAppointments}</div>
              <p className="text-xs text-gray-400">appointments scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.monthlyRevenue}</div>
              <p className="text-xs text-gray-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPatients}</div>
              <p className="text-xs text-gray-400">8 new patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Appointments</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingAppointments}</div>
              <p className="text-xs text-gray-400">Requires confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Button asChild className="h-20 flex-col">
            <Link href="/admin/appointments">
              <Calendar className="h-6 w-6 mb-2" />
              Appointments
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col" variant="outline">
            <Link href="/admin/services">
              <Stethoscope className="h-6 w-6 mb-2" />
              Services
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col" variant="outline">
            <Link href="/admin/schedule">
              <Clock className="h-6 w-6 mb-2" />
              Schedule
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col relative" variant="outline">
            <Link href="/admin/messages">
              <MessageSquare className="h-6 w-6 mb-2" />
              Messages
              {stats.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.unreadMessages}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col" variant="outline">
            <Link href="/admin/analytics">
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col" variant="outline">
            <Link href="/admin/settings">
              <Settings className="h-6 w-6 mb-2" />
              Settings
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Today's Appointments</CardTitle>
              <CardDescription className="text-gray-400">
                Your schedule for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                      <p className="text-sm text-gray-400">{appointment.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{new Date(appointment.startTime).toLocaleTimeString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/admin/appointments">View All Appointments</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Messages
              </CardTitle>
              <CardDescription className="text-gray-400">
                Patient inquiries and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-white text-sm">{message.name}</p>
                      <span className="text-xs text-gray-400">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-4" variant="outline">
                <Link href="/admin/messages">View All Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}