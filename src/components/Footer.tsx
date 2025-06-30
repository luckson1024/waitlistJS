import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Music, ShoppingBag } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { key: 'facebook', icon: Facebook, url: settings.socialMedia.facebook },
    { key: 'twitter', icon: Twitter, url: settings.socialMedia.twitter },
    { key: 'instagram', icon: Instagram, url: settings.socialMedia.instagram },
    { key: 'linkedin', icon: Linkedin, url: settings.socialMedia.linkedin },
    { key: 'youtube', icon: Youtube, url: settings.socialMedia.youtube },
  ].filter(link => link.url);

  const legalLinks = [
    { label: 'Privacy Policy', url: settings.privacyPolicyUrl },
    { label: 'Terms of Service', url: settings.termsOfServiceUrl },
    { label: 'Cookie Policy', url: settings.cookiePolicyUrl },
  ].filter(link => link.url);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-8" />
              ) : (
                <div className="relative">
                  <Music className="h-8 w-8 text-orange-500" />
                  <ShoppingBag className="h-6 w-6 text-orange-400 absolute -bottom-1 -right-1" />
                </div>
              )}
              <h3 className="text-2xl font-bold">{settings.siteName}</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {settings.siteDescription}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              {settings.supportEmail && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${settings.supportEmail}`} className="hover:text-orange-400 transition-colors">
                    {settings.supportEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Global Platform</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/waitlist" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Join Waitlist
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mb-6">
                {socialLinks.map(({ key, icon: Icon, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-orange-600 p-2 rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}

            {/* Legal Links */}
            {legalLinks.length > 0 && (
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.url} 
                      className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {settings.siteName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Made with ❤️ for creators</span>
              {settings.gdprCompliant && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  GDPR Compliant
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}