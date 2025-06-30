import { useState } from 'react';
import { Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { SiteContent } from '../../types/content';

interface ContentEditorProps {
  section: string;
}

export default function ContentEditor({ section }: ContentEditorProps) {
  const { content, updateContent, resetContent } = useContent();
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof SiteContent, value: string | string[]) => {
    setLocalContent(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleArrayChange = (field: keyof SiteContent, index: number, value: string) => {
    const currentArray = localContent[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    handleInputChange(field, newArray);
  };

  const addArrayItem = (field: keyof SiteContent) => {
    const currentArray = localContent[field] as string[];
    handleInputChange(field, [...currentArray, '']);
  };

  const removeArrayItem = (field: keyof SiteContent, index: number) => {
    const currentArray = localContent[field] as string[];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateContent(localContent);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalContent(content);
    setHasChanges(false);
  };

  const handleResetToDefault = () => {
    resetContent();
    setLocalContent(content);
    setHasChanges(false);
  };

  const renderInput = (
    label: string,
    field: keyof SiteContent,
    type: 'text' | 'textarea' | 'url' = 'text',
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={localContent[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      ) : (
        <input
          type={type}
          value={localContent[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      )}
    </div>
  );

  const renderArrayInput = (label: string, field: keyof SiteContent) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {(localContent[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            onClick={() => removeArrayItem(field, index)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={() => addArrayItem(field)}
        className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200"
      >
        Add Item
      </button>
    </div>
  );

  const renderBrandSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
      {renderInput('Site Name', 'siteName', 'text', 'MYZUWA')}
      {renderInput('Logo URL', 'logoUrl', 'url', 'https://example.com/logo.png')}
    </div>
  );

  const renderHomepageContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Homepage Content</h3>
      {renderInput('Hero Title', 'heroTitle', 'textarea', 'Myzuwa\nis coming.')}
      {renderInput('Hero Subtitle', 'heroSubtitle', 'text', 'E-commerce meets music.')}
      {renderInput('Hero Description', 'heroDescription', 'textarea')}
      {renderInput('Hero Button Text', 'heroButtonText', 'text', 'Join the Waitlist')}
      {renderArrayInput('Hero Features', 'heroFeatures')}
      
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Email Form Section</h4>
        {renderInput('Form Title', 'emailFormTitle', 'text')}
        {renderInput('Form Description', 'emailFormDescription', 'text')}
        {renderInput('Email Input Label', 'emailInputLabel', 'text')}
        {renderInput('Email Input Placeholder', 'emailInputPlaceholder', 'text')}
        {renderInput('Submit Button Text', 'emailSubmitButtonText', 'text')}
        {renderInput('Footer Text', 'emailFormFooterText', 'text')}
      </div>
    </div>
  );

  const renderFormsContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Forms & Labels</h3>
      {renderInput('Waitlist Form Title', 'waitlistFormTitle', 'text')}
      {renderInput('Waitlist Form Description', 'waitlistFormDescription', 'text')}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Section Titles</h4>
          {renderInput('Personal Info Title', 'personalInfoTitle', 'text')}
          {renderInput('Business Info Title', 'businessInfoTitle', 'text')}
          {renderInput('Location Title', 'locationTitle', 'text')}
          {renderInput('Preferences Title', 'preferencesTitle', 'text')}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Field Labels</h4>
          {renderInput('Full Name Label', 'fullNameLabel', 'text')}
          {renderInput('Phone Label', 'phoneLabel', 'text')}
          {renderInput('Business Type Label', 'businessTypeLabel', 'text')}
          {renderInput('Country Label', 'countryLabel', 'text')}
          {renderInput('City Label', 'cityLabel', 'text')}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Preference Options</h4>
        {renderInput('Store Experience Label', 'storeExperienceLabel', 'text')}
        {renderInput('Store Experience Description', 'storeExperienceDescription', 'text')}
        {renderInput('Tutorial Book Label', 'tutorialBookLabel', 'text')}
        {renderInput('Tutorial Book Description', 'tutorialBookDescription', 'text')}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Button Labels</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {renderInput('Back Button Text', 'backButtonText', 'text')}
          {renderInput('Submit Button Text', 'submitButtonText', 'text')}
        </div>
      </div>
    </div>
  );

  const renderSuccessContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Success Page Content</h3>
      {renderInput('Success Title', 'successTitle', 'text')}
      {renderInput('Success Subtitle', 'successSubtitle', 'text')}
      {renderInput('Success Description', 'successDescription', 'text')}
      
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Information Cards</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderInput('Email Card Title', 'emailCardTitle', 'text')}
            {renderInput('Email Card Description', 'emailCardDescription', 'textarea')}
            {renderInput('Tutorial Card Title', 'tutorialCardTitle', 'text')}
            {renderInput('Tutorial Card Description', 'tutorialCardDescription', 'textarea')}
          </div>
          <div className="space-y-4">
            {renderInput('Stay Tuned Card Title', 'stayTunedCardTitle', 'text')}
            {renderInput('Stay Tuned Card Description', 'stayTunedCardDescription', 'textarea')}
            {renderInput('Early Access Card Title', 'earlyAccessCardTitle', 'text')}
            {renderInput('Early Access Card Description', 'earlyAccessCardDescription', 'textarea')}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">What's Next Section</h4>
        {renderInput('What\'s Next Title', 'whatsNextTitle', 'text')}
        {renderArrayInput('What\'s Next Steps', 'whatsNextSteps')}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Footer & Social Proof</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderInput('Footer Contact Text', 'footerContactText', 'text')}
            {renderInput('Footer Contact Email', 'footerContactEmail', 'text')}
            {renderInput('Footer Privacy Text', 'footerPrivacyText', 'textarea')}
          </div>
          <div className="space-y-4">
            {renderInput('Social Proof Text', 'socialProofText', 'text')}
            {renderInput('Social Proof Count', 'socialProofCount', 'text')}
            {renderArrayInput('Social Proof Categories', 'socialProofCategories')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'content-brand':
        return renderBrandSettings();
      case 'content-homepage':
        return renderHomepageContent();
      case 'content-forms':
        return renderFormsContent();
      case 'content-success':
        return renderSuccessContent();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a content section to edit</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Content Editor</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            {hasChanges && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </>
            )}
            
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Save Indicator */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-200 rounded-lg p-4 shadow-lg">
          <p className="text-orange-800 font-medium">You have unsaved changes</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-orange-600 border border-orange-200 rounded text-sm hover:bg-orange-50"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}