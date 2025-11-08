/**
 * API client for advocacy features
 */
import axios from 'axios';
import {
  Petition,
  ImpactStory,
  AdvocacyStats,
  PetitionSignRequest,
  PetitionFilters,
  StoryFilters,
  PetitionUpdate
} from '../types/advocacy';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const advocacyApi = axios.create({
  baseURL: `${API_URL}/api/v1/advocacy`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
advocacyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Petitions
export const getPetitions = async (filters?: PetitionFilters): Promise<Petition[]> => {
  const { data } = await advocacyApi.get('/petitions', { params: filters });
  return data;
};

export const getPetition = async (id: number): Promise<Petition> => {
  const { data } = await advocacyApi.get(`/petitions/${id}`);
  return data;
};

export const signPetition = async (
  petitionId: number,
  signRequest: PetitionSignRequest
): Promise<Petition> => {
  const { data } = await advocacyApi.post(`/petitions/${petitionId}/sign`, signRequest);
  return data;
};

export const getPetitionUpdates = async (petitionId: number): Promise<PetitionUpdate[]> => {
  const { data } = await advocacyApi.get(`/petitions/${petitionId}/updates`);
  return data;
};

export const getTrendingPetitions = async (limit: number = 10): Promise<Petition[]> => {
  const { data } = await advocacyApi.get('/trending', { params: { limit } });
  return data;
};

// Impact Stories
export const getImpactStories = async (filters?: StoryFilters): Promise<ImpactStory[]> => {
  const { data } = await advocacyApi.get('/stories', { params: filters });
  return data;
};

export const getImpactStory = async (id: number): Promise<ImpactStory> => {
  const { data } = await advocacyApi.get(`/stories/${id}`);
  return data;
};

export const likeStory = async (storyId: number): Promise<ImpactStory> => {
  const { data } = await advocacyApi.post(`/stories/${storyId}/like`);
  return data;
};

// Stats
export const getAdvocacyStats = async (): Promise<AdvocacyStats> => {
  const { data } = await advocacyApi.get('/stats');
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await advocacyApi.get('/categories');
  return data.categories;
};
