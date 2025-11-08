import apiClient from './client'

export interface ActivityRequest {
  activity_type: string
  value: number
  unit?: string
  description?: string
}

export interface ActivityResponse {
  activity_type: string
  value: number
  unit: string
  emissions_kg_co2: number
  description?: string
  timestamp: string
  suggestions: string[]
}

export interface CarbonActivity {
  id: string
  date: string
  activity_type: string
  category: string
  value: number
  unit: string
  emissions_kg_co2: number
  emission_factor: number
  description?: string
  is_shared: boolean
}

export interface CarbonDashboard {
  summary: {
    total_emissions_30d_kg_co2: number
    total_activities_30d: number
    daily_average_kg_co2: number
    annual_estimate_tons_co2: number
    comparison_to_india_avg: {
      percentage_difference: number
      status: 'below' | 'above'
      india_daily_avg_kg_co2: number
    }
  }
  category_breakdown: Record<string, {
    total_emissions_kg_co2: number
    activity_count: number
    average_emissions_kg_co2: number
    percentage: number
  }>
  daily_emissions_7d: Array<{
    date: string
    emissions_kg_co2: number
  }>
  top_activities: Array<{
    activity_type: string
    total_emissions_kg_co2: number
    activity_count: number
    description: string
  }>
}

export interface AvailableActivities {
  activities: Record<string, {
    category: string
    emission_factor: number
    unit: string
    description: string
  }>
  categories: Record<string, string>
}

export const carbonAPI = {
  async logActivity(activityData: ActivityRequest): Promise<ActivityResponse> {
    try {
      const response = await apiClient.post<ActivityResponse>('/carbon/activity', activityData)
      return response.data
    } catch (error) {
      // Mock response for development when backend is not running
      console.warn('Backend not available, using mock activity logging')
      const mockEmissions = activityData.value * 0.12 // Mock emission factor
      return {
        activity_type: activityData.activity_type,
        value: activityData.value,
        unit: 'km',
        emissions_kg_co2: mockEmissions,
        description: activityData.description,
        timestamp: new Date().toISOString(),
        suggestions: [
          `Great job tracking! You generated ${mockEmissions.toFixed(1)} kg CO₂ from this activity`,
          'Keep logging activities to understand your carbon footprint',
          'Small changes in daily habits can make a big difference'
        ]
      }
    }
  },

  async getAvailableActivities(): Promise<AvailableActivities> {
    try {
      const response = await apiClient.get<AvailableActivities>('/carbon/activities')
      return response.data
    } catch (error) {
      // Mock response for development
      console.warn('Backend not available, using mock activities')
      return {
        activities: {
          car: { category: 'transportation', emission_factor: 0.12, unit: 'km', description: 'Petrol car travel' },
          bus: { category: 'transportation', emission_factor: 0.05, unit: 'km', description: 'Public bus travel' },
          train: { category: 'transportation', emission_factor: 0.04, unit: 'km', description: 'Train travel' },
          chicken: { category: 'food', emission_factor: 1.5, unit: 'meal/serving', description: 'Chicken meal' },
          vegetarian: { category: 'food', emission_factor: 0.8, unit: 'meal/serving', description: 'Vegetarian meal' },
          electricity_india: { category: 'energy', emission_factor: 0.82, unit: 'kWh', description: 'Grid electricity (India)' },
          clothes_new: { category: 'shopping', emission_factor: 20.0, unit: 'item', description: 'New clothing item' }
        },
        categories: {
          transportation: '🚗 Transport (car, bike, bus, flight)',
          food: '🍔 Food (meat, vegetarian, vegan, dairy)',
          energy: '⚡ Energy (electricity, gas, water heating)',
          shopping: '🛍️ Shopping (clothes, electronics, books)',
          household: '🏠 Household (waste, water usage)'
        }
      }
    }
  },

  async getRecentActivities(limit: number = 20): Promise<CarbonActivity[]> {
    try {
      const response = await apiClient.get<{activities: CarbonActivity[]}>(`/carbon/recent-activities?limit=${limit}`)
      return response.data.activities
    } catch (error) {
      // Mock response for development
      console.warn('Backend not available, using mock recent activities')
      return [
        {
          id: '1',
          date: new Date().toISOString(),
          activity_type: 'car',
          category: 'transportation',
          value: 15,
          unit: 'km',
          emissions_kg_co2: 1.8,
          emission_factor: 0.12,
          description: 'Drive to work',
          is_shared: false
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString(),
          activity_type: 'chicken',
          category: 'food',
          value: 1,
          unit: 'meal/serving',
          emissions_kg_co2: 1.5,
          emission_factor: 1.5,
          description: 'Lunch',
          is_shared: false
        }
      ]
    }
  },

  async getCarbonDashboard(): Promise<CarbonDashboard> {
    try {
      const response = await apiClient.get<CarbonDashboard>('/carbon/dashboard')
      return response.data
    } catch (error) {
      // Mock response for development
      console.warn('Backend not available, using mock dashboard data')
      return {
        summary: {
          total_emissions_30d_kg_co2: 45.6,
          total_activities_30d: 12,
          daily_average_kg_co2: 1.52,
          annual_estimate_tons_co2: 0.55,
          comparison_to_india_avg: {
            percentage_difference: -22.6,
            status: 'below',
            india_daily_avg_kg_co2: 6.8
          }
        },
        category_breakdown: {
          transportation: {
            total_emissions_kg_co2: 18.5,
            activity_count: 5,
            average_emissions_kg_co2: 3.7,
            percentage: 40.5
          },
          food: {
            total_emissions_kg_co2: 15.2,
            activity_count: 4,
            average_emissions_kg_co2: 3.8,
            percentage: 33.3
          },
          energy: {
            total_emissions_kg_co2: 8.9,
            activity_count: 2,
            average_emissions_kg_co2: 4.45,
            percentage: 19.5
          },
          shopping: {
            total_emissions_kg_co2: 3.0,
            activity_count: 1,
            average_emissions_kg_co2: 3.0,
            percentage: 6.7
          }
        },
        daily_emissions_7d: [
          { date: '2024-01-15', emissions_kg_co2: 2.1 },
          { date: '2024-01-14', emissions_kg_co2: 1.8 },
          { date: '2024-01-13', emissions_kg_co2: 3.2 },
          { date: '2024-01-12', emissions_kg_co2: 1.5 },
          { date: '2024-01-11', emissions_kg_co2: 2.8 },
          { date: '2024-01-10', emissions_kg_co2: 1.9 },
          { date: '2024-01-09', emissions_kg_co2: 2.4 }
        ],
        top_activities: [
          {
            activity_type: 'car',
            total_emissions_kg_co2: 18.5,
            activity_count: 5,
            description: 'Petrol car travel'
          },
          {
            activity_type: 'chicken',
            total_emissions_kg_co2: 3.0,
            activity_count: 2,
            description: 'Chicken meal'
          }
        ]
      }
    }
  }
}
