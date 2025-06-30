import React, { useState } from 'react';
import { Music, ShoppingBag, ArrowRight, Mail } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { useContent } from '../contexts/ContentContext';
import { useSettings } from '../contexts/SettingsContext';
import Footer from './Footer';
import { captureEmail } from '../services/waitlistService';

interface EmailCaptureProps {
  onEmailSubmit: (email: string) => void;
}

export default function EmailCapture({ onEmailSubmit }: EmailCaptureProps) {
  const { content } = useContent();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await captureEmail(email);
      if (response.success) {
        onEmailSubmit(email);
      } else {
        setError(response.error?.message || 'An unexpected error occurred.');
      }
    } catch {
      setError('Failed to submit email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-8" />
                  ) : (
                    <>
                      <Music className="h-8 w-8 text-orange-500" />
                      <ShoppingBag className="h-6 w-6 text-orange-400 absolute -bottom-1 -right-1" />
                    </>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">{settings.siteName}</h1>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight whitespace-pre-line">
                  {content.heroTitle}
                </h2>
                
                <p className="text-xl text-gray-300 whitespace-pre-line">
                  {content.heroSubtitle}
                  <br />
                  {content.heroDescription}
                </p>
              </div>

              <button
                onClick={() => document.getElementById('email-input')?.focus()}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {content.heroButtonText}
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="space-y-3 text-gray-300">
                {content.heroFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Email Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {content.emailFormTitle}
              </h3>
              <p className="text-gray-600">
                {content.emailFormDescription}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {content.emailInputLabel}
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={content.emailInputPlaceholder}
                  className={`w-full px-4 py-3 text-lg rounded-lg border-2 transition-all duration-200 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none ${
                    error 
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="mt-2 text-red-500 text-sm font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {content.emailSubmitButtonText}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {content.emailFormFooterText}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      {settings.footerSettings.showFooter && <Footer />}
    </div>
  );
}