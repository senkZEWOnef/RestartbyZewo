"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Heart, 
  ArrowLeft,
  Gift,
  Star,
  Calendar,
  Tag,
  CheckCircle,
  Settings
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

export default function PatientPromotions() {
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

  const promotions = [
    {
      id: "1",
      title: "Welcome Package - 20% Off",
      description: "Get 20% off your first Recovery Visit as a new patient!",
      type: "discount",
      validUntil: "2024-02-15",
      code: "WELCOME20",
      isActive: true,
      isUsed: false,
      terms: "Valid for new patients only. Cannot be combined with other offers. Expires February 15, 2024."
    },
    {
      id: "2",
      title: "February Wellness Month",
      description: "Book 3 sessions and get the 4th one free during February!",
      type: "special",
      validUntil: "2024-02-29",
      code: "FEB3GET1",
      isActive: true,
      isUsed: false,
      terms: "Valid for Recovery Visits and Restart Relief sessions only. Must be booked within February 2024."
    },
    {
      id: "3",
      title: "Referral Bonus",
      description: "Refer a friend and both get $25 off your next visit!",
      type: "referral",
      validUntil: "2024-12-31",
      code: "REFER25",
      isActive: true,
      isUsed: false,
      terms: "Valid when your referred friend completes their first appointment. Credit applied automatically."
    }
  ];

  const notifications = [
    {
      id: "1",
      title: "Appointment Reminder",
      message: "Your appointment with Dr. Acevedo is tomorrow at 10:00 AM",
      type: "reminder",
      date: "2024-01-14T20:00:00Z",
      isRead: false,
      priority: "high"
    },
    {
      id: "2",
      title: "New Treatment Plan",
      message: "Dr. Acevedo has created a new treatment plan for you. Check your messages.",
      type: "treatment",
      date: "2024-01-08T14:30:00Z",
      isRead: true,
      priority: "medium"
    },
    {
      id: "3",
      title: "Payment Reminder",
      message: "You have an outstanding balance of $55.00 due January 29th",
      type: "payment",
      date: "2024-01-12T09:00:00Z",
      isRead: false,
      priority: "high"
    },
    {
      id: "4",
      title: "Welcome to Restart!",
      message: "Welcome to your patient portal! Explore all the features available to you.",
      type: "welcome",
      date: "2024-01-01T09:00:00Z",
      isRead: true,
      priority: "low"
    }
  ];

  const handleUsePromotion = (promoId: string) => {
    alert("Promotion applied! Use this code when booking your next appointment.");
  };

  const markAsRead = (notificationId: string) => {
    // In a real app, this would update the notification status
    console.log("Marking notification as read:", notificationId);
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Tag className="h-6 w-6 text-green-400" />;
      case 'special':
        return <Star className="h-6 w-6 text-yellow-400" />;
      case 'referral':
        return <Gift className="h-6 w-6 text-blue-400" />;
      default:
        return <Gift className="h-6 w-6 text-gray-400" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-400" />;
      case 'treatment':
        return <Heart className="h-5 w-5 text-green-400" />;
      case 'payment':
        return <Bell className="h-5 w-5 text-red-400" />;
      case 'welcome':
        return <Gift className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('patient.promotions')}</h1>
            <p className="text-gray-300">Stay updated with special offers and important notifications</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Promotions & Offers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Special Offers</h2>
                <div className="flex items-center text-sm text-gray-400">
                  <Gift className="h-4 w-4 mr-1" />
                  {promotions.filter(p => p.isActive && !p.isUsed).length} active
                </div>
              </div>

              <div className="space-y-4">
                {promotions.map((promo) => (
                  <Card key={promo.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getPromotionIcon(promo.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{promo.title}</h3>
                            {promo.isUsed && (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            )}
                          </div>
                          <p className="text-gray-300 mb-3">{promo.description}</p>
                          
                          <div className="bg-gray-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Promo Code:</span>
                              <span className="font-mono text-white bg-gray-700 px-2 py-1 rounded text-sm">
                                {promo.code}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400">
                              Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                            </span>
                            {promo.isActive && !promo.isUsed && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUsePromotion(promo.id)}
                                className="bg-green-700 hover:bg-green-600"
                              >
                                Use Offer
                              </Button>
                            )}
                          </div>

                          <p className="text-xs text-gray-500">{promo.terms}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  {t('patient.notifications')}
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <Link href="/patient/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Preferences
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`bg-gray-900 border-gray-800 cursor-pointer transition-colors hover:bg-gray-800 ${
                      !notification.isRead ? 'ring-1 ring-blue-600' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${
                              notification.isRead ? 'text-gray-300' : 'text-white'
                            }`}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {new Date(notification.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            notification.isRead ? 'text-gray-400' : 'text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              notification.priority === 'high' 
                                ? 'bg-red-900 text-red-200'
                                : notification.priority === 'medium'
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {notification.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Notification Preferences */}
              <Card className="bg-gray-900 border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how you receive updates from Restart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{t('patient.emailNotifications')}</span>
                      <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{t('patient.smsNotifications')}</span>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{t('patient.promotionalEmails')}</span>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
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