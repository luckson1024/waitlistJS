import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider } from './contexts/ContentContext';
import { SettingsProvider } from './contexts/SettingsContext';
import EmailCapture from './components/EmailCapture';
import WaitlistForm from './components/WaitlistForm';
import SuccessMessage from './components/SuccessMessage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { WaitlistFormData, FormStep } from './types/waitlist';

function WaitlistFlow() {
  const [currentStep, setCurrentStep] = useState<FormStep>('email');
  const [formData, setFormData] = useState<Partial<WaitlistFormData>>({});

  const handleEmailSubmit = (email: string) => {
    setFormData({ ...formData, email });
    setCurrentStep('details');
  };

  const handleFormSubmit = (data: WaitlistFormData) => {
    setFormData(data);
    // Store in localStorage for demo purposes
    const existingData = JSON.parse(localStorage.getItem('waitlistData') || '[]');
    existingData.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('waitlistData', JSON.stringify(existingData));
    setCurrentStep('success');
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
  };

  return (
    <>
      {currentStep === 'email' && (
        <EmailCapture onEmailSubmit={handleEmailSubmit} />
      )}
      {currentStep === 'details' && (
        <WaitlistForm 
          initialEmail={formData.email || ''}
          onFormSubmit={handleFormSubmit}
          onBack={handleBackToEmail}
        />
      )}
      {currentStep === 'success' && (
        <SuccessMessage 
          email={formData.email || ''}
          wantsTutorialBook={formData.wantsTutorialBook || false}
        />
      )}
    </>
  );
}

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );

  const handleAdminLogin = (success: boolean) => {
    setIsAdminAuthenticated(success);
    if (success) {
      localStorage.setItem('adminAuth', 'true');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <SettingsProvider>
      <ContentProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WaitlistFlow />} />
            <Route path="/waitlist" element={<WaitlistFlow />} />
            <Route 
              path="/admin" 
              element={
                isAdminAuthenticated ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                isAdminAuthenticated ? (
                  <AdminDashboard onLogout={handleAdminLogout} />
                ) : (
                  <Navigate to="/admin" replace />
                )
              } 
            />
          </Routes>
        </Router>
      </ContentProvider>
    </SettingsProvider>
  );
}

export default App;