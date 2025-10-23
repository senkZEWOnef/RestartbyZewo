"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  Send,
  ArrowLeft,
  Instagram,
  Facebook
} from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

// TikTok Icon Component (since it's not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.4-1.958-1.4-3.338h-2.925v13.917c0 2.551-2.077 4.629-4.628 4.629-2.55 0-4.628-2.078-4.628-4.629s2.077-4.628 4.628-4.628c.48 0 .942.073 1.377.207v-2.98c-.435-.058-.879-.088-1.33-.088C4.174 7.428 0 11.602 0 16.783S4.174 26.139 9.355 26.139s9.355-4.174 9.355-9.355V9.368c1.425 1.026 3.17 1.632 5.072 1.632v-2.925c-1.902 0-3.647-.606-5.072-1.632v-.881z"/>
  </svg>
);

export default function ContactPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitMessage("¡Mensaje enviado exitosamente! Te contactaremos pronto. / Message sent successfully! We'll contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitMessage("Error enviando el mensaje. Intenta de nuevo. / Error sending message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage("Error enviando el mensaje. Intenta de nuevo. / Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-xl">{t('contact.info.title')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('contact.info.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.address.title')}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Carr. 693 Km 1.7 Bo. Canovanillas<br />
                      Carolina, PR 00987<br />
                      Puerto Rico
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.phone.title')}</h3>
                    <a 
                      href="tel:+17874046909" 
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      (787) 404-6909
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.email.title')}</h3>
                    <a 
                      href="mailto:info@restartquiro.com" 
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      info@restartquiro.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.hours.title')}</h3>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>{t('contact.hours.weekdays')}: 8:00 AM - 7:00 PM</p>
                      <p>{t('contact.hours.weekends')}: {t('contact.hours.closed')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-xl">{t('contact.social.title')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('contact.social.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/restartquiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <Instagram className="h-6 w-6 text-gray-400 group-hover:text-white" />
                  </a>
                  <a
                    href="https://facebook.com/restartquiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <Facebook className="h-6 w-6 text-gray-400 group-hover:text-white" />
                  </a>
                  <a
                    href="https://tiktok.com/@restartquiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <TikTokIcon className="h-6 w-6 text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="pt-6">
                <p className="text-red-200 text-sm">
                  <strong>{t('contact.emergency.title')}:</strong> {t('contact.emergency.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-xl">{t('contact.form.title')}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t('contact.form.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="(787) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>

                  {submitMessage && (
                    <div className={`p-3 rounded-md text-sm ${
                      submitMessage.includes('exitosamente') || submitMessage.includes('successfully')
                        ? 'bg-green-900/50 border border-green-700 text-green-200'
                        : 'bg-red-900/50 border border-red-700 text-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      t('contact.form.sending')
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500">
                    * {t('contact.form.required')}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}