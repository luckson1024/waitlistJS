import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Palette, 
  Globe, 
  Mail,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse?: () => void; // Added optional toggleCollapse prop
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'waitlist',
    label: 'Waitlist Management',
    icon: Users
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    children: [
      { id: 'content-brand', label: 'Brand Settings', icon: Palette },
      { id: 'content-homepage', label: 'Homepage Content', icon: Globe },
      { id: 'content-forms', label: 'Forms & Labels', icon: Mail },
      { id: 'content-success', label: 'Success Page', icon: Settings }
    ]
  },
  {
    id: 'settings',
    label: 'Site Settings',
    icon: Settings
  }
];

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection, 
  onLogout, 
  isCollapsed,
  toggleCollapse
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['content']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = activeSection === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              setActiveSection(item.id);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
            level > 0 ? 'pl-12' : ''
          } ${
            isActive 
              ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className={`h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
          {!isCollapsed && (
            <>
              <span className="flex-1 font-medium">{item.label}</span>
              {hasChildren && (
                <div className="ml-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              )}
            </>
          )}
        </button>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-gray-50">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 rounded-lg p-2">
            <LayoutDashboard className="h-6 w-6 text-orange-600" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">Myzuwa CMS</p>
            </div>
          )}
        </div>
        {/* Collapse/Expand button for desktop */}
        {toggleCollapse && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map(item => renderNavItem(item))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}