import { CheckCircle, Mail, BookOpen, Bell, ArrowRight, Music, ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { useSettings } from '../contexts/SettingsContext';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

interface SuccessMessageProps {
  email: string;
  wantsTutorialBook: boolean;
}

export default function SuccessMessage({ email, wantsTutorialBook }: SuccessMessageProps) {
  const { content } = useContent();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Social media platforms to show
  const socialPlatforms = [
    { name: 'Facebook', url: settings.socialMedia.facebook, icon: 'facebook' },
    { name: 'Twitter', url: settings.socialMedia.twitter, icon: 'twitter' },
    { name: 'Instagram', url: settings.socialMedia.instagram, icon: 'instagram' },
    { name: 'LinkedIn', url: settings.socialMedia.linkedin, icon: 'linkedin' },
    { name: 'YouTube', url: settings.socialMedia.youtube, icon: 'youtube' },
    { name: 'TikTok', url: settings.socialMedia.tiktok, icon: 'tiktok' },
  ];

  // Helper to render Lucide icon
  const renderIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter': return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'linkedin': return <Linkedin className="h-5 w-5 text-blue-700" />;
      case 'youtube': return <Youtube className="h-5 w-5 text-red-600" />;
      case 'tiktok': return <span className="h-5 w-5 text-black font-bold">Tt</span>; // fallback
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-green-500 rounded-full p-6">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Main Success Message */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
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
              {/* Hide site name if logo is present */}
              {!settings.logoUrl && (
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {content.successTitle}
                </h1>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.successSubtitle}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {content.successDescription}
              </p>
              <p className="text-gray-600">
                We've sent a confirmation to <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>

            {/* Next Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{content.emailCardTitle}</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {content.emailCardDescription}
                </p>
              </div>

              {wantsTutorialBook && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-6 w-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{content.tutorialCardTitle}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {content.tutorialCardDescription}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-6 w-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{content.stayTunedCardTitle}</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {content.stayTunedCardDescription}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowRight className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{content.earlyAccessCardTitle}</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {content.earlyAccessCardDescription}
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{content.whatsNextTitle}</h3>
              <div className="space-y-3 text-left">
                {content.whatsNextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {content.socialProofText} <span className="font-bold text-gray-900">{content.socialProofCount}</span> creators, artists, and entrepreneurs
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                {content.socialProofCategories.map((category, index) => (
                  <span key={index} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {content.socialMediaHeading || 'Like Our Social Media Accounts'}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {socialPlatforms.map((platform) =>
                  platform.url ? (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm transition"
                    >
                      {renderIcon(platform.icon)}
                      <span>{platform.name}</span>
                    </a>
                  ) : null
                )}
              </div>
            </div>

            {/* Finish Button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Finish
            </button>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {content.footerContactText}{' '}
              <a href={`mailto:${content.footerContactEmail}`} className="text-orange-400 hover:text-orange-300 underline">
                {content.footerContactEmail}
              </a>
            </p>
            <p className="text-xs text-gray-500">
              {content.footerPrivacyText}
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      {settings.footerSettings.showFooter && <Footer />}
    </div>
  );
}