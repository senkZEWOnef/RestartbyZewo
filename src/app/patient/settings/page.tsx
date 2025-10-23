"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  Save,
  Edit
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

export default function PatientSettings() {
  const { t, language, setLanguage } = useLanguage();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    promotional: true,
    reminders: true
  });

  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem("patient_auth");
    if (authData) {
      try {
        const patient = JSON.parse(authData);
        setPatientData(patient);
        setFormData({
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone
        });
      } catch (error) {
        console.error("Error parsing patient data:", error);
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSaveProfile = () => {
    if (patientData) {
      const updatedPatient = {
        ...patientData,
        ...formData
      };
      localStorage.setItem("patient_auth", JSON.stringify(updatedPatient));
      setPatientData(updatedPatient);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
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
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('patient.settings')}</h1>
            <p className="text-gray-300">Manage your account preferences and settings</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? t('common.cancel') : t('common.edit')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.firstName')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      ) : (
                        <p className="text-white bg-gray-800 rounded-md px-3 py-2 text-sm">
                          {patientData.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('auth.lastName')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      ) : (
                        <p className="text-white bg-gray-800 rounded-md px-3 py-2 text-sm">
                          {patientData.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('auth.email')}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    ) : (
                      <p className="text-white bg-gray-800 rounded-md px-3 py-2 text-sm">
                        {patientData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('auth.phone')}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    ) : (
                      <p className="text-white bg-gray-800 rounded-md px-3 py-2 text-sm">
                        {patientData.phone}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      {t('common.save')} Changes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  {t('patient.notificationPreferences')}
                </CardTitle>
                <CardDescription>Control how you receive updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{t('patient.emailNotifications')}</p>
                      <p className="text-sm text-gray-400">Receive appointment reminders via email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('email')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        notifications.email ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notifications.email ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{t('patient.smsNotifications')}</p>
                      <p className="text-sm text-gray-400">Get text message reminders</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('sms')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        notifications.sms ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notifications.sms ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{t('patient.promotionalEmails')}</p>
                      <p className="text-sm text-gray-400">Receive offers and promotions</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('promotional')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        notifications.promotional ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notifications.promotional ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Appointment Reminders</p>
                      <p className="text-sm text-gray-400">24-hour and 2-hour reminders</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('reminders')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        notifications.reminders ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        notifications.reminders ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Language Preferences
                </CardTitle>
                <CardDescription>Choose your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      language === 'en'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">English</span>
                      {language === 'en' && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      language === 'es'
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Español</span>
                      {language === 'es' && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    {t('patient.changePassword')}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-400 border-red-600 hover:bg-red-900">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}