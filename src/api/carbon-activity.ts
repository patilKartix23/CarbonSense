/**
 * Carbon Activity API client
 */

const API_BASE_URL = 'http://localhost:5000/api/carbon-activity'

export interface ActivityRequest {
  user_id: string
  activity_type: string
  value: number
  category?: string
  description?: string
  location?: string
}

export interface ActivityResponse {
  user_id: string
  activity_type: string
  category: string
  value: number
  unit: string
  emissions_kg_co2: number
  timestamp: string
  message: string
  saved?: boolean
  log_id?: string
}

export interface DailySummary {
  user_id: string
  date: string
  total_emissions_kg_co2: number
  breakdown: {
    transport: number
    food: number
    energy: number
    shopping: number
  }
  activities_logged: number
  comparison: {
    vs_yesterday: number
    vs_weekly_avg: number
    vs_global_avg: number
  }
  achievements: string[]
  recommendations: string[]
}

export interface WeeklyTrends {
  user_id: string
  period: string
  daily_emissions: Array<{
    date: string
    total: number
    transport: number
    food: number
    energy: number
    shopping: number
  }>
  weekly_total: number
  weekly_average: number
  trend: string
  best_day: string
  worst_day: string
  insights: string[]
}

export interface Leaderboard {
  period: string
  rankings: Array<{
    rank: number
    user: string
    emissions: number
    trend: string
    is_current_user?: boolean
  }>
  total_participants: number
  your_rank: number
  percentile: string
  improvement_tip: string
}

export interface Activity {
  category: string
  activity: string
  display_name: string
  unit: string
  emission_factor: number
  examples: string[]
}

export interface ActivitiesResponse {
  activities: Activity[]
  categories: string[]
  total_count: number
}

export interface Suggestion {
  title: string
  description: string
  impact: string
  difficulty: string
  category: string
  icon: string
}

export interface SuggestionsResponse {
  user_id: string
  suggestions: Suggestion[]
  tips_of_the_day: string[]
}

class CarbonActivityApi {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async calculateActivity(request: Omit<ActivityRequest, 'description' | 'location'>): Promise<ActivityResponse> {
    return this.request<ActivityResponse>('/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async logActivity(request: ActivityRequest): Promise<ActivityResponse> {
    return this.request<ActivityResponse>('/log', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getDailySummary(userId: string, date?: string): Promise<DailySummary> {
    const params = date ? `?date=${date}` : ''
    return this.request<DailySummary>(`/daily-summary/${userId}${params}`)
  }

  async getWeeklyTrends(userId: string): Promise<WeeklyTrends> {
    return this.request<WeeklyTrends>(`/weekly-trends/${userId}`)
  }

  async getActivities(): Promise<ActivitiesResponse> {
    return this.request<ActivitiesResponse>('/activities')
  }

  async getLeaderboard(): Promise<Leaderboard> {
    return this.request<Leaderboard>('/leaderboard')
  }

  async getSuggestions(userId?: string, category?: string): Promise<SuggestionsResponse> {
    const params = new URLSearchParams()
    if (userId) params.append('user_id', userId)
    if (category) params.append('category', category)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<SuggestionsResponse>(`/suggestions${query}`)
  }
}

export const carbonActivityApi = new CarbonActivityApi()
export default carbonActivityApi
