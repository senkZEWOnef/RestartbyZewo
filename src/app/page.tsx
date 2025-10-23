"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Heart, Shield, Star, Users, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Available time slots
  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", 
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        date,
        dateString,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isWeekend,
        isAvailable: isCurrentMonth && !isPast && !isWeekend
      });
    }
    
    return days;
  };

  const handleDateSelect = (dateString: string, isAvailable: boolean) => {
    if (isAvailable) {
      setSelectedDate(dateString);
      setSelectedTime(""); // Reset selected time when date changes
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      // Store the selected date and time, then redirect to booking
      localStorage.setItem("homepage_booking", JSON.stringify({
        date: selectedDate,
        time: selectedTime
      }));
      window.location.href = "/book";
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthNamesEs = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayNamesEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const { language } = useLanguage();
  const currentMonthNames = language === 'es' ? monthNamesEs : monthNames;
  const currentWeekdayNames = language === 'es' ? weekdayNamesEs : weekdayNames;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 md:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
            <span className="text-xl md:text-2xl font-bold text-white">Restart</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-gray-300 hover:text-white transition-colors">{t('navigation.services')}</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">{t('navigation.contact')}</Link>
            <LanguageToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">{t('navigation.signIn')}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/book">{t('navigation.book')}</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-3">
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-900 rounded-lg p-4 space-y-3">
            <Link 
              href="/services" 
              className="block text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.services')}
            </Link>
            <Link 
              href="/contact" 
              className="block text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.contact')}
            </Link>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>{t('navigation.signIn')}</Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>{t('navigation.book')}</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
          {t('home.title')}
          <br />
          <span className="text-gray-300">{t('home.subtitle')}</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          {t('home.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/book">{t('home.bookAppointment')}</Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/services">{t('home.viewServices')}</Link>
          </Button>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gray-900 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">{t('home.ourServices')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Discovery Call", duration: "15 min" },
              { name: "Initial Evaluation", duration: "75 min" },
              { name: "Chiropractic Visit", duration: "15 min" },
              { name: "Recovery Visit", duration: "30 min" },
              { name: "Relief & Movement", duration: "60+ min" },
              { name: "Medical Plan Initial", duration: "varies" },
            ].map((service) => (
              <Card key={service.name} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg text-white">{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    {service.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-center">
                    <Button size="sm" className="text-xs md:text-sm" asChild>
                      <Link href="/book">{t('navigation.book')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="bg-gray-900 border-gray-800 text-center sm:col-span-1 md:col-span-1">
            <CardHeader className="pb-4">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
              <CardTitle className="text-white text-lg md:text-xl">{t('home.easyBooking')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-300 text-sm md:text-base">
                {t('home.easyBookingDesc')}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 text-center sm:col-span-1 md:col-span-1">
            <CardHeader className="pb-4">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
              <CardTitle className="text-white text-lg md:text-xl">{t('home.expertCare')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-300 text-sm md:text-base">
                {t('home.expertCareDesc')}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 text-center sm:col-span-2 md:col-span-1">
            <CardHeader className="pb-4">
              <Shield className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
              <CardTitle className="text-white text-lg md:text-xl">{t('home.safeSecure')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-300 text-sm md:text-base">
                {t('home.safeSecureDesc')}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Calendar */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('home.bookingCalendar')}</h2>
            <p className="text-lg text-gray-300">{t('home.bookingCalendarDesc')}</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{t('home.selectDate')}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevMonth}
                      className="p-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white font-medium min-w-[120px] text-center">
                      {currentMonthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextMonth}
                      className="p-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {currentWeekdayNames.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day.dateString, day.isAvailable)}
                      disabled={!day.isAvailable}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-md transition-colors
                        ${!day.isCurrentMonth 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : day.isPast 
                          ? 'text-gray-600 cursor-not-allowed'
                          : day.isWeekend
                          ? 'text-gray-500 cursor-not-allowed'
                          : day.isToday
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : selectedDate === day.dateString
                          ? 'bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 text-xs text-gray-400 text-center">
                  <p>• Weekends are not available</p>
                  <p>• Select a weekday to see available times</p>
                </div>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{t('home.availableSlots')}</CardTitle>
                <CardDescription>
                  {selectedDate 
                    ? `Available times for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric'
                      })}`
                    : 'Select a date to see available times'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`
                            p-3 text-sm border rounded-md transition-colors
                            ${selectedTime === time
                              ? 'border-gray-500 bg-gray-700 text-white'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    
                    {selectedTime && (
                      <div className="border-t border-gray-700 pt-4">
                        <div className="bg-gray-800 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-white mb-2">Selected Appointment</h4>
                          <p className="text-gray-300 text-sm">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} at {selectedTime}
                          </p>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleBookAppointment}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {t('home.bookThisSlot')}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">{t('home.selectTimeFirst')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">{t('home.testimonialsTitle')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              nameKey: "testimonial1Name",
              textKey: "testimonial1Text",
              rating: 5
            },
            {
              nameKey: "testimonial2Name",
              textKey: "testimonial2Text",
              rating: 5
            },
            {
              nameKey: "testimonial3Name",
              textKey: "testimonial3Text",
              rating: 5
            }
          ].map((testimonial) => (
            <Card key={testimonial.nameKey} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 md:p-6">
                <div className="flex mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">"{t(`home.${testimonial.textKey}`)}"</p>
                <p className="font-semibold text-white text-sm md:text-base">— {t(`home.${testimonial.nameKey}`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('home.ctaTitle')}</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto px-4">
            {t('home.ctaDescription')}
          </p>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/book">{t('home.ctaButton')}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                <span className="text-lg md:text-xl font-bold">Restart</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                {t('home.trustedPartner')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerServices')}</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li>{t('home.footerServicesDiscovery')}</li>
                <li>{t('home.footerServicesChiropractic')}</li>
                <li>{t('home.footerServicesRecovery')}</li>
                <li>{t('home.footerServicesRehabilitation')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerCompany')}</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li><Link href="/contact" className="hover:text-white transition-colors">{t('home.footerContact')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t('home.footerPrivacyPolicy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">{t('home.footerTermsOfService')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerContactTitle')}</h3>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
                <li>1413 Ave Manuel Fernandez Juncos</li>
                <li>Suite 3G, San Juan, PR</li>
                <li>(787) 404-6909</li>
                <li>restartquiro@gmail.com</li>
                <li className="text-xs text-gray-500 mt-2">{t('home.footerHours')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
            <p className="text-xs md:text-sm">{t('home.footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
