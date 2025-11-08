import apiClient from './client'
import { ClimateData } from '../types/climate'

export const climateAPI = {
  async getClimateData(lat: number, lon: number, days: number = 7): Promise<ClimateData> {
    try {
      const response = await apiClient.get('/climate/data', {
        params: { lat, lon, days }
      })
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock climate data')
      return {
        location: { lat, lon },
        date_range: { 
          start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        data: {
          current_weather: {
            coord: { lon, lat },
            weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
            main: { temp: 28.5, feels_like: 32.1, humidity: 68, pressure: 1013 },
            wind: { speed: 2.1, deg: 240 },
            name: lat === 12.9716 ? 'Bengaluru' : 'Unknown City'
          },
          historical_climate: {},
          air_quality: {
            coord: { lon, lat },
            list: [{
              main: { aqi: 3 },
              components: { pm2_5: 15.2, pm10: 25.8, no2: 18.5, o3: 45.2, so2: 2.1, co: 180.3, no: 12.5, nh3: 8.2 }
            }]
          },
          weather_forecast: { list: [], cod: '200', message: 0, cnt: 0 },
          processed_summary: {}
        },
        timestamp: new Date().toISOString()
      }
    }
  },

  async getCurrentWeather(lat: number, lon: number) {
    try {
      const response = await apiClient.get('/climate/current-weather', {
        params: { lat, lon }
      })
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock weather data')
      return {
        status: 'success',
        location: { lat, lon },
        weather: {
          coord: { lon, lat },
          weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
          main: { temp: 28.5, feels_like: 32.1, temp_min: 26.8, temp_max: 30.2, pressure: 1013, humidity: 68 },
          wind: { speed: 2.1, deg: 240 },
          clouds: { all: 75 },
          name: lat === 12.9716 ? 'Bengaluru' : 'Unknown City',
          sys: { country: 'IN', sunrise: 1692406920, sunset: 1692452340 }
        },
        timestamp: new Date().toISOString()
      }
    }
  },

  async getBengaluruWeather() {
    try {
      const response = await apiClient.get('/climate/bengaluru')
      console.log('✅ Real Bengaluru weather data loaded!')
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock Bengaluru data')
      return {
        status: 'success',
        city: 'Bengaluru',
        location: { lat: 12.9716, lon: 77.5946 },
        weather: {
          coord: { lon: 77.5946, lat: 12.9716 },
          weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04d' }],
          main: { temp: 28.5, feels_like: 32.1, temp_min: 26.8, temp_max: 30.2, pressure: 1013, humidity: 68 },
          wind: { speed: 2.1, deg: 240 },
          clouds: { all: 75 },
          name: 'Bengaluru',
          sys: { country: 'IN', sunrise: 1692406920, sunset: 1692452340 }
        },
        air_quality: {
          coord: { lon: 77.5946, lat: 12.9716 },
          list: [{
            main: { aqi: 3 },
            components: { pm2_5: 15.2, pm10: 25.8, no2: 18.5, o3: 45.2, so2: 2.1, co: 180.3, no: 12.5, nh3: 8.2 }
          }]
        },
        timestamp: new Date().toISOString()
      }
    }
  },

  async getAirQuality(lat: number, lon: number) {
    try {
      const response = await apiClient.get('/climate/air-quality', {
        params: { lat, lon }
      })
      return response.data
    } catch (error) {
      console.warn('Backend not available, using mock air quality data')
      return {
        status: 'success',
        location: { lat, lon },
        air_quality: {
          coord: { lon, lat },
          list: [{
            main: { aqi: 3 },
            components: { pm2_5: 15.2, pm10: 25.8, no2: 18.5, o3: 45.2, so2: 2.1, co: 180.3, no: 12.5, nh3: 8.2 }
          }]
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}
