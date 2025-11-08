// CCUS API Client
import axios from 'axios';
import type {
  CCUSSimulationInput,
  CCUSStorageInput,
  CCUSUtilizationInput,
  CCUSCarbonCreditsInput,
  CCUSCaptureResponse,
  CCUSStorageResponse,
  CCUSUtilizationResponse,
  CCUSCreditsResponse,
  CCUSComprehensiveAnalysis,
  IndustryType,
  IndiaStorageOverview
} from '../types/ccus';

// Create dedicated CCUS API client pointing to FastAPI backend on port 8000
const ccusClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class CCUSApi {
  private baseURL = '/api/ccus';

  // Simulate carbon capture for industrial emissions
  async simulateCapture(data: CCUSSimulationInput): Promise<CCUSCaptureResponse> {
    try {
      const response = await ccusClient.post(`${this.baseURL}/capture-simulation`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to simulate carbon capture'
      };
    }
  }

  // Get suitable storage sites for captured CO2
  async getStorageSites(data: CCUSStorageInput): Promise<CCUSStorageResponse> {
    try {
      const response = await ccusClient.post(`${this.baseURL}/storage-sites`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get storage sites'
      };
    }
  }

  // Get CO2 utilization pathways and potential
  async getUtilizationPathways(data: CCUSUtilizationInput): Promise<CCUSUtilizationResponse> {
    try {
      const response = await ccusClient.post(`${this.baseURL}/utilization-pathways`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get utilization pathways'
      };
    }
  }

  // Calculate carbon credit value for stored CO2
  async calculateCarbonCredits(data: CCUSCarbonCreditsInput): Promise<CCUSCreditsResponse> {
    try {
      const response = await ccusClient.post(`${this.baseURL}/carbon-credits`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to calculate carbon credits'
      };
    }
  }

  // Comprehensive CCUS analysis
  async getComprehensiveAnalysis(data: CCUSSimulationInput): Promise<CCUSComprehensiveAnalysis | null> {
    try {
      const response = await ccusClient.post(`${this.baseURL}/comprehensive-analysis`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get comprehensive CCUS analysis:', error);
      throw new Error(error.response?.data?.error || 'Failed to get comprehensive analysis');
    }
  }

  // Get overview of CCUS storage potential across India
  async getIndiaStorageOverview(): Promise<IndiaStorageOverview | null> {
    try {
      const response = await ccusClient.get(`${this.baseURL}/india-storage-overview`);
      return response.data.india_storage_overview;
    } catch (error: any) {
      console.error('Failed to get India storage overview:', error);
      throw new Error(error.response?.data?.error || 'Failed to get storage overview');
    }
  }

  // Get list of supported industry types for CCUS
  async getSupportedIndustries(): Promise<IndustryType[]> {
    try {
      // Add timestamp to prevent caching
      const response = await ccusClient.get(`${this.baseURL}/industry-types?_t=${Date.now()}`);
      console.log('Industry types response:', response.data);
      return response.data.supported_industries;
    } catch (error: any) {
      console.error('Failed to get supported industries:', error);
      throw new Error(error.response?.data?.error || 'Failed to get industry types');
    }
  }

  // Utility method to validate inputs
  validateSimulationInput(data: CCUSSimulationInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.industry_type || data.industry_type.trim() === '') {
      errors.push('Industry type is required');
    }

    if (!data.annual_emissions_tonnes || data.annual_emissions_tonnes <= 0) {
      errors.push('Annual emissions must be greater than 0');
    }

    if (data.annual_emissions_tonnes && data.annual_emissions_tonnes > 100000000) {
      errors.push('Annual emissions seem unreasonably high (>100M tonnes)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Utility method to format numbers for display
  formatCO2Amount(tonnes: number): string {
    if (tonnes >= 1000000) {
      return `${(tonnes / 1000000).toFixed(2)} MT`;
    } else if (tonnes >= 1000) {
      return `${(tonnes / 1000).toFixed(2)} kt`;
    } else {
      return `${tonnes.toFixed(2)} t`;
    }
  }

  // Utility method to format currency
  formatCurrency(amount: number, currency: 'INR' | 'USD' = 'INR'): string {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  }

  // Get efficiency color coding for UI
  getEfficiencyColor(efficiency: number): string {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    if (efficiency >= 70) return 'text-orange-600';
    return 'text-red-600';
  }

  // Get priority color coding for recommendations
  getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  // Calculate ROI for CCUS projects
  calculateSimpleROI(investment: number, annualRevenue: number, years: number = 10): {
    totalRevenue: number;
    netProfit: number;
    roi: number;
    paybackPeriod: number;
  } {
    const totalRevenue = annualRevenue * years;
    const netProfit = totalRevenue - investment;
    const roi = (netProfit / investment) * 100;
    const paybackPeriod = investment / annualRevenue;

    return {
      totalRevenue,
      netProfit,
      roi,
      paybackPeriod
    };
  }

  // Get state-wise recommendations
  getStateRecommendations(state: string): string[] {
    const stateRecommendations: Record<string, string[]> = {
      'Gujarat': [
        'Leverage existing oil and gas infrastructure',
        'Partner with petrochemical industries',
        'Explore enhanced oil recovery projects',
        'Develop industrial CO2 clusters'
      ],
      'Rajasthan': [
        'Utilize depleted oil wells for storage',
        'Focus on cement industry partnerships',
        'Develop saline aquifer storage',
        'Create renewable energy + CCUS hubs'
      ],
      'Jharkhand': [
        'Leverage coal mining infrastructure',
        'Partner with steel industries',
        'Explore coal seam storage',
        'Develop industrial clusters'
      ],
      'Maharashtra': [
        'Partner with chemical industries',
        'Focus on industrial clusters',
        'Develop utility-scale projects',
        'Explore concrete utilization'
      ],
      'Tamil Nadu': [
        'Partner with automotive industries',
        'Focus on coastal storage options',
        'Develop renewable energy integration',
        'Create technology innovation hubs'
      ]
    };

    return stateRecommendations[state] || [
      'Assess local industrial emissions',
      'Explore regional storage options',
      'Develop stakeholder partnerships',
      'Create awareness programs'
    ];
  }

  // Generate project timeline
  generateProjectTimeline(projectSize: 'small' | 'medium' | 'large'): Array<{
    phase: string;
    duration: string;
    activities: string[];
  }> {
    const baseTimeline = [
      {
        phase: 'Feasibility Study',
        duration: projectSize === 'small' ? '3-6 months' : projectSize === 'medium' ? '6-12 months' : '12-18 months',
        activities: [
          'Technical assessment',
          'Economic analysis',
          'Regulatory review',
          'Stakeholder consultation'
        ]
      },
      {
        phase: 'Design & Engineering',
        duration: projectSize === 'small' ? '6-12 months' : projectSize === 'medium' ? '12-18 months' : '18-24 months',
        activities: [
          'Detailed engineering design',
          'Equipment specification',
          'Site preparation',
          'Permits and approvals'
        ]
      },
      {
        phase: 'Construction',
        duration: projectSize === 'small' ? '12-18 months' : projectSize === 'medium' ? '18-30 months' : '30-48 months',
        activities: [
          'Equipment procurement',
          'Site construction',
          'Installation and testing',
          'Commissioning'
        ]
      },
      {
        phase: 'Operation',
        duration: '20+ years',
        activities: [
          'Daily operations',
          'Monitoring and verification',
          'Maintenance',
          'Optimization'
        ]
      }
    ];

    return baseTimeline;
  }
}

// Export singleton instance
export const ccusApi = new CCUSApi();
export default ccusApi;
