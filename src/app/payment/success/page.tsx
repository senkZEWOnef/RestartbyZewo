"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle, Calendar, Clock, User, CreditCard, Download, ArrowRight } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

interface AppointmentData {
  service: string;
  provider: string;
  date: string;
  time: string;
  serviceDetails: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
  };
  paymentMethod: string;
  paymentData: any;
  status: string;
  appointmentId: string;
}

export default function PaymentSuccessPage() {
  const { t } = useLanguage();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get completed appointment data
    const completedAppointment = localStorage.getItem("completed_appointment");
    if (completedAppointment) {
      try {
        const appointment = JSON.parse(completedAppointment);
        setAppointmentData(appointment);
      } catch (error) {
        console.error("Error parsing appointment data:", error);
        window.location.href = "/book";
      }
    } else {
      // No appointment data, redirect to booking page
      window.location.href = "/book";
    }
    setIsLoading(false);
  }, []);

  const formatCurrency = (cents: number) => {
    if (cents === 0) return t('booking.free');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Credit/Debit Card';
      case 'athmovil':
        return 'ATH Móvil';
      case 'free':
        return 'Complimentary Service';
      default:
        return method;
    }
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Receipt download coming soon! Your receipt will be emailed to you shortly.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!appointmentData) {
    return null;
  }

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
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-900/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Appointment Confirmed!
            </h1>
            <p className="text-lg text-gray-300">
              Your appointment has been successfully booked and {appointmentData.serviceDetails.price > 0 ? 'paid for' : 'confirmed'}.
            </p>
          </div>

          {/* Appointment Details */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointment Details
              </CardTitle>
              <CardDescription>Confirmation ID: {appointmentData.appointmentId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Service</p>
                    <p className="text-white font-medium">{appointmentData.serviceDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Date & Time</p>
                    <p className="text-white">
                      {new Date(appointmentData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-300">{appointmentData.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Duration</p>
                    <p className="text-white">{appointmentData.serviceDetails.duration} minutes</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Provider</p>
                    <p className="text-white font-medium">Dr. Gilliany Acevedo, D.C.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Payment Method</p>
                    <p className="text-white">{getPaymentMethodDisplay(appointmentData.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Amount Paid</p>
                    <p className="text-white font-medium text-lg">{formatCurrency(appointmentData.serviceDetails.price)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Location & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">Address</p>
                  <p className="text-white">1413 Ave Manuel Fernandez Juncos</p>
                  <p className="text-white">Suite 3G, San Juan, PR</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">Contact</p>
                  <p className="text-white">Phone: (787) 404-6909</p>
                  <p className="text-white">Email: restartquiro@gmail.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">Office Hours</p>
                  <p className="text-white">Monday - Friday: 8:00 AM - 7:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-blue-900/20 border-blue-800 mb-6">
            <CardHeader>
              <CardTitle className="text-blue-200">Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-blue-100">
                <p>• Please arrive 15 minutes early to complete any necessary paperwork</p>
                <p>• Bring a valid photo ID and insurance card (if applicable)</p>
                <p>• Wear comfortable clothing appropriate for physical therapy</p>
                <p>• If you need to reschedule, please call at least 24 hours in advance</p>
                <p>• You will receive a confirmation email with additional details</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {appointmentData.serviceDetails.price > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}
              <Link href="/patient/dashboard" className="block">
                <Button className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  View in Patient Portal
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <Link href="/book">
                <Button variant="outline" size="sm">
                  Book Another Appointment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="bg-gray-900 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle className="text-white">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-700 rounded-full p-2 flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Confirmation Email</p>
                    <p className="text-gray-400 text-sm">You'll receive a detailed confirmation email within 5 minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-700 rounded-full p-2 flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Reminder Notifications</p>
                    <p className="text-gray-400 text-sm">We'll send you reminders 24 hours and 2 hours before your appointment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-700 rounded-full p-2 flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Preparation Instructions</p>
                    <p className="text-gray-400 text-sm">Any specific preparation instructions will be included in your confirmation email.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}