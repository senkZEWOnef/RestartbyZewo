"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Heart, 
  ArrowLeft,
  Plus,
  Send,
  Search,
  Filter
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

export default function PatientMessages() {
  const { t } = useLanguage();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: ""
  });

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.subject.trim() && newMessage.content.trim()) {
      // In a real app, this would send the message to the server
      alert("Message sent successfully! Dr. Acevedo will respond within 24 hours.");
      setNewMessage({ subject: "", content: "" });
      setShowCompose(false);
    }
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

  const messages = [
    {
      id: "1",
      subject: "Appointment Reminder",
      from: "Restart Team",
      to: "You",
      date: "2024-01-10T10:00:00Z",
      preview: "Your appointment is scheduled for tomorrow at 10:00 AM. Please arrive 15 minutes early.",
      content: `Dear ${patientData.firstName},

This is a friendly reminder that you have an appointment scheduled for tomorrow:

Date: January 15, 2024
Time: 10:00 AM
Service: Chiropractic Visit
Provider: Dr. Gilliany Acevedo, D.C.

Please arrive 15 minutes early to complete any necessary paperwork. If you need to reschedule, please call us at least 24 hours in advance.

Best regards,
The Restart Team`,
      isRead: true,
      type: "system"
    },
    {
      id: "2",
      subject: "New Treatment Plan Available", 
      from: "Dr. Acevedo",
      to: "You",
      date: "2024-01-08T14:30:00Z",
      preview: "Based on your recent evaluation, I've prepared a new treatment plan tailored to your needs.",
      content: `Hello ${patientData.firstName},

Based on your recent evaluation, I've prepared a personalized treatment plan that will help address your specific concerns and goals.

The plan includes:
- Bi-weekly chiropractic adjustments
- Targeted therapeutic exercises
- Movement rehabilitation sessions
- Progress monitoring and adjustments

I believe this approach will provide the best outcomes for your recovery. Please let me know if you have any questions about the plan.

Best regards,
Dr. Gilliany Acevedo, D.C.`,
      isRead: true,
      type: "provider"
    },
    {
      id: "3",
      subject: "Welcome to Restart!",
      from: "Restart Team", 
      to: "You",
      date: "2024-01-01T09:00:00Z",
      preview: "Welcome to your patient portal! Here's everything you need to know to get started.",
      content: `Welcome to Restart, ${patientData.firstName}!

We're excited to be part of your wellness journey. Your patient portal gives you 24/7 access to:

- Schedule and manage appointments
- View your treatment history
- Communicate with your care team
- Access payment information
- Receive important updates

If you have any questions about using the portal, please don't hesitate to reach out.

Welcome aboard!
The Restart Team`,
      isRead: false,
      type: "system"
    }
  ];

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const selectedMessageData = messages.find(m => m.id === selectedMessage);

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
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('patient.messages')}</h1>
              <p className="text-gray-300">Communicate with your care team</p>
            </div>
            <Button onClick={() => setShowCompose(!showCompose)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('patient.newMessage')}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1">
              {/* Search and Filter */}
              <div className="mb-4 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('common.search')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('common.filters')}
                </Button>
              </div>

              {/* Message List */}
              <div className="space-y-2">
                {messages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`bg-gray-900 border-gray-800 cursor-pointer transition-colors hover:bg-gray-800 ${
                      selectedMessage === message.id ? 'ring-2 ring-gray-600' : ''
                    }`}
                    onClick={() => setSelectedMessage(message.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-medium truncate ${
                              message.isRead ? 'text-gray-300' : 'text-white'
                            }`}>
                              {message.subject}
                            </h4>
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            From: {message.from}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {message.preview}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Message Content or Compose */}
            <div className="lg:col-span-2">
              {showCompose ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t('patient.newMessage')}</CardTitle>
                    <CardDescription>Send a message to your care team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          To: Dr. Gilliany Acevedo, D.C.
                        </label>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          {t('patient.messageSubject')}
                        </label>
                        <input
                          id="subject"
                          type="text"
                          value={newMessage.subject}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                          placeholder="Enter subject"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                          {t('patient.messageContent')}
                        </label>
                        <textarea
                          id="content"
                          value={newMessage.content}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                          rows={6}
                          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                          placeholder="Type your message here..."
                          required
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button type="submit">
                          <Send className="h-4 w-4 mr-2" />
                          {t('patient.sendNow')}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCompose(false)}
                        >
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : selectedMessageData ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{selectedMessageData.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedMessageData.from} • To: {selectedMessageData.to}
                        </CardDescription>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(selectedMessageData.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300">
                        {selectedMessageData.content}
                      </div>
                    </div>
                    {selectedMessageData.type === 'provider' && (
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <Button onClick={() => setShowCompose(true)}>
                          {t('patient.sendMessage')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Select a message to read
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Choose a message from the list to view its contents, or compose a new message.
                    </p>
                    <Button onClick={() => setShowCompose(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('patient.newMessage')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}