"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Heart, 
  ArrowLeft,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  X
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

interface PatientData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  loginTime: string;
}

export default function PatientAppointments() {
  const { t } = useLanguage();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
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
      duration: "15 min",
      status: "confirmed",
      notes: "Follow-up visit for lower back pain"
    },
    {
      id: "2", 
      service: "Recovery Visit",
      provider: "Dr. Gilliany Acevedo, D.C.",
      date: "2024-01-22",
      time: "2:30 PM",
      duration: "30 min",
      status: "pending",
      notes: "Therapeutic session for movement improvement"
    }
  ];

  const pastAppointments = [
    {
      id: "3",
      service: "Initial Evaluation & Consultation",
      provider: "Dr. Gilliany Acevedo, D.C.",
      date: "2024-01-08",
      time: "9:00 AM",
      duration: "75 min",
      status: "completed",
      notes: "Comprehensive assessment completed"
    },
    {
      id: "4",
      service: "Discovery Call",
      provider: "Dr. Gilliany Acevedo, D.C.",
      date: "2024-01-01",
      time: "11:00 AM",
      duration: "15 min", 
      status: "completed",
      notes: "Initial consultation and treatment planning"
    }
  ];

  const currentAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/patient/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="text-sm md:text-base">{t('patient.dashboard')}</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                <span className="text-lg md:text-xl font-bold text-white">Restart</span>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('patient.appointments')}</h1>
              <p className="text-gray-300">Manage your appointments and view your visit history</p>
            </div>
            <Link href="/book">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {t('patient.bookNew')}
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('patient.upcomingAppointments')}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('patient.pastAppointments')}
            </button>
          </div>

          {/* Appointments List */}
          {currentAppointments.length > 0 ? (
            <div className="space-y-4">
              {currentAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {appointment.service}
                            </h3>
                            <p className="text-gray-300 mb-2">{appointment.provider}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.time}
                              </span>
                              <span>
                                ({appointment.duration})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-900 text-green-200' 
                                : appointment.status === 'pending'
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-blue-900 text-blue-200'
                            }`}>
                              {appointment.status === 'confirmed' && t('admin.confirmed')}
                              {appointment.status === 'pending' && t('admin.pending')}
                              {appointment.status === 'completed' && 'Completed'}
                            </span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-1">{t('common.notes')}:</p>
                            <p className="text-sm text-gray-300">{appointment.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {t('patient.viewDetails')}
                          </Button>
                          
                          {activeTab === 'upcoming' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                {t('patient.reschedule')}
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-400 border-red-600 hover:bg-red-900">
                                <X className="h-3 w-3 mr-1" />
                                {t('patient.cancelAppointment')}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {activeTab === 'upcoming' ? t('patient.noUpcoming') : t('patient.noPast')}
                </h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming appointments scheduled."
                    : "No past appointments to display."
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <Link href="/book">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('patient.bookNew')}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}