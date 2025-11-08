import apiClient from './client';

export interface IndianCityWeather {
  city: string;
  state: string;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  pressure: number;
}

export interface MonthlyTrends {
  temperature: { [month: number]: number };
  humidity: { [month: number]: number };
  rainfall: { [month: number]: number };
}

export interface RegionalSummary {
  [state: string]: {
    avg_temperature: number;
    avg_humidity: number;
    total_rainfall: number;
    cities_count: number;
  };
}

export interface IndianClimateData {
  cities_overview: IndianCityWeather[];
  monthly_trends: MonthlyTrends;
  current_conditions: {
    avg_temperature: number;
    avg_humidity: number;
    total_rainfall: number;
    date: string;
  };
  regional_summary: RegionalSummary;
}

export interface CityDetailWeather {
  city: string;
  state: string;
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    wind_speed: number;
    pressure: number;
  };
  historical: {
    avg_temperature: number;
    max_temperature: number;
    min_temperature: number;
    total_rainfall: number;
  };
}

export const indianClimateAPI = {
  // Get complete Indian climate overview
  async getIndiaOverview(): Promise<IndianClimateData> {
    try {
      const response = await apiClient.get('/climate/india/overview');
      return response.data.data;
    } catch (error) {
      console.warn('Backend not available, using mock Indian climate data');
      return this.getMockIndianData();
    }
  },

  // Get all Indian cities weather data
  async getIndianCities(): Promise<IndianCityWeather[]> {
    try {
      const response = await apiClient.get('/climate/india/cities');
      return response.data.cities;
    } catch (error) {
      console.warn('Backend not available, using mock cities data');
      return this.getMockCitiesData();
    }
  },

  // Get detailed weather for a specific city
  async getCityWeather(cityName: string): Promise<CityDetailWeather> {
    try {
      const response = await apiClient.get(`/climate/india/city/${cityName}`);
      return response.data.city_data;
    } catch (error) {
      console.warn(`Backend not available, using mock data for ${cityName}`);
      return this.getMockCityData(cityName);
    }
  },

  // Get regional summary by states
  async getRegionalData(): Promise<RegionalSummary> {
    try {
      const response = await apiClient.get('/climate/india/regions');
      return response.data.regions;
    } catch (error) {
      console.warn('Backend not available, using mock regional data');
      return this.getMockRegionalData();
    }
  },

  // Get monthly climate trends
  async getMonthlyTrends(): Promise<MonthlyTrends> {
    try {
      const response = await apiClient.get('/climate/india/trends');
      return response.data.trends;
    } catch (error) {
      console.warn('Backend not available, using mock trends data');
      return this.getMockTrendsData();
    }
  },

  // Get current conditions summary
  async getCurrentConditions(): Promise<{ avg_temperature: number; avg_humidity: number; total_rainfall: number; date: string }> {
    try {
      const response = await apiClient.get('/climate/india/current');
      return response.data.current;
    } catch (error) {
      console.warn('Backend not available, using mock current conditions');
      return this.getMockCurrentConditions();
    }
  },

  // Initialize the Indian weather service
  async initializeService(): Promise<boolean> {
    try {
      const response = await apiClient.post('/climate/india/initialize');
      return response.data.initialized;
    } catch (error) {
      console.warn('Could not initialize Indian weather service');
      return false;
    }
  },

  // Mock data methods for offline functionality
  getMockIndianData(): IndianClimateData {
    return {
      cities_overview: this.getMockCitiesData(),
      monthly_trends: this.getMockTrendsData(),
      current_conditions: this.getMockCurrentConditions(),
      regional_summary: this.getMockRegionalData()
    };
  },

  getMockCitiesData(): IndianCityWeather[] {
    return [
      { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, temperature: 32.5, humidity: 78, rainfall: 12.5, wind_speed: 15.2, pressure: 1008 },
      { city: 'Delhi', state: 'Delhi', lat: 28.7041, lon: 77.1025, temperature: 38.2, humidity: 62, rainfall: 2.1, wind_speed: 8.5, pressure: 1015 },
      { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946, temperature: 26.8, humidity: 65, rainfall: 5.8, wind_speed: 12.1, pressure: 1012 },
      { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, temperature: 34.1, humidity: 82, rainfall: 15.2, wind_speed: 18.7, pressure: 1009 },
      { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, temperature: 35.6, humidity: 85, rainfall: 18.9, wind_speed: 14.3, pressure: 1007 },
      { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, temperature: 29.4, humidity: 68, rainfall: 8.3, wind_speed: 11.8, pressure: 1013 },
      { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, temperature: 31.7, humidity: 72, rainfall: 9.6, wind_speed: 13.5, pressure: 1010 },
      { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, temperature: 40.2, humidity: 58, rainfall: 1.8, wind_speed: 9.2, pressure: 1017 },
      { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, temperature: 42.1, humidity: 45, rainfall: 0.5, wind_speed: 7.8, pressure: 1018 },
      { city: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673, temperature: 28.9, humidity: 88, rainfall: 22.4, wind_speed: 16.9, pressure: 1006 }
    ];
  },

  getMockCityData(cityName: string): CityDetailWeather {
    const mockCities: { [key: string]: CityDetailWeather } = {
      'Mumbai': {
        city: 'Mumbai',
        state: 'Maharashtra',
        current: { temperature: 32.5, humidity: 78, rainfall: 12.5, wind_speed: 15.2, pressure: 1008 },
        historical: { avg_temperature: 28.5, max_temperature: 38.2, min_temperature: 22.1, total_rainfall: 2547.8 }
      },
      'Delhi': {
        city: 'Delhi',
        state: 'Delhi',
        current: { temperature: 38.2, humidity: 62, rainfall: 2.1, wind_speed: 8.5, pressure: 1015 },
        historical: { avg_temperature: 25.8, max_temperature: 45.6, min_temperature: 5.2, total_rainfall: 714.2 }
      },
      'Bangalore': {
        city: 'Bangalore',
        state: 'Karnataka',
        current: { temperature: 26.8, humidity: 65, rainfall: 5.8, wind_speed: 12.1, pressure: 1012 },
        historical: { avg_temperature: 24.2, max_temperature: 32.5, min_temperature: 15.8, total_rainfall: 924.3 }
      }
    };

    return mockCities[cityName] || {
      city: cityName,
      state: 'Unknown',
      current: { temperature: 30, humidity: 70, rainfall: 5, wind_speed: 10, pressure: 1013 },
      historical: { avg_temperature: 28, max_temperature: 35, min_temperature: 20, total_rainfall: 800 }
    };
  },

  getMockTrendsData(): MonthlyTrends {
    return {
      temperature: {
        1: 22.5, 2: 25.2, 3: 29.8, 4: 34.1, 5: 37.2, 6: 32.8,
        7: 29.5, 8: 28.9, 9: 30.2, 10: 28.7, 11: 25.1, 12: 23.4
      },
      humidity: {
        1: 65, 2: 62, 3: 58, 4: 55, 5: 62, 6: 78,
        7: 85, 8: 87, 9: 82, 10: 75, 11: 68, 12: 67
      },
      rainfall: {
        1: 2.5, 2: 1.8, 3: 4.2, 4: 8.5, 5: 45.2, 6: 165.8,
        7: 287.5, 8: 245.3, 9: 125.7, 10: 48.2, 11: 12.8, 12: 5.1
      }
    };
  },

  getMockCurrentConditions() {
    return {
      avg_temperature: 31.2,
      avg_humidity: 72.5,
      total_rainfall: 8.7,
      date: new Date().toISOString()
    };
  },

  getMockRegionalData(): RegionalSummary {
    return {
      'Maharashtra': { avg_temperature: 30.5, avg_humidity: 74, total_rainfall: 1247.5, cities_count: 5 },
      'Karnataka': { avg_temperature: 26.8, avg_humidity: 68, total_rainfall: 924.3, cities_count: 3 },
      'Tamil Nadu': { avg_temperature: 29.2, avg_humidity: 78, total_rainfall: 1156.8, cities_count: 4 },
      'Delhi': { avg_temperature: 25.8, avg_humidity: 62, total_rainfall: 714.2, cities_count: 1 },
      'West Bengal': { avg_temperature: 27.5, avg_humidity: 82, total_rainfall: 1456.7, cities_count: 2 },
      'Gujarat': { avg_temperature: 32.1, avg_humidity: 58, total_rainfall: 524.3, cities_count: 3 },
      'Rajasthan': { avg_temperature: 31.8, avg_humidity: 48, total_rainfall: 312.5, cities_count: 2 },
      'Kerala': { avg_temperature: 28.2, avg_humidity: 86, total_rainfall: 2845.2, cities_count: 3 },
      'Telangana': { avg_temperature: 28.9, avg_humidity: 68, total_rainfall: 856.4, cities_count: 1 },
      'Uttar Pradesh': { avg_temperature: 26.5, avg_humidity: 65, total_rainfall: 987.6, cities_count: 4 }
    };
  }
};