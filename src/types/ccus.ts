// CCUS (Carbon Capture, Utilization and Storage) Type Definitions

export interface CCUSCaptureSimulation {
  annual_emissions_tonnes: number;
  capture_efficiency: number;
  capturable_co2_tonnes: number;
  remaining_emissions_tonnes: number;
  reduction_percentage: number;
}

export interface CCUSStorageSite {
  state: string;
  total_capacity_mt: number;
  storage_options: {
    depleted_oil_wells: number;
    saline_aquifers: number;
    coal_seams: number;
    total_capacity: number;
  };
  distance_factor: number;
  recommended: boolean;
}

export interface CCUSUtilizationPathway {
  pathway: string;
  description: string;
  utilizable_co2_tonnes: number;
  efficiency_percent: number;
  economics: string;
  capacity_factor: number;
  recommended: boolean;
}

export interface CCUSCarbonCredits {
  stored_co2_tonnes: number;
  credit_type: string;
  price_per_tonne_inr: number;
  total_value_inr: number;
  total_value_usd: number;
  annual_revenue_potential: number;
}

export interface CCUSRecommendation {
  type: 'capture' | 'storage' | 'utilization' | 'financial';
  priority: 'high' | 'medium' | 'low';
  message: string;
  action: string;
}

export interface CCUSComprehensiveAnalysis {
  input_data: {
    industry_type: string;
    annual_emissions_tonnes: number;
    state?: string;
    credit_type: string;
  };
  capture_analysis: CCUSCaptureSimulation;
  storage_options: CCUSStorageSite[];
  utilization_options: CCUSUtilizationPathway[];
  carbon_credits: CCUSCarbonCredits;
  recommendations: CCUSRecommendation[];
}

export interface IndustryType {
  industry_type: string;
  capture_efficiency_percent: number;
  description: string;
}

export interface IndiaStorageOverview {
  total_capacity_mt: number;
  states_covered: number;
  state_wise_data: Record<string, {
    depleted_oil_wells: number;
    saline_aquifers: number;
    coal_seams: number;
    total_capacity: number;
  }>;
  top_states: Array<[string, any]>;
}

// Policy and Mission Types
export interface PolicyAlignment {
  alignment_assessment: {
    target_year: number;
    india_target_capture_mt: number;
    project_annual_capture_mt: number;
    contribution_percentage: number;
    alignment_score: number;
    years_to_net_zero: number;
  };
  policy_incentives: {
    carbon_credit_eligibility: boolean;
    government_subsidy_eligible: boolean;
    priority_sector_status: boolean;
    estimated_incentive_value_inr: number;
  };
  recommendations: string[];
}

// Gamification Types
export interface UserCCUSScore {
  scores: {
    carbon_offset_score: number;
    awareness_score: number;
    action_score: number;
    total_score: number;
  };
  level_info: {
    level: number;
    level_name: string;
    current_score: number;
    level_threshold: number;
    progress_to_next: number;
  };
  achievements: Achievement[];
  next_milestone: {
    target_score: number;
    points_needed: number;
    estimated_actions: number;
    message?: string;
  };
}

export interface Achievement {
  type: string;
  level: number;
  title: string;
  description: string;
  earned_date: string;
}

// Educational Content Types
export interface EducationalModule {
  module_info: {
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration_minutes: number;
    suitable_for_level: string;
  };
  content: EducationalContent[];
  quiz_questions: QuizQuestion[];
  related_modules: string[];
}

export interface EducationalContent {
  type: string;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

// User Profile Types for CCUS
export interface CCUSUserProfile {
  category: 'individual' | 'educational_institution' | 'small_business' | 'industry' | 'government' | 'researcher';
  annual_emissions_tonnes?: number;
  interests: string[];
  engagement_level: 'low' | 'medium' | 'high';
  location_state?: string;
}

export interface PersonalizedRecommendations {
  user_category: string;
  personalized_recommendations: {
    immediate_actions: string[];
    medium_term_goals: string[];
    long_term_vision: string[];
    educational_content: string[];
    local_opportunities: string[];
  };
  priority_score: number;
  next_steps: string[];
}

// CCUS Simulation Input Types
export interface CCUSSimulationInput {
  industry_type: string;
  annual_emissions_tonnes: number;
  state?: string;
  credit_type?: string;
}

export interface CCUSStorageInput {
  co2_tonnes: number;
  state?: string;
}

export interface CCUSUtilizationInput {
  co2_tonnes: number;
}

export interface CCUSCarbonCreditsInput {
  stored_co2_tonnes: number;
  credit_type?: string;
}

// API Response Types
export interface CCUSApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CCUSCaptureResponse extends CCUSApiResponse<{
  capture_simulation: CCUSCaptureSimulation;
  available_industries: string[];
}> {}

export interface CCUSStorageResponse extends CCUSApiResponse<{
  co2_amount_tonnes: number;
  storage_suggestions: CCUSStorageSite[];
  total_sites_available: number;
}> {}

export interface CCUSUtilizationResponse extends CCUSApiResponse<{
  co2_amount_tonnes: number;
  utilization_pathways: CCUSUtilizationPathway[];
  recommended_pathways: CCUSUtilizationPathway[];
}> {}

export interface CCUSCreditsResponse extends CCUSApiResponse<{
  carbon_credits: CCUSCarbonCredits;
  available_credit_types: string[];
}> {}

export interface CCUSComprehensiveResponse extends CCUSApiResponse<CCUSComprehensiveAnalysis> {}

export interface CCUSOverviewResponse extends CCUSApiResponse<{
  india_storage_overview: IndiaStorageOverview;
}> {}

export interface CCUSIndustriesResponse extends CCUSApiResponse<{
  supported_industries: IndustryType[];
}> {}

// Leaderboard Types for CCUS
export interface CCUSLeaderboardEntry {
  user_id: string;
  username: string;
  category: string;
  total_co2_offset_tonnes: number;
  total_score: number;
  level_name: string;
  achievements_count: number;
  city?: string;
  state?: string;
}

export interface CCUSLeaderboard {
  category: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: CCUSLeaderboardEntry[];
  user_rank?: number;
  total_participants: number;
}

// Map Integration Types
export interface CCUSMapLocation {
  id: string;
  name: string;
  type: 'storage_site' | 'industry' | 'research_facility' | 'pilot_project';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  state: string;
  capacity_mt?: number;
  status: 'operational' | 'planned' | 'under_development';
  description: string;
  storage_types?: string[];
  industry_type?: string;
  annual_emissions?: number;
  capture_rate?: number;
}

export interface CCUSMapData {
  storage_sites: CCUSMapLocation[];
  industries: CCUSMapLocation[];
  research_facilities: CCUSMapLocation[];
  pilot_projects: CCUSMapLocation[];
}

// Progress Tracking Types
export interface CCUSProgressMetrics {
  personal_offset_tonnes: number;
  actions_completed: number;
  modules_completed: number;
  quiz_scores: Record<string, number>;
  recommendations_implemented: number;
  community_contributions: number;
  monthly_progress: Array<{
    month: string;
    offset_tonnes: number;
    actions: number;
    score: number;
  }>;
}

export interface CCUSActivityLog {
  id: string;
  user_id: string;
  activity_type: 'education' | 'simulation' | 'recommendation' | 'quiz' | 'sharing';
  activity_name: string;
  points_earned: number;
  co2_impact_tonnes?: number;
  timestamp: string;
  details: Record<string, any>;
}
