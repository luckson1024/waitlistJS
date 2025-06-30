export interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  
  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: string;
  twitterHandle: string;
  
  // Email Settings
  adminEmail: string;
  supportEmail: string;
  notificationEmail: string;
  emailFromName: string;
  
  // Social Media Links
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  
  // Analytics & Tracking
  googleAnalyticsId: string;
  facebookPixelId: string;
  hotjarId: string;
  
  // Waitlist Settings
  waitlistEnabled: boolean;
  maxWaitlistEntries: number;
  requirePhoneNumber: boolean;
  enableTutorialBook: boolean;
  autoEmailConfirmation: boolean;
  
  // Notification Settings
  emailNotifications: {
    newSignup: boolean;
    dailyReport: boolean;
    weeklyReport: boolean;
    exportReminder: boolean;
  };
  
  // Security Settings
  enableCaptcha: boolean;
  rateLimitEnabled: boolean;
  maxAttemptsPerHour: number;
  sessionTimeout: number;
  
  // Appearance Settings
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Feature Flags
  features: {
    adminDashboard: boolean;
    contentEditor: boolean;
    csvExport: boolean;
    realTimeStats: boolean;
    advancedFilters: boolean;
  };
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEndTime: string;
  
  // Legal & Compliance
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  cookiePolicyUrl: string;
  gdprCompliant: boolean;
  dataRetentionDays: number;

  // Footer Settings
  footerSettings: {
    showFooter: boolean;
    companyAddress: string;
    companyPhone: string;
    footerText: string;
    showSocialLinks: boolean;
    showLegalLinks: boolean;
    customLinks: Array<{
      label: string;
      url: string;
      openInNewTab: boolean;
    }>;
  };
}

export const defaultSiteSettings: SiteSettings = {
  // General Settings
  siteName: "MYZUWA",
  siteDescription: "E-commerce meets music. Join the waitlist for exclusive access.",
  siteUrl: "https://myzuwa.com",
  logoUrl: "",
  faviconUrl: "",
  
  // SEO Settings
  metaTitle: "Myzuwa - Join the Waitlist",
  metaDescription: "Join the Myzuwa waitlist - where e-commerce meets music. Be the first to access our revolutionary platform.",
  metaKeywords: ["myzuwa", "e-commerce", "music", "waitlist", "platform"],
  ogImage: "",
  twitterHandle: "@myzuwa",
  
  // Email Settings
  adminEmail: "admin@myzuwa.com",
  supportEmail: "support@myzuwa.com",
  notificationEmail: "notifications@myzuwa.com",
  emailFromName: "Myzuwa Team",
  
  // Social Media Links
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: ""
  },
  
  // Analytics & Tracking
  googleAnalyticsId: "",
  facebookPixelId: "",
  hotjarId: "",
  
  // Waitlist Settings
  waitlistEnabled: true,
  maxWaitlistEntries: 50000,
  requirePhoneNumber: true,
  enableTutorialBook: true,
  autoEmailConfirmation: true,
  
  // Notification Settings
  emailNotifications: {
    newSignup: true,
    dailyReport: true,
    weeklyReport: false,
    exportReminder: false
  },
  
  // Security Settings
  enableCaptcha: false,
  rateLimitEnabled: true,
  maxAttemptsPerHour: 10,
  sessionTimeout: 30,
  
  // Appearance Settings
  theme: 'light',
  primaryColor: '#ea580c',
  secondaryColor: '#1f2937',
  accentColor: '#f97316',
  
  // Feature Flags
  features: {
    adminDashboard: true,
    contentEditor: true,
    csvExport: true,
    realTimeStats: true,
    advancedFilters: true
  },
  
  // Maintenance
  maintenanceMode: false,
  maintenanceMessage: "We're currently performing scheduled maintenance. Please check back soon!",
  maintenanceEndTime: "",
  
  // Legal & Compliance
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
  cookiePolicyUrl: "/cookies",
  gdprCompliant: true,
  dataRetentionDays: 365,

  // Footer Settings
  footerSettings: {
    showFooter: true,
    companyAddress: "",
    companyPhone: "",
    footerText: "Made with ❤️ for creators",
    showSocialLinks: true,
    showLegalLinks: true,
    customLinks: []
  }
};