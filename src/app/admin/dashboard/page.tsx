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
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("restart_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("restart_admin_auth");
    router.push("/admin");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mock data for dashboard
  const stats = {
    todayAppointments: 6,
    weeklyRevenue: 1250,
    monthlyPatients: 48,
    pendingBookings: 3
  };

  const recentAppointments = [
    { id: 1, patient: "Maria Rodriguez", service: "Discovery Call", time: "9:00 AM", status: "confirmed" },
    { id: 2, patient: "Carlos Mendez", service: "Chiropractic Visit", time: "10:30 AM", status: "pending" },
    { id: 3, patient: "Ana Vasquez", service: "Recovery Visit", time: "2:00 PM", status: "confirmed" },
    { id: 4, patient: "Luis Rivera", service: "Initial Evaluation", time: "4:00 PM", status: "pending" },
  ];

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
                <p className="text-sm text-gray-400">Welcome back, Dr. Acevedo</p>
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
              <p className="text-xs text-gray-400">2 confirmed, 1 pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Weekly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.weeklyRevenue}</div>
              <p className="text-xs text-gray-400">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Monthly Patients</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.monthlyPatients}</div>
              <p className="text-xs text-gray-400">8 new patients</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingBookings}</div>
              <p className="text-xs text-gray-400">Requires confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex-col">
            <Link href="/admin/appointments">
              <Calendar className="h-6 w-6 mb-2" />
              Appointments
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col" variant="outline">
            <Link href="/admin/schedule">
              <Clock className="h-6 w-6 mb-2" />
              Schedule
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
                      <p className="font-medium text-white">{appointment.patient}</p>
                      <p className="text-sm text-gray-400">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{appointment.time}</p>
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