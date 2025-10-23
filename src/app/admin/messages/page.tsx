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
  User,
  Clock,
  Reply,
  Mail,
  MailOpen
} from "lucide-react";
import { useAuth, getAuthHeaders } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  messageType: string;
  fromUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  toUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminMessages() {
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState({
    toUserId: "",
    subject: "",
    content: ""
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push("/admin");
      return;
    }

    if (isAuthenticated && user?.role === 'ADMIN' && token) {
      loadData();
    }
  }, [isAuthenticated, user, token, isLoading, router]);

  const loadData = async () => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      
      // Load messages
      const messagesResponse = await fetch('/api/messages', { headers });
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages || []);
      }

      // Load patients for compose
      const patientsResponse = await fetch('/api/admin/patients', { headers });
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData.patients || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load messages');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!token || !newMessage.toUserId || !newMessage.subject || !newMessage.content) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const headers = getAuthHeaders(token);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        setNewMessage({ toUserId: "", subject: "", content: "" });
        setShowCompose(false);
        loadData(); // Reload messages
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleReply = (message: Message) => {
    setNewMessage({
      toUserId: message.fromUser.id,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
      content: `\n\n--- Original Message ---\nFrom: ${message.fromUser.firstName} ${message.fromUser.lastName}\nDate: ${new Date(message.createdAt).toLocaleString()}\nSubject: ${message.subject}\n\n${message.content}`
    });
    setShowCompose(true);
    setSelectedMessage(null);
  };

  if (isLoading || dataLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <Heart className="h-6 w-6 text-gray-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Messages</h1>
                <p className="text-sm text-gray-400">Communicate with your patients</p>
              </div>
            </div>
            <Button onClick={() => setShowCompose(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-md mb-6">
            {error}
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Inbox</CardTitle>
                <CardDescription className="text-gray-400">
                  {messages.filter(m => !m.isRead).length} unread messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No messages</p>
                  ) : (
                    messages.map((message) => (
                      <div 
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.isRead) markAsRead(message.id);
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id 
                            ? 'bg-gray-700' 
                            : 'bg-gray-800 hover:bg-gray-750'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            {message.isRead ? (
                              <MailOpen className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Mail className="h-4 w-4 text-blue-400" />
                            )}
                            <p className={`text-sm ${message.isRead ? 'text-gray-300' : 'text-white font-medium'}`}>
                              {message.fromUser.firstName} {message.fromUser.lastName}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${message.isRead ? 'text-gray-400' : 'text-gray-300 font-medium'}`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.content.substring(0, 50)}...
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message View/Compose */}
          <div className="lg:col-span-2">
            {showCompose ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Compose Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                      <select
                        value={newMessage.toUserId}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, toUserId: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select a patient...</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} ({patient.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <input
                        type="text"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Message subject..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <textarea
                        value={newMessage.content}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Type your message..."
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" onClick={() => setShowCompose(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedMessage.subject}</CardTitle>
                      <CardDescription className="text-gray-400">
                        From: {selectedMessage.fromUser.firstName} {selectedMessage.fromUser.lastName} ({selectedMessage.fromUser.email})
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => handleReply(selectedMessage)}>
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a message to view</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}