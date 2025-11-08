import { useState, useEffect } from 'react'
import { climateAPI } from '../api/climate'

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  feelsLike: number
  cityName: string
  country: string
  icon: string
}

interface AirQualityData {
  aqi: number
  pm25: number
  pm10: number
  no2: number
  o3: number
  category: string
  color: string
}

export const useWeather = (lat?: number, lon?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAQICategory = (aqi: number) => {
    if (aqi === 1) return { category: 'Good', color: 'green' }
    if (aqi === 2) return { category: 'Fair', color: 'yellow' }
    if (aqi === 3) return { category: 'Moderate', color: 'orange' }
    if (aqi === 4) return { category: 'Poor', color: 'red' }
    if (aqi === 5) return { category: 'Very Poor', color: 'purple' }
    return { category: 'Unknown', color: 'gray' }
  }

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!lat || !lon) return

      try {
        setLoading(true)
        setError(null)

        // For Bengaluru, use the dedicated endpoint
        if (Math.abs(lat - 12.9716) < 0.01 && Math.abs(lon - 77.5946) < 0.01) {
          const bengaluruData = await climateAPI.getBengaluruWeather()
          
          if (bengaluruData.weather) {
            const w = bengaluruData.weather
            setWeather({
              temperature: Math.round(w.main.temp),
              description: w.weather[0]?.description || 'Unknown',
              humidity: w.main.humidity,
              windSpeed: w.wind.speed,
              pressure: w.main.pressure,
              feelsLike: Math.round(w.main.feels_like),
              cityName: w.name || 'Bengaluru',
              country: w.sys?.country || 'IN',
              icon: w.weather[0]?.icon || '01d'
            })
          }

          if (bengaluruData.air_quality?.list?.[0]) {
            const aq = bengaluruData.air_quality.list[0]
            const { category, color } = getAQICategory(aq.main.aqi)
            setAirQuality({
              aqi: aq.main.aqi,
              pm25: aq.components.pm2_5,
              pm10: aq.components.pm10,
              no2: aq.components.no2,
              o3: aq.components.o3,
              category,
              color
            })
          }
        } else {
          // For other locations, use general endpoints
          const [weatherData, airQualityData] = await Promise.all([
            climateAPI.getCurrentWeather(lat, lon),
            climateAPI.getAirQuality(lat, lon)
          ])

          if (weatherData.weather) {
            const w = weatherData.weather
            setWeather({
              temperature: Math.round(w.main.temp),
              description: w.weather[0]?.description || 'Unknown',
              humidity: w.main.humidity,
              windSpeed: w.wind.speed,
              pressure: w.main.pressure,
              feelsLike: Math.round(w.main.feels_like),
              cityName: w.name || 'Unknown',
              country: w.sys?.country || '',
              icon: w.weather[0]?.icon || '01d'
            })
          }

          if (airQualityData.air_quality?.list?.[0]) {
            const aq = airQualityData.air_quality.list[0]
            const { category, color } = getAQICategory(aq.main.aqi)
            setAirQuality({
              aqi: aq.main.aqi,
              pm25: aq.components.pm2_5,
              pm10: aq.components.pm10,
              no2: aq.components.no2,
              o3: aq.components.o3,
              category,
              color
            })
          }
        }
      } catch (err) {
        console.error('Error fetching weather data:', err)
        setError('Failed to fetch weather data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [lat, lon])

  return { weather, airQuality, loading, error }
}
