"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, DollarSign, Heart, CheckCircle } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

const services = [
  {
    id: "discovery-call",
    name: "Discovery Call",
    duration: 15,
    price: 0,
    description: "Free consultation to discuss your needs and explore treatment options.",
    benefits: [
      "No-cost initial consultation",
      "Understanding your pain points",
      "Treatment option overview",
      "Personalized care planning"
    ],
    image: "/services/discovery.jpg"
  },
  {
    id: "initial-evaluation",
    name: "Initial Evaluation & Consultation",
    duration: 75,
    price: 15000,
    description: "Comprehensive assessment with detailed examination and treatment planning.",
    benefits: [
      "Thorough health evaluation",
      "Comprehensive physical examination",
      "Personalized treatment strategy",
      "Clear diagnosis and prognosis"
    ],
    image: "/services/evaluation.jpg"
  },
  {
    id: "chiropractic-visit",
    name: "Chiropractic Visit",
    duration: 15,
    price: 5500,
    description: "Focused chiropractic adjustment and manual therapy session.",
    benefits: [
      "Spinal alignment correction",
      "Pain relief and mobility",
      "Nervous system optimization",
      "Quick and effective treatment"
    ],
    image: "/services/chiropractic.jpg"
  },
  {
    id: "recovery-visit",
    name: "Recovery Visit",
    duration: 30,
    price: 8000,
    description: "Therapeutic recovery session using advanced manual therapy techniques.",
    benefits: [
      "Accelerated healing process",
      "Advanced therapy techniques",
      "Muscle tension relief",
      "Improved range of motion"
    ],
    image: "/services/recovery.jpg"
  },
  {
    id: "relief-movement",
    name: "Restart Relief and Movement Visit",
    duration: 60,
    price: 12000,
    description: "Comprehensive rehabilitation session combining therapy and movement exercises.",
    benefits: [
      "Pain relief and management",
      "Movement pattern correction",
      "Therapeutic exercises",
      "Long-term recovery focus"
    ],
    image: "/services/relief.jpg"
  },
  {
    id: "medical-plan",
    name: "Medical Plan Initial Evaluation",
    duration: 45,
    price: 10000,
    description: "Medical evaluation designed for insurance-based treatment plans.",
    benefits: [
      "Insurance compatibility",
      "Medical documentation",
      "Treatment authorization",
      "Professional evaluation"
    ],
    image: "/services/medical.jpg"
  },
];

const formatCurrency = (cents: number) => {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

export default function ServicesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
              <span className="text-lg md:text-xl font-bold text-white">Restart</span>
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{t('services.title')}</h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            {t('services.description')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 md:gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden bg-gray-900 border-gray-800">
              <div className="md:flex">
                {/* Service Image Placeholder */}
                <div className="md:w-1/3 bg-gradient-to-br from-gray-800 to-gray-700 h-48 md:h-auto flex items-center justify-center">
                  <div className="text-gray-500 text-4xl md:text-6xl font-bold opacity-20">
                    {service.name.charAt(0)}
                  </div>
                </div>
                
                {/* Service Content */}
                <div className="md:w-2/3 p-4 md:p-6">
                  <CardHeader className="p-0 pb-3 md:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-2xl text-white mb-2">{service.name}</CardTitle>
                        <CardDescription className="text-sm md:text-lg text-gray-300">{service.description}</CardDescription>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xl md:text-2xl font-bold text-gray-300">{formatCurrency(service.price)}</div>
                        <div className="flex items-center text-gray-400 text-xs md:text-sm">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          {service.duration} minutes
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold text-white mb-2 md:mb-3 text-sm md:text-base">{t('services.benefitsInclude')}</h4>
                      <div className="grid gap-1 md:gap-2">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-gray-300">
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-xs md:text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                      <Button asChild className="flex-1 text-xs md:text-sm">
                        <Link href="/book">{t('services.bookThisService')}</Link>
                      </Button>
                      <Button variant="outline" className="flex-1 text-xs md:text-sm">
                        {t('services.learnMore')}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 md:mt-16 bg-gray-800 text-white rounded-lg md:rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-3xl font-bold mb-4">{t('services.notSureTitle')}</h2>
          <p className="text-base md:text-xl mb-6 text-gray-300 max-w-2xl mx-auto px-4">
            {t('services.notSureDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm md:text-base" asChild>
              <Link href="/book">{t('services.bookConsultation')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm md:text-base bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
              {t('services.contactUs')}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}