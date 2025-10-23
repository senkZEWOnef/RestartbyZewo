"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, CreditCard, Smartphone, Shield, Clock, Calendar } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

interface BookingData {
  service: string;
  provider: string;
  date: string;
  time: string;
}

interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

const services: ServiceData[] = [
  { id: "1", name: "Discovery Call", duration: 15, price: 0, description: "Free consultation to discuss your needs and treatment options" },
  { id: "2", name: "Initial Evaluation & Consultation", duration: 75, price: 15000, description: "Comprehensive assessment and personalized treatment planning" },
  { id: "3", name: "Chiropractic Visit", duration: 15, price: 5500, description: "Focused chiropractic adjustment and manual therapy" },
  { id: "4", name: "Recovery Visit", duration: 30, price: 8000, description: "Therapeutic recovery session with advanced techniques" },
  { id: "5", name: "Restart Relief and Movement Visit", duration: 60, price: 12000, description: "Comprehensive rehabilitation session for pain relief and movement improvement" },
  { id: "6", name: "Medical Plan Initial Evaluation", duration: 45, price: 10000, description: "Medical evaluation for insurance-based treatment plans" },
];

// ATH Móvil configuration interface
declare global {
  interface Window {
    ATHM_Checkout: any;
    authorizationATHM: () => Promise<void>;
    cancelATHM: () => Promise<void>;
    expiredATHM: () => Promise<void>;
    authorization: () => Promise<any>;
    findPaymentATHM: () => Promise<any>;
  }
}

export default function PaymentPage() {
  const { t } = useLanguage();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'athmovil' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [athMovilLoaded, setAthMovilLoaded] = useState(false);

  useEffect(() => {
    // Get booking intent from localStorage
    const bookingIntent = localStorage.getItem("booking_intent");
    if (bookingIntent) {
      try {
        const booking = JSON.parse(bookingIntent);
        setBookingData(booking);
        
        // Find the selected service
        const service = services.find(s => s.id === booking.service);
        setSelectedService(service || null);
      } catch (error) {
        console.error("Error parsing booking data:", error);
        window.location.href = "/book";
      }
    } else {
      // No booking data, redirect to booking page
      window.location.href = "/book";
    }
  }, []);

  // Load ATH Móvil script
  useEffect(() => {
    if (selectedService && selectedService.price > 0) {
      const script = document.createElement('script');
      script.src = 'https://payments.athmovil.com/api/js/athmovil_base.js';
      script.async = true;
      script.onload = () => {
        setAthMovilLoaded(true);
        initializeATHMovil();
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup
        document.head.removeChild(script);
      };
    }
  }, [selectedService]);

  const initializeATHMovil = () => {
    if (!selectedService || selectedService.price === 0) return;

    // Configure ATH Móvil
    window.ATHM_Checkout = {
      env: 'production',
      publicToken: 'a66ce73d04f2087615f6320b724defc5b4eedc55', // Demo token - replace with real one
      timeout: 600,
      orderType: '',
      theme: 'btn',
      lang: 'en',
      total: selectedService.price / 100, // Convert cents to dollars
      subtotal: selectedService.price / 100,
      tax: 0,
      metadata1: `Service: ${selectedService.name}`,
      metadata2: `Booking: ${bookingData?.date} ${bookingData?.time}`,
      items: [
        {
          name: selectedService.name,
          description: selectedService.description,
          quantity: "1",
          price: (selectedService.price / 100).toString(),
          tax: "0",
          metadata: `Duration: ${selectedService.duration} minutes`
        }
      ],
      phoneNumber: ""
    };

    // Define callback functions
    window.authorizationATHM = async () => {
      const responseAuth = await window.authorization();
      console.log('ATH Móvil Authorization:', responseAuth);
      if (responseAuth.status === 'success') {
        handlePaymentSuccess('athmovil', responseAuth.data);
      }
    };

    window.cancelATHM = async () => {
      const responseCancel = await window.findPaymentATHM();
      console.log('ATH Móvil Cancel:', responseCancel);
      alert('Payment was cancelled');
    };

    window.expiredATHM = async () => {
      const responseExpired = await window.findPaymentATHM();
      console.log('ATH Móvil Expired:', responseExpired);
      alert('Payment expired. Please try again.');
    };
  };

  const formatCurrency = (cents: number) => {
    if (cents === 0) return t('booking.free');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleStripePayment = async () => {
    setIsLoading(true);
    // Simulate Stripe integration
    setTimeout(() => {
      handlePaymentSuccess('stripe', {
        paymentIntentId: 'pi_demo_' + Date.now(),
        amount: selectedService?.price || 0,
        currency: 'usd'
      });
      setIsLoading(false);
    }, 2000);
  };

  const handlePaymentSuccess = (method: string, paymentData: any) => {
    // Store successful payment data
    const appointmentData = {
      ...bookingData,
      serviceDetails: selectedService,
      paymentMethod: method,
      paymentData: paymentData,
      status: 'confirmed',
      appointmentId: 'APT-' + Date.now()
    };

    localStorage.setItem("completed_appointment", JSON.stringify(appointmentData));
    localStorage.removeItem("booking_intent");
    
    // Redirect to success page
    window.location.href = "/payment/success";
  };

  if (!bookingData || !selectedService) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/book" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="text-sm md:text-base">Back to Booking</span>
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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Complete Your Payment</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Summary */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Appointment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service:</span>
                      <span className="text-white font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">
                        {new Date(bookingData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{selectedService.duration} minutes</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between">
                      <span className="text-gray-400 font-medium">Total:</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(selectedService.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              {selectedService.price > 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Choose Payment Method</CardTitle>
                    <CardDescription>Select how you'd like to pay for your appointment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stripe Payment */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'stripe' 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-blue-400" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">Credit/Debit Card</h3>
                          <p className="text-sm text-gray-400">Pay securely with Stripe</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img src="/api/placeholder/30/20" alt="Visa" className="h-5" />
                          <img src="/api/placeholder/30/20" alt="Mastercard" className="h-5" />
                          <img src="/api/placeholder/30/20" alt="American Express" className="h-5" />
                        </div>
                      </div>
                    </div>

                    {/* ATH Móvil Payment */}
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'athmovil' 
                          ? 'border-orange-500 bg-orange-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setPaymentMethod('athmovil')}
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-orange-400" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">ATH Móvil</h3>
                          <p className="text-sm text-gray-400">Pay with your ATH Móvil app</p>
                        </div>
                        <div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium">
                          ATH
                        </div>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="mt-6">
                      {paymentMethod === 'stripe' && (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          size="lg"
                          onClick={handleStripePayment}
                          disabled={isLoading}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {isLoading ? 'Processing...' : `Pay ${formatCurrency(selectedService.price)} with Card`}
                        </Button>
                      )}

                      {paymentMethod === 'athmovil' && athMovilLoaded && (
                        <div>
                          <div id="ATHMovil_Checkout_Button_payment"></div>
                          <Button 
                            className="w-full bg-orange-600 hover:bg-orange-700 mt-4" 
                            size="lg"
                            onClick={() => {
                              // ATH Móvil button should be automatically rendered
                              const athButton = document.querySelector('#ATHMovil_Checkout_Button_payment button');
                              if (athButton) {
                                (athButton as HTMLElement).click();
                              }
                            }}
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Pay {formatCurrency(selectedService.price)} with ATH Móvil
                          </Button>
                        </div>
                      )}

                      {!paymentMethod && (
                        <Button className="w-full" size="lg" disabled>
                          Select a payment method
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Free service - no payment required
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="text-center py-8">
                    <div className="mb-4">
                      <div className="bg-green-900/20 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                        <Shield className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Payment Required</h3>
                    <p className="text-gray-400 mb-6">
                      This is a complimentary service. Click below to confirm your appointment.
                    </p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      size="lg"
                      onClick={() => handlePaymentSuccess('free', { amount: 0 })}
                    >
                      Confirm Free Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Security & Support */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Secure Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">Bank-level Security</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-300">
                    <p>If you encounter any issues with payment, please contact us:</p>
                    <div className="space-y-1">
                      <p>📞 (787) 404-6909</p>
                      <p>✉️ restartquiro@gmail.com</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                      Our team is available during business hours to assist you.
                    </p>
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