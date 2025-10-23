"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Heart, Shield, Star, Users } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
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
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">{t('navigation.about')}</Link>
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
          <div className="flex md:hidden items-center space-x-2">
            <LanguageToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">{t('navigation.signIn')}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/book">{t('navigation.book')}</Link>
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu Links */}
        <div className="md:hidden mt-4 flex justify-center space-x-6">
          <Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t('navigation.services')}</Link>
          <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">{t('navigation.about')}</Link>
          <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">{t('navigation.contact')}</Link>
        </div>
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

      {/* Services Preview */}
      <section className="bg-gray-900 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 md:mb-12">{t('home.ourServices')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Discovery Call", duration: "15 min", price: "Free" },
              { name: "Initial Evaluation", duration: "75 min", price: "Contact" },
              { name: "Chiropractic Visit", duration: "15 min", price: "$55" },
              { name: "Recovery Visit", duration: "30 min", price: "Contact" },
              { name: "Relief & Movement", duration: "60+ min", price: "Contact" },
              { name: "Medical Plan Initial", duration: "varies", price: "Contact" },
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
                  <div className="flex items-center justify-between">
                    <span className="text-xl md:text-2xl font-bold text-gray-300">{service.price}</span>
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
                <li><Link href="/about" className="hover:text-white transition-colors">{t('home.footerAboutUs')}</Link></li>
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
