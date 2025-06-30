import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Phone, Building, MapPin, Globe, BookOpen, Store } from 'lucide-react';
import { WaitlistFormData, FormErrors } from '../types/waitlist';
import { validateWaitlistForm } from '../utils/validation';
import { businessTypes } from '../data/countries';
import { allCountries } from '../data/allCountries';
import { useContent } from '../contexts/ContentContext';
import { useSettings } from '../contexts/SettingsContext';
import Footer from './Footer';
import { updateWaitlistEntry } from '../services/waitlistService';

interface WaitlistFormProps {
  initialEmail: string;
  onFormSubmit: (data: WaitlistFormData) => void;
  onBack: () => void;
}

export default function WaitlistForm({ initialEmail, onFormSubmit, onBack }: WaitlistFormProps) {
  const { content } = useContent();
  const { settings } = useSettings();
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: initialEmail,
    fullName: '',
    phoneNumber: '',
    typeOfBusiness: '',
    customBusinessTypes: '',
    country: '',
    customCountry: '',
    city: '',
    hasRunStoreBefore: false,
    wantsTutorialBook: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof WaitlistFormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateWaitlistForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateWaitlistEntry(formData.email, formData);
      if (response.success) {
        onFormSubmit(formData);
      } else {
        setErrors({ form: response.error?.message || 'An unexpected error occurred.' });
      }
    } catch {
      setErrors({ form: 'Failed to submit form. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {content.waitlistFormTitle}
            </h1>
            <p className="text-lg text-gray-300">
              {content.waitlistFormDescription}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="ml-2 text-sm text-green-400 font-medium">Email</span>
              </div>
              <div className="w-16 h-1 bg-orange-600 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="ml-2 text-sm text-white font-medium">Details</span>
              </div>
              <div className="w-16 h-1 bg-gray-600 rounded"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-bold">3</span>
                </div>
                <span className="ml-2 text-sm text-gray-400 font-medium">Success</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  {content.personalInfoTitle}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                        errors.fullName 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                      }`}
                      placeholder="Full Name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                          errors.phoneNumber 
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                        }`}
                        placeholder="Phone Number"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-red-500 text-sm">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-500" />
                  {content.businessInfoTitle}
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.businessTypeLabel}
                    </label>
                    <select
                      value={formData.typeOfBusiness}
                      onChange={(e) => handleInputChange('typeOfBusiness', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                        errors.typeOfBusiness 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                      }`}
                    >
                      <option value="">Select your business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.typeOfBusiness && (
                      <p className="mt-1 text-red-500 text-sm">{errors.typeOfBusiness}</p>
                    )}
                  </div>

                  {formData.typeOfBusiness === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Please specify your business type *
                      </label>
                      <input
                        type="text"
                        value={formData.customBusinessTypes}
                        onChange={(e) => handleInputChange('customBusinessTypes', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                          errors.customBusinessTypes 
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                        }`}
                        placeholder="e.g., Photography, Consulting, etc."
                      />
                      {errors.customBusinessTypes && (
                        <p className="mt-1 text-red-500 text-sm">{errors.customBusinessTypes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  {content.locationTitle}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.countryLabel}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                          errors.country 
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                            : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                        }`}
                      >
                        <option value="">Select your country</option>
                        {allCountries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    {formData.country === 'Other' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={formData.customCountry || ''}
                          onChange={(e) => handleInputChange('customCountry', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                            errors.customCountry 
                              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                              : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                          }`}
                          placeholder="Please specify your country"
                        />
                        {errors.customCountry && (
                          <p className="mt-1 text-red-500 text-sm">{errors.customCountry}</p>
                        )}
                      </div>
                    )}
                    {errors.country && (
                      <p className="mt-1 text-red-500 text-sm">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.cityLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 bg-gray-50 text-gray-900 focus:outline-none ${
                        errors.city 
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20'
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {content.preferencesTitle}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="hasRunStore"
                      checked={formData.hasRunStoreBefore}
                      onChange={(e) => handleInputChange('hasRunStoreBefore', e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <label htmlFor="hasRunStore" className="flex items-center gap-2 text-gray-900 font-medium cursor-pointer">
                        <Store className="h-4 w-4 text-orange-500" />
                        {content.storeExperienceLabel}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        {content.storeExperienceDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="wantsTutorial"
                      checked={formData.wantsTutorialBook}
                      onChange={(e) => handleInputChange('wantsTutorialBook', e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <label htmlFor="wantsTutorial" className="flex items-center gap-2 text-gray-900 font-medium cursor-pointer">
                        <BookOpen className="h-4 w-4 text-orange-500" />
                        {content.tutorialBookLabel}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        {content.tutorialBookDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {content.backButtonText}
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {content.submitButtonText}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Your information is secure and will only be used to improve your Myzuwa experience.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      {settings.footerSettings.showFooter && <Footer />}
    </div>
  );
}