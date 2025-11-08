/**
 * TypeScript types for advocacy features
 */

export interface Petition {
  id: number;
  title: string;
  description: string;
  target: string;
  category: string;
  country?: string;
  state?: string;
  city?: string;
  is_global: boolean;
  latitude?: number;
  longitude?: number;
  organization_name: string;
  organization_verified: boolean;
  organization_logo_url?: string;
  goal_signatures: number;
  current_signatures: number;
  deadline?: string;
  status: string;
  victory: boolean;
  victory_description?: string;
  decision_maker_response?: string;
  image_url?: string;
  external_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  trending_score?: number;
  user_signed?: boolean;
}

export interface PetitionUpdate {
  id: number;
  petition_id: number;
  title: string;
  content: string;
  milestone: boolean;
  signatures_at_time: number;
  created_at: string;
}

export interface ImpactStory {
  id: number;
  title: string;
  subtitle?: string;
  story_type: string;
  content: string;
  summary: string;
  featured_image_url?: string;
  video_url?: string;
  gallery_urls?: string[];
  featured_person_name?: string;
  featured_person_title?: string;
  featured_person_photo_url?: string;
  organization_name?: string;
  country?: string;
  location_description?: string;
  impact_metrics?: { [key: string]: any };
  category: string;
  tags?: string[];
  related_petition_id?: number;
  views: number;
  likes: number;
  shares: number;
  publish_date: string;
  created_at: string;
  updated_at: string;
  read_time_minutes: number;
  user_liked?: boolean;
  featured: boolean;
}

export interface AdvocacyStats {
  total_petitions: number;
  active_petitions: number;
  victories: number;
  total_signatures: number;
  user_signatures: number;
  user_advocacy_points: number;
  stories_read: number;
  impact_stories_count: number;
}

export interface PetitionSignRequest {
  comment?: string;
  share_name_publicly: boolean;
}

export interface PetitionFilters {
  category?: string;
  country?: string;
  status?: string;
  is_global?: boolean;
  victory?: boolean;
  search?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

export interface StoryFilters {
  story_type?: string;
  category?: string;
  country?: string;
  featured?: boolean;
  search?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
}
