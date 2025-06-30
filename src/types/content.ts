export interface SiteContent {
  // Brand Settings
  siteName: string;
  logoUrl: string;
  
  // Email Capture Page
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroFeatures: string[];
  
  // Email Form
  emailFormTitle: string;
  emailFormDescription: string;
  emailInputLabel: string;
  emailInputPlaceholder: string;
  emailSubmitButtonText: string;
  emailFormFooterText: string;
  
  // Waitlist Form
  waitlistFormTitle: string;
  waitlistFormDescription: string;
  personalInfoTitle: string;
  businessInfoTitle: string;
  locationTitle: string;
  preferencesTitle: string;
  
  // Form Labels
  fullNameLabel: string;
  phoneLabel: string;
  businessTypeLabel: string;
  countryLabel: string;
  cityLabel: string;
  storeExperienceLabel: string;
  storeExperienceDescription: string;
  tutorialBookLabel: string;
  tutorialBookDescription: string;
  
  // Buttons
  backButtonText: string;
  submitButtonText: string;
  
  // Success Page
  successTitle: string;
  successSubtitle: string;
  successDescription: string;
  
  // Success Cards
  emailCardTitle: string;
  emailCardDescription: string;
  tutorialCardTitle: string;
  tutorialCardDescription: string;
  stayTunedCardTitle: string;
  stayTunedCardDescription: string;
  earlyAccessCardTitle: string;
  earlyAccessCardDescription: string;
  
  // What's Next Section
  whatsNextTitle: string;
  whatsNextSteps: string[];
  
  // Footer
  footerContactText: string;
  footerContactEmail: string;
  footerPrivacyText: string;
  
  // Social Proof
  socialProofText: string;
  socialProofCount: string;
  socialProofCategories: string[];
}

export interface AdminNavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: AdminNavItem[];
}

export const defaultSiteContent: SiteContent = {
  // Brand Settings
  siteName: "MYZUWA",
  logoUrl: "",
  
  // Email Capture Page
  heroTitle: "Myzuwa\nis coming.",
  heroSubtitle: "E-commerce meets music.",
  heroDescription: "Be first to experience\nthe future.",
  heroButtonText: "Join the Waitlist",
  heroFeatures: [
    "Stream exclusive music",
    "Shop curated drops",
    "Unlock early bird perks"
  ],
  
  // Email Form
  emailFormTitle: "Join the waitlist",
  emailFormDescription: "Enter your email to start your journey with Myzuwa",
  emailInputLabel: "Email Address",
  emailInputPlaceholder: "Email Address",
  emailSubmitButtonText: "Reserve My Spot",
  emailFormFooterText: "Join 10,000+ creators already on the list",
  
  // Waitlist Form
  waitlistFormTitle: "Complete Your Registration",
  waitlistFormDescription: "Help us personalize your Myzuwa experience",
  personalInfoTitle: "Personal Information",
  businessInfoTitle: "Business Information",
  locationTitle: "Location",
  preferencesTitle: "Preferences",
  
  // Form Labels
  fullNameLabel: "Full Name *",
  phoneLabel: "Phone Number *",
  businessTypeLabel: "Type of Business *",
  countryLabel: "Country *",
  cityLabel: "City *",
  storeExperienceLabel: "I have run an online store before",
  storeExperienceDescription: "This helps us tailor your onboarding experience",
  tutorialBookLabel: "Send me the tutorial book when available",
  tutorialBookDescription: "Get exclusive access to our comprehensive business guide",
  
  // Buttons
  backButtonText: "Back",
  submitButtonText: "Reserve My Spot",
  
  // Success Page
  successTitle: "Welcome to Myzuwa!",
  successSubtitle: "🎉 You're officially on the waitlist!",
  successDescription: "Thank you for joining us on this exciting journey.",
  
  // Success Cards
  emailCardTitle: "Check Your Email",
  emailCardDescription: "You'll receive updates about launch dates, exclusive previews, and early access opportunities.",
  tutorialCardTitle: "Tutorial Book",
  tutorialCardDescription: "You'll be notified when our comprehensive business guide is ready for download.",
  stayTunedCardTitle: "Stay Tuned",
  stayTunedCardDescription: "Follow us on social media for behind-the-scenes updates and community highlights.",
  earlyAccessCardTitle: "Early Access",
  earlyAccessCardDescription: "As a waitlist member, you'll get priority access when we launch new features.",
  
  // What's Next Section
  whatsNextTitle: "What happens next?",
  whatsNextSteps: [
    "We'll send you exclusive updates and behind-the-scenes content as we build Myzuwa",
    "You'll get early access to test new features before they're publicly available",
    "When we launch, you'll be among the first to join the platform with special perks"
  ],
  
  // Footer
  footerContactText: "Have questions? Reach out to us at",
  footerContactEmail: "hello@myzuwa.com",
  footerPrivacyText: "You can unsubscribe at any time. We respect your privacy.",
  
  // Social Proof
  socialProofText: "Join",
  socialProofCount: "10,000+",
  socialProofCategories: ["Musicians", "Designers", "Entrepreneurs", "Artists"]
};