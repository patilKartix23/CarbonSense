export interface CarbonFootprintRequest {
  transportation?: Record<string, number>
  energy?: Record<string, number>
  consumption?: Record<string, number>
  location?: string
  save_to_profile?: boolean
}

export interface CarbonFootprintResult {
  daily_footprint_kg_co2: number
  daily_footprint_lbs_co2: number
  annual_estimate_tons_co2: number
  breakdown: {
    transportation: {
      total_kg_co2: number
      details: Record<string, number>
    }
    energy: {
      total_kg_co2: number
      details: Record<string, number>
    }
    consumption: {
      total_kg_co2: number
      details: Record<string, number>
    }
  }
}

export interface CarbonRecommendation {
  category: string
  tip: string
  impact: string
  difficulty: 'easy' | 'medium' | 'hard'
  personalized?: boolean
}

export interface CarbonComparison {
  vs_average_user: {
    percentage: number
    status: 'better' | 'worse' | 'similar'
  }
  vs_national_average: {
    percentage: number
    status: 'better' | 'worse' | 'similar'
  }
}

export interface CarbonLog {
  id: string
  date: string
  daily_footprint_kg_co2: number
  annual_estimate_tons_co2: number
  transportation_data: Record<string, number>
  energy_data: Record<string, number>
  consumption_data: Record<string, number>
  location?: string
  notes?: string
}

export interface CarbonStats {
  total_logs: number
  average_daily_kg_co2: number
  lowest_daily_kg_co2: number
  highest_daily_kg_co2: number
  total_tracked_kg_co2: number
  estimated_annual_tons_co2: number
}
