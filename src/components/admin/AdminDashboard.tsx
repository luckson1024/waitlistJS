import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Download,
  Filter,
  Search,
  MapPin,
  Building,
  Mail,
  Phone,
  BookOpen,
  Store,
  BarChart3,
  TrendingUp,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { WaitlistFormData } from '../../types/waitlist';
import AdminSidebar from './AdminSidebar';
import ContentEditor from './ContentEditor';
import AdminSiteSettings from './SiteSettings';
import SecurityAIAgent from './SecurityAIAgent';
import { deleteWaitlistEntry, bulkDeleteWaitlistEntries } from '../../services/waitlistService';
import api from '../../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [waitlistData, setWaitlistData] = useState<(WaitlistFormData & { id: number; createdAt: string })[]>([]);
  const [filteredData, setFilteredData] = useState<(WaitlistFormData & { id: number; createdAt: string })[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    businessType: '',
    hasStore: '',
    wantsTutorial: ''
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchWaitlistData = useCallback(async () => {
    try {
      const response = await api.get('/waitlist');
      setWaitlistData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      alert('Failed to load waitlist data.');
    }
  }, []);

  useEffect(() => {
    fetchWaitlistData();
  }, [fetchWaitlistData]);

  useEffect(() => {
    // Apply filters
    let filtered = waitlistData;

    if (filters.search) {
      filtered = filtered.filter(item => 
        item.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.country) {
      filtered = filtered.filter(item => item.country === filters.country);
    }

    if (filters.businessType) {
      filtered = filtered.filter(item => item.typeOfBusiness === filters.businessType);
    }

    if (filters.hasStore) {
      filtered = filtered.filter(item => 
        filters.hasStore === 'yes' ? item.hasRunStoreBefore : !item.hasRunStoreBefore
      );
    }

    if (filters.wantsTutorial) {
      filtered = filtered.filter(item => 
        filters.wantsTutorial === 'yes' ? item.wantsTutorialBook : !item.wantsTutorialBook
      );
    }

    setFilteredData(filtered);
  }, [filters, waitlistData]);

  const exportToCSV = () => {
    const headers = [
      'ID', 'Created At', 'Full Name', 'Email', 'Phone', 'Business Type', 
      'Custom Business', 'Country', 'City', 'Has Store Experience', 'Wants Tutorial'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        new Date(item.createdAt).toLocaleDateString(),
        `"${item.fullName}"`,
        item.email,
        `"${item.phoneNumber}"`,
        `"${item.typeOfBusiness}"`,
        `"${item.customBusinessTypes || ''}"`,
        item.country,
        `"${item.city}"`,
        item.hasRunStoreBefore ? 'Yes' : 'No',
        item.wantsTutorialBook ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myzuwa-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUniqueValues = (key: keyof WaitlistFormData) => {
    return [...new Set(waitlistData.map(item => item[key] as string).filter(Boolean))];
  };

  const stats = {
    total: waitlistData.length,
    withStoreExperience: waitlistData.filter(item => item.hasRunStoreBefore).length,
    wantsTutorial: waitlistData.filter(item => item.wantsTutorialBook).length,
    topCountries: Object.entries(
      waitlistData.reduce((acc, item) => {
        acc[item.country] = (acc[item.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort(([,a], [,b]) => b - a).slice(0, 3)
  };

  // Delete a single entry
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteWaitlistEntry(id);
        alert('Entry deleted successfully!');
        fetchWaitlistData(); // Re-fetch data to update the table
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry.');
      }
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm('Delete all selected entries? This cannot be undone.')) {
      try {
        await bulkDeleteWaitlistEntries(selectedIds);
        alert('Selected entries deleted successfully!');
        setSelectedIds([]);
        fetchWaitlistData(); // Re-fetch data to update the table
      } catch (error) {
        console.error('Error bulk deleting entries:', error);
        alert('Failed to delete selected entries.');
      }
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Signups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-2">
              <Store className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">With Store Experience</p>
              <p className="text-2xl font-bold text-gray-900">{stats.withStoreExperience}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wants Tutorial</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wantsTutorial}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-lg p-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total > 0 ? Math.round((stats.total / (stats.total * 1.2)) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </h2>
          <button
            onClick={exportToCSV}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="relative col-span-full sm:col-span-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Countries</option>
            {getUniqueValues('country').map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={filters.businessType}
            onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Business Types</option>
            {getUniqueValues('typeOfBusiness').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filters.hasStore}
            onChange={(e) => setFilters({ ...filters, hasStore: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Store Experience</option>
            <option value="yes">Has Experience</option>
            <option value="no">No Experience</option>
          </select>

          <select
            value={filters.wantsTutorial}
            onChange={(e) => setFilters({ ...filters, wantsTutorial: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Tutorial Interest</option>
            <option value="yes">Wants Tutorial</option>
            <option value="no">No Tutorial</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Waitlist Entries ({filteredData.length})
          </h3>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-stretch md:items-center">
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(filteredData.map(item => item.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferences
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(ids => [...ids, item.id]);
                        } else {
                          setSelectedIds(ids => ids.filter(id => id !== item.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-orange-100 rounded-full p-2 mr-3">
                        <Users className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.fullName}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {item.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {item.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.typeOfBusiness}</div>
                        {item.customBusinessTypes && (
                          <div className="text-sm text-gray-500">{item.customBusinessTypes}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div>{item.city}</div>
                        <div className="text-gray-500">{item.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Store className="h-3 w-3 mr-1 text-gray-400" />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.hasRunStoreBefore 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.hasRunStoreBefore ? 'Has Store' : 'No Store'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1 text-gray-400" />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.wantsTutorialBook 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.wantsTutorialBook ? 'Wants Tutorial' : 'No Tutorial'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Top Countries */}
      {stats.topCountries.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Countries
          </h3>
          <div className="space-y-3">
            {stats.topCountries.map(([country, count], index) => (
              <div key={country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                  </div>
                  <span className="text-gray-900">{country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onLogout={onLogout} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Header for mobile/collapsed sidebar */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {isSidebarCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </button>
        </div>
        {/* Section Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setActiveSection('dashboard')} className={activeSection === 'dashboard' ? 'bg-orange-600 text-white px-4 py-2 rounded' : 'bg-white px-4 py-2 rounded border'}>Dashboard</button>
          <button onClick={() => setActiveSection('content')} className={activeSection === 'content' ? 'bg-orange-600 text-white px-4 py-2 rounded' : 'bg-white px-4 py-2 rounded border'}>Content</button>
          <button onClick={() => setActiveSection('settings')} className={activeSection === 'settings' ? 'bg-orange-600 text-white px-4 py-2 rounded' : 'bg-white px-4 py-2 rounded border'}>Settings</button>
          <button onClick={() => setActiveSection('ai-security')} className={activeSection === 'ai-security' ? 'bg-orange-600 text-white px-4 py-2 rounded' : 'bg-white px-4 py-2 rounded border'}>AI Security Agent</button>
        </div>
        {/* Section Content */}
        {activeSection === 'dashboard' && (
          renderDashboard()
        )}
        {(activeSection === 'content' ||
          activeSection === 'content-brand' ||
          activeSection === 'content-homepage' ||
          activeSection === 'content-forms' ||
          activeSection === 'content-success') && (
          <ContentEditor section={
            activeSection === 'content' ? 'content-homepage' : activeSection
          } />
        )}
        {activeSection === 'settings' && (
          <AdminSiteSettings />
        )}
        {activeSection === 'ai-security' && (
          <SecurityAIAgent />
        )}
      </main>
    </div>
  );
}