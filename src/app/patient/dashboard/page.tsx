"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Heart, 
  MessageSquare, 
  CreditCard, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Bell,
  ChevronRight 
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

interface PatientData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  loginTime: string;
  isNewUser?: boolean;
}

export default function PatientDashboard() {
  const { t } = useLanguage();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem("patient_auth");
    if (authData) {
      try {
        const patient = JSON.parse(authData);
        setPatientData(patient);
      } catch (error) {
        console.error("Error parsing patient data:", error);
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patient_auth");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!patientData) {
    return null;
  }

  const upcomingAppointments = [
    {
      id: "1",
      service: "Chiropractic Visit",
      provider: "Dr. Gilliany Acevedo, D.C.",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: "2", 
      service: "Recovery Visit",
      provider: "Dr. Gilliany Acevedo, D.C.",
      date: "2024-01-22",
      time: "2:30 PM",
      status: "pending"
    }
  ];

  const recentMessages = [
    {
      id: "1",
      subject: "Appointment Reminder",
      from: "Restart Team",
      date: "2024-01-10",
      preview: "Your appointment is scheduled for tomorrow at 10:00 AM..."
    },
    {
      id: "2",
      subject: "New Treatment Plan Available", 
      from: "Dr. Acevedo",
      date: "2024-01-08",
      preview: "Based on your recent evaluation, I've prepared a new..."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
              <span className="text-lg md:text-xl font-bold text-white">Restart</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300 hidden md:block">
                  {patientData.firstName} {patientData.lastName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  {t('auth.logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('auth.welcomeBack')}, {patientData.firstName}!
            </h1>
            <p className="text-gray-300">
              {patientData.isNewUser 
                ? "Welcome to your patient portal. Manage your appointments and health journey here."
                : "Here's what's happening with your care."
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link href="/book" className="block">
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">{t('patient.bookNew')}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/patient/appointments" className="block">
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">{t('patient.appointments')}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/patient/messages" className="block">
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">{t('patient.messages')}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/patient/payments" className="block">
              <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">{t('patient.payments')}</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{t('patient.upcomingAppointments')}</CardTitle>
                    <Link href="/patient/appointments">
                      <Button variant="outline" size="sm">
                        {t('common.view')} All
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{appointment.service}</h4>
                              <p className="text-sm text-gray-300 mb-2">{appointment.provider}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(appointment.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {appointment.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-900 text-green-200' 
                                  : 'bg-yellow-900 text-yellow-200'
                              }`}>
                                {appointment.status === 'confirmed' ? t('admin.confirmed') : t('admin.pending')}
                              </span>
                              <Button variant="outline" size="sm" className="text-xs">
                                {t('patient.viewDetails')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">{t('patient.noUpcoming')}</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{t('patient.messages')}</CardTitle>
                    <Link href="/patient/messages">
                      <Button variant="outline" size="sm">
                        {t('common.view')} All
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentMessages.length > 0 ? (
                    <div className="space-y-4">
                      {recentMessages.map((message) => (
                        <div key={message.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white text-sm">{message.subject}</h4>
                            <span className="text-xs text-gray-400">{new Date(message.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">From: {message.from}</p>
                          <p className="text-sm text-gray-300">{message.preview}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">{t('patient.noMessages')}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{t('patient.profile')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                      <p className="text-sm text-white">{patientData.firstName} {patientData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-white">{patientData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                      <p className="text-sm text-white">{patientData.phone}</p>
                    </div>
                    <Link href="/patient/profile">
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <User className="h-3 w-3 mr-2" />
                        {t('patient.updateProfile')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/patient/payments" className="block">
                      <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t('patient.payments')}
                      </Button>
                    </Link>
                    <Link href="/patient/settings" className="block">
                      <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('patient.settings')}
                      </Button>
                    </Link>
                    <Link href="/patient/promotions" className="block">
                      <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                        <Bell className="h-4 w-4 mr-2" />
                        {t('patient.promotions')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}