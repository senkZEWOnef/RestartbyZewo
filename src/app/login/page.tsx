"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Eye, EyeOff } from "lucide-react";
import { useLanguage, LanguageToggle } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login process
    setTimeout(() => {
      if (email && password) {
        // Store basic patient info in localStorage for demo
        localStorage.setItem("patient_auth", JSON.stringify({
          id: "patient_" + Date.now(),
          email: email,
          firstName: "Demo",
          lastName: "Patient",
          phone: "(787) 000-0000",
          loginTime: new Date().toISOString()
        }));
        
        // Check if user was booking before login
        const bookingIntent = localStorage.getItem("booking_intent");
        if (bookingIntent) {
          // Don't remove booking intent - let payment page handle it
          window.location.href = "/payment";
        } else {
          // Redirect to patient dashboard
          window.location.href = "/patient/dashboard";
        }
      } else {
        setError("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1000);
  };

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

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-white">{t('auth.welcomeBack')}</CardTitle>
              <CardDescription className="text-gray-300">
                {t('auth.signInToAccount')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-600 rounded bg-gray-800"
                    />
                    <span className="ml-2 text-sm text-gray-300">{t('auth.rememberMe')}</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  {t('auth.noAccount')}{' '}
                  <Link
                    href="/signup"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {t('auth.signUp')}
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-gray-400">Email: patient@restart.com</p>
                  <p className="text-xs text-gray-400">Password: demo123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}