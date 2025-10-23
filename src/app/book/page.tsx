"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, DollarSign, Heart } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

const services = [
  { id: "1", name: "Discovery Call", duration: 15, price: 0, description: "Free consultation to discuss your needs and treatment options" },
  { id: "2", name: "Initial Evaluation & Consultation", duration: 75, price: 15000, description: "Comprehensive assessment and personalized treatment planning" },
  { id: "3", name: "Chiropractic Visit", duration: 15, price: 5500, description: "Focused chiropractic adjustment and manual therapy" },
  { id: "4", name: "Recovery Visit", duration: 30, price: 8000, description: "Therapeutic recovery session with advanced techniques" },
  { id: "5", name: "Restart Relief and Movement Visit", duration: 60, price: 12000, description: "Comprehensive rehabilitation session for pain relief and movement improvement" },
  { id: "6", name: "Medical Plan Initial Evaluation", duration: 45, price: 10000, description: "Medical evaluation for insurance-based treatment plans" },
];

const providers = [
  { id: "1", name: "Dr. Gilliany Acevedo, D.C.", specialties: ["Discovery Call", "Initial Evaluation & Consultation", "Chiropractic Visit", "Recovery Visit", "Restart Relief and Movement Visit", "Medical Plan Initial Evaluation"] },
];

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"
];

export default function BookingPage() {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Check for homepage booking data on component mount
  useEffect(() => {
    const homepageBooking = localStorage.getItem("homepage_booking");
    if (homepageBooking) {
      try {
        const bookingData = JSON.parse(homepageBooking);
        setSelectedDate(bookingData.date);
        setSelectedTime(bookingData.time);
        // Clear the homepage booking data
        localStorage.removeItem("homepage_booking");
      } catch (error) {
        console.error("Error parsing homepage booking data:", error);
      }
    }
  }, []);

  const selectedServiceData = services.find(s => s.id === selectedService);
  const availableProviders = providers.filter(p => 
    !selectedService || p.specialties.includes(selectedServiceData?.name || "")
  );

  const formatCurrency = (cents: number) => {
    if (cents === 0) return t('booking.free');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getServiceName = (serviceKey: string) => {
    const serviceMap: { [key: string]: string } = {
      "Discovery Call": t('services.discoveryCall'),
      "Initial Evaluation & Consultation": t('services.initialEvaluation'),
      "Chiropractic Visit": t('services.chiropracticVisit'),
      "Recovery Visit": t('services.recoveryVisit'),
      "Restart Relief and Movement Visit": t('services.reliefMovement'),
      "Medical Plan Initial Evaluation": t('services.medicalPlan')
    };
    return serviceMap[serviceKey] || serviceKey;
  };

  const getServiceDescription = (serviceKey: string) => {
    const descMap: { [key: string]: string } = {
      "Discovery Call": t('services.discoveryCallDesc'),
      "Initial Evaluation & Consultation": t('services.initialEvaluationDesc'),
      "Chiropractic Visit": t('services.chiropracticVisitDesc'),
      "Recovery Visit": t('services.recoveryVisitDesc'),
      "Restart Relief and Movement Visit": t('services.reliefMovementDesc'),
      "Medical Plan Initial Evaluation": t('services.medicalPlanDesc')
    };
    return descMap[serviceKey] || serviceKey;
  };

  const canProceed = selectedService && selectedProvider && selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="text-sm md:text-base">{t('services.backToHome')}</span>
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

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">{t('booking.title')}</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Step 1: Select Service */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
                    <span className="bg-gray-700 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base">1</span>
                    {t('booking.selectService')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-colors ${
                          selectedService === service.id
                            ? "border-gray-500 bg-gray-800"
                            : "border-gray-700 hover:border-gray-600 bg-gray-800"
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <h3 className="font-semibold text-white text-sm md:text-base mb-1">{getServiceName(service.name)}</h3>
                        <p className="text-xs md:text-sm text-gray-300 mb-2 line-clamp-2">{getServiceDescription(service.name)}</p>
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            {service.duration} {t('booking.minutes')}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-gray-300">
                            <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select Provider */}
              <Card className={`bg-gray-900 border-gray-800 ${!selectedService ? "opacity-50" : ""}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <span className={`rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base ${
                      selectedService ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-400"
                    }`}>2</span>
                    <span className={selectedService ? "text-white" : "text-gray-400"}>Choose Your Provider</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedService ? (
                    <p className="text-gray-500 text-sm md:text-base">Please select a service first</p>
                  ) : (
                    <div className="grid gap-3 md:gap-4">
                      {availableProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-colors ${
                            selectedProvider === provider.id
                              ? "border-gray-500 bg-gray-800"
                              : "border-gray-700 hover:border-gray-600 bg-gray-800"
                          }`}
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          <h3 className="font-semibold text-white text-sm md:text-base">{provider.name}</h3>
                          <p className="text-xs md:text-sm text-gray-300">
                            Specializes in: {provider.specialties.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 3: Select Date & Time */}
              <Card className={`bg-gray-900 border-gray-800 ${!selectedProvider ? "opacity-50" : ""}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <span className={`rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-base ${
                      selectedProvider ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-400"
                    }`}>3</span>
                    <span className={selectedProvider ? "text-white" : "text-gray-400"}>Pick Date & Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedProvider ? (
                    <p className="text-gray-500 text-sm md:text-base">Please select a provider first</p>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
                          Select Date
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </div>
                      
                      {selectedDate && (
                        <div>
                          <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
                            Available Times
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 md:p-3 text-xs md:text-sm border rounded transition-colors ${
                                  selectedTime === time
                                    ? "border-gray-500 bg-gray-700 text-white"
                                    : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800 sticky top-4">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg md:text-xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServiceData && (
                    <div>
                      <h4 className="font-semibold text-white text-sm md:text-base">Service</h4>
                      <p className="text-gray-300 text-sm md:text-base">{selectedServiceData.name}</p>
                      <p className="text-xs md:text-sm text-gray-400">{selectedServiceData.duration} minutes</p>
                    </div>
                  )}
                  
                  {selectedProvider && (
                    <div>
                      <h4 className="font-semibold text-white text-sm md:text-base">Provider</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        {providers.find(p => p.id === selectedProvider)?.name}
                      </p>
                    </div>
                  )}
                  
                  {selectedDate && selectedTime && (
                    <div>
                      <h4 className="font-semibold text-white text-sm md:text-base">Date & Time</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-300 text-sm md:text-base">{selectedTime}</p>
                    </div>
                  )}
                  
                  {selectedServiceData && (
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white text-sm md:text-base">Total</span>
                        <span className="text-lg md:text-xl font-bold text-gray-300">
                          {formatCurrency(selectedServiceData.price)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full text-sm md:text-base" 
                    disabled={!canProceed}
                    onClick={() => {
                      if (canProceed) {
                        // Check if user is logged in
                        const authData = localStorage.getItem("patient_auth");
                        if (authData) {
                          // Store booking data and redirect to payment page
                          localStorage.setItem("booking_intent", JSON.stringify({
                            service: selectedService,
                            provider: selectedProvider,
                            date: selectedDate,
                            time: selectedTime
                          }));
                          window.location.href = "/payment";
                        } else {
                          // Redirect to login with booking intent
                          localStorage.setItem("booking_intent", JSON.stringify({
                            service: selectedService,
                            provider: selectedProvider,
                            date: selectedDate,
                            time: selectedTime
                          }));
                          window.location.href = "/login";
                        }
                      }
                    }}
                  >
                    {canProceed ? "Continue to Payment" : "Complete Selection"}
                  </Button>
                  
                  {!canProceed && (
                    <p className="text-xs md:text-sm text-gray-500 text-center">
                      Please complete all steps above
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}