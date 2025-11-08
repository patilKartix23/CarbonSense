import React, { useState, useEffect } from 'react';
import { 
  Factory, 
  MapPin, 
  Recycle, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Info,
  Calculator,
  Globe,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ccusApi from '../api/ccus';
import CCUSMap from '../components/ccus/CCUSMap';
import type { 
  CCUSComprehensiveAnalysis, 
  IndustryType, 
  CCUSSimulationInput,
  IndiaStorageOverview 
} from '../types/ccus';

const CCUSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'overview' | 'education' | 'map'>('simulator');
  const [analysisResult, setAnalysisResult] = useState<CCUSComprehensiveAnalysis | null>(null);
  const [supportedIndustries, setSupportedIndustries] = useState<IndustryType[]>([]);
  const [indiaOverview, setIndiaOverview] = useState<IndiaStorageOverview | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CCUSSimulationInput>({
    industry_type: '',
    annual_emissions_tonnes: 0,
    state: '',
    credit_type: 'voluntary_market'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [industries, overview] = await Promise.all([
        ccusApi.getSupportedIndustries(),
        ccusApi.getIndiaStorageOverview()
      ]);
      
      setSupportedIndustries(industries);
      setIndiaOverview(overview);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Failed to load initial data');
    }
  };

  const handleInputChange = (field: keyof CCUSSimulationInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.industry_type) {
      newErrors.industry_type = 'Please select an industry type';
    }
    
    if (!formData.annual_emissions_tonnes || formData.annual_emissions_tonnes <= 0) {
      newErrors.annual_emissions_tonnes = 'Please enter valid annual emissions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSimulation = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await ccusApi.getComprehensiveAnalysis(formData);
      setAnalysisResult(result);
      toast.success('CCUS analysis completed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to run CCUS analysis');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  const creditTypes = [
    { value: 'voluntary_market', label: 'Voluntary Market' },
    { value: 'compliance_market', label: 'Compliance Market' },
    { value: 'government_incentive', label: 'Government Incentive' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏭 CCUS Hub - Carbon Capture, Utilization & Storage
              </h1>
              <p className="text-gray-600 mt-2">
                Simulate, analyze, and implement carbon capture solutions for India's Net Zero 2070 goal
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">India's Net Zero Target</div>
              <div className="text-2xl font-bold text-green-600">2070</div>
              <div className="text-sm text-gray-500">{2070 - new Date().getFullYear()} years to go</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'simulator', label: 'CCUS Simulator', icon: Calculator },
            { id: 'overview', label: 'India Overview', icon: Globe },
            { id: 'education', label: 'Learn CCUS', icon: Lightbulb },
            { id: 'map', label: 'Storage Map', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Factory className="w-5 h-5 mr-2 text-blue-600" />
                CCUS Simulation Input
              </h2>
              
              <div className="space-y-4">
                {/* Industry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Type *
                  </label>
                  <select
                    value={formData.industry_type}
                    onChange={(e) => handleInputChange('industry_type', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.industry_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select industry type...</option>
                    {supportedIndustries
                      .sort((a, b) => b.capture_efficiency_percent - a.capture_efficiency_percent)
                      .map(industry => (
                        <option key={industry.industry_type} value={industry.industry_type}>
                          {industry.industry_type
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                          } - {industry.capture_efficiency_percent}% Efficiency
                        </option>
                      ))}
                  </select>
                  {errors.industry_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry_type}</p>
                  )}
                  {formData.industry_type && supportedIndustries.find(i => i.industry_type === formData.industry_type) && (
                    <p className="text-gray-600 text-sm mt-2 italic">
                      {supportedIndustries.find(i => i.industry_type === formData.industry_type)?.description}
                    </p>
                  )}
                </div>

                {/* Annual Emissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual CO₂ Emissions (tonnes) *
                  </label>
                  <input
                    type="number"
                    value={formData.annual_emissions_tonnes || ''}
                    onChange={(e) => handleInputChange('annual_emissions_tonnes', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 50000"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.annual_emissions_tonnes ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.annual_emissions_tonnes && (
                    <p className="text-red-500 text-sm mt-1">{errors.annual_emissions_tonnes}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Enter your facility's annual CO₂ emissions in tonnes
                  </p>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State (Optional)
                  </label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state...</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-sm mt-1">
                    Help us suggest nearby storage facilities
                  </p>
                </div>

                {/* Credit Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbon Credit Type
                  </label>
                  <select
                    value={formData.credit_type || 'voluntary_market'}
                    onChange={(e) => handleInputChange('credit_type', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {creditTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSimulation}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running Analysis...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Run CCUS Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Analysis Results
              </h2>
              
              {analysisResult ? (
                <div className="space-y-6">
                  {/* Capture Analysis */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Carbon Capture Potential</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Capture Efficiency:</span>
                        <div className="font-semibold text-lg text-green-600">
                          {analysisResult.capture_analysis.capture_efficiency}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Capturable CO₂:</span>
                        <div className="font-semibold text-lg text-blue-600">
                          {ccusApi.formatCO2Amount(analysisResult.capture_analysis.capturable_co2_tonnes)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Analysis */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Financial Potential</h3>
                    <div className="text-sm">
                      <span className="text-gray-600">Annual Revenue:</span>
                      <div className="font-semibold text-lg text-green-600">
                        {ccusApi.formatCurrency(analysisResult.carbon_credits.annual_revenue_potential)}
                      </div>
                    </div>
                  </div>

                  {/* Top Storage Sites */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Recommended Storage Sites</h3>
                    <div className="space-y-2">
                      {analysisResult.storage_options.slice(0, 2).map((site, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="font-medium">{site.state}</div>
                          <div className="text-sm text-gray-600">
                            Capacity: {site.total_capacity_mt} MT
                            {site.recommended && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Key Recommendations</h3>
                    <div className="space-y-2">
                      {analysisResult.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className={`p-3 rounded text-sm ${ccusApi.getPriorityColor(rec.priority)}`}>
                          <div className="font-medium">{rec.message}</div>
                          <div className="text-xs mt-1">{rec.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Run a CCUS analysis to see detailed results and recommendations</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-600" />
              India's CCUS Storage Overview
            </h2>
            
            {indiaOverview && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Capacity */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Total Storage Capacity</h3>
                  <div className="text-3xl font-bold">{indiaOverview.total_capacity_mt} MT</div>
                  <p className="text-blue-100 text-sm">Across {indiaOverview.states_covered} states</p>
                </div>

                {/* Top States */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Top Storage States</h3>
                  <div className="space-y-1">
                    {indiaOverview.top_states.slice(0, 3).map(([state, data]) => (
                      <div key={state} className="flex justify-between text-sm">
                        <span>{state}</span>
                        <span>{data.total_capacity} MT</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Types */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Storage Options</h3>
                  <div className="space-y-1 text-sm">
                    <div>🛢️ Depleted Oil Wells</div>
                    <div>💧 Saline Aquifers</div>
                    <div>⛽ Coal Seams</div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed State Data */}
            {indiaOverview && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">State-wise Storage Potential & Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(indiaOverview.state_wise_data).map(([state, data]) => (
                    <div key={state} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <h4 className="font-semibold text-lg mb-2">{state}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Oil Wells:</span>
                          <span className="font-medium">{data.depleted_oil_wells} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aquifers:</span>
                          <span className="font-medium">{data.saline_aquifers} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coal Seams:</span>
                          <span className="font-medium">{data.coal_seams} MT</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-blue-600">{data.total_capacity} MT</span>
                        </div>
                        {data.description && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500 italic">{data.description}</p>
                          </div>
                        )}
                        {data.active_projects && data.active_projects.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-semibold text-green-700 mb-1">Active Projects:</p>
                            {data.active_projects.map((project: string, idx: number) => (
                              <div key={idx} className="text-xs text-gray-600 flex items-start">
                                <span className="text-green-600 mr-1">✓</span>
                                <span>{project}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
              Learn About CCUS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CCUS Basics */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">CCUS Fundamentals</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn the basics of Carbon Capture, Utilization and Storage technology and its importance for climate action.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">15 mins</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Beginner</span>
                </div>
              </div>

              {/* Capture Technologies */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-4">
                  <Factory className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Capture Technologies</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore different CO₂ capture methods and their applications across various industries.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">25 mins</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Intermediate</span>
                </div>
              </div>

              {/* Storage & Utilization */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-green-600 mb-4">
                  <Recycle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Storage & Utilization</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Understand geological storage options and innovative ways to utilize captured CO₂.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">30 mins</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Intermediate</span>
                </div>
              </div>

              {/* India's CCUS Mission */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-orange-600 mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">India's CCUS Mission</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn about government policies, targets, and incentives for CCUS deployment in India.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">20 mins</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Advanced</span>
                </div>
              </div>

              {/* Economics & Finance */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-green-600 mb-4">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Economics & Finance</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Understand the financial aspects, carbon credits, and business models for CCUS projects.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">25 mins</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Intermediate</span>
                </div>
              </div>

              {/* Implementation Guide */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Implementation Guide</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Step-by-step guide to planning and implementing CCUS projects in your organization.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">35 mins</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Advanced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-red-600" />
              CCUS Storage Sites Map - India
            </h2>
            
            <p className="text-gray-600 mb-6">
              Interactive map showing CCUS storage capacity across Indian states. Circle size represents storage capacity. Click on markers for details.
            </p>

            {/* Legend */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-3">Map Legend:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>&gt; 10,000 MT</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span>7,000 - 10,000 MT</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <span>5,000 - 7,000 MT</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span>&lt; 5,000 MT</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <p><strong>Total Storage Capacity:</strong> {indiaOverview ? indiaOverview.total_capacity_mt.toLocaleString() : '67,400'} MT CO₂</p>
                <p><strong>States Covered:</strong> {indiaOverview ? indiaOverview.states_covered : 12} Indian states</p>
              </div>
            </div>

            {/* Map Component */}
            {indiaOverview ? (
              <CCUSMap stateData={indiaOverview.state_wise_data} />
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map data...</p>
                </div>
              </div>
            )}

            {/* Map Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🛢️ Depleted Oil Wells</h4>
                <p className="text-sm text-blue-800">Former oil and gas reservoirs suitable for CO₂ storage with proven seal integrity</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💧 Saline Aquifers</h4>
                <p className="text-sm text-green-800">Deep underground formations with saltwater, offering largest storage potential</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">⛽ Coal Seams</h4>
                <p className="text-sm text-orange-800">Unmineable coal layers that can absorb CO₂ while releasing methane</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CCUSPage;
