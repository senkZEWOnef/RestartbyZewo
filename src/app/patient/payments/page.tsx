"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Heart, 
  ArrowLeft,
  Download,
  DollarSign,
  Calendar,
  Receipt,
  AlertCircle
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

export default function PatientPayments() {
  const { t } = useLanguage();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState<'bills' | 'history'>('bills');
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

  const outstandingBills = [
    {
      id: "INV-2024-001",
      service: "Recovery Visit",
      date: "2024-01-22",
      amount: 8000, // in cents
      dueDate: "2024-02-05",
      status: "pending",
      description: "Therapeutic recovery session with advanced techniques"
    },
    {
      id: "INV-2024-002",
      service: "Chiropractic Visit",
      date: "2024-01-15",
      amount: 5500, // in cents
      dueDate: "2024-01-29",
      status: "overdue",
      description: "Focused chiropractic adjustment and manual therapy"
    }
  ];

  const paymentHistory = [
    {
      id: "PAY-2024-001",
      service: "Initial Evaluation & Consultation",
      date: "2024-01-08",
      amount: 15000, // in cents
      paymentDate: "2024-01-10",
      method: "Credit Card",
      status: "paid",
      receiptId: "REC-001"
    },
    {
      id: "PAY-2024-002",
      service: "Discovery Call",
      date: "2024-01-01",
      amount: 0, // free
      paymentDate: "2024-01-01",
      method: "N/A",
      status: "paid",
      receiptId: "REC-002"
    }
  ];

  const formatCurrency = (cents: number) => {
    if (cents === 0) return t('booking.free');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handlePayBill = (billId: string) => {
    // In a real app, this would integrate with Stripe
    alert(`Payment integration coming soon! This would process payment for ${billId}`);
  };

  const handleDownloadReceipt = (receiptId: string) => {
    // In a real app, this would download the actual receipt
    alert(`Receipt download coming soon! Receipt ID: ${receiptId}`);
  };

  const totalOutstanding = outstandingBills.reduce((sum, bill) => sum + bill.amount, 0);

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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('patient.payments')}</h1>
            <p className="text-gray-300">Manage your bills and view payment history</p>
          </div>

          {/* Outstanding Balance Card */}
          {totalOutstanding > 0 && (
            <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-800 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Outstanding Balance</h3>
                      <p className="text-red-200">You have unpaid bills that require attention</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(totalOutstanding)}</p>
                    <p className="text-sm text-red-200">Total Due</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('bills')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'bills'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('patient.outstandingBills')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('patient.paymentHistory')}
            </button>
          </div>

          {/* Outstanding Bills Tab */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              {outstandingBills.length > 0 ? (
                outstandingBills.map((bill) => (
                  <Card key={bill.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {bill.service}
                              </h3>
                              <p className="text-gray-300 text-sm mb-2">{bill.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Service Date: {new Date(bill.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white mb-1">
                                {formatCurrency(bill.amount)}
                              </p>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                bill.status === 'overdue' 
                                  ? 'bg-red-900 text-red-200' 
                                  : 'bg-yellow-900 text-yellow-200'
                              }`}>
                                {bill.status === 'overdue' ? 'Overdue' : 'Due'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={() => handlePayBill(bill.id)}
                              className="bg-green-700 hover:bg-green-600"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              {t('patient.payBill')}
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Outstanding Bills
                    </h3>
                    <p className="text-gray-400">
                      You're all caught up! No payments are currently due.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <Card key={payment.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {payment.service}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Service: {new Date(payment.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Paid: {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                                <span>
                                  Method: {payment.method}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white mb-1">
                                {formatCurrency(payment.amount)}
                              </p>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                                Paid
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReceipt(payment.receiptId)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t('patient.downloadReceipt')}
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Payment History
                    </h3>
                    <p className="text-gray-400">
                      Your payment history will appear here once you make your first payment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}