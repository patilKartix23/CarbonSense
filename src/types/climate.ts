export interface ClimateData {
  location: {
    lat: number
    lon: number
  }
  date_range: {
    start: string
    end: string
  }
  data: {
    historical_climate: any
    air_quality: AirQualityData
    weather_forecast: WeatherForecast
    processed_summary: any
  }
  timestamp: string
}

export interface AirQualityData {
  coord: {
    lon: number
    lat: number
  }
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
    dt: number
  }>
}

export interface WeatherForecast {
  cod: string
  message: number
  cnt: number
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    clouds: {
      all: number
    }
    wind: {
      speed: number
      deg: number
    }
    visibility: number
    pop: number
    dt_txt: string
  }>
}

export interface ClimateAlert {
  type: string
  severity: 'low' | 'moderate' | 'high'
  title: string
  message: string
  timestamp: string
}
