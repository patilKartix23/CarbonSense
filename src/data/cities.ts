export interface City {
  id: string
  name: string
  state: string
  lat: number
  lon: number
  timezone: string
  population: number
  description: string
}

export const INDIAN_CITIES: City[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    timezone: 'Asia/Kolkata',
    population: 12639000,
    description: 'Silicon Valley of India - Tech hub with pleasant weather'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    timezone: 'Asia/Kolkata',
    population: 20411000,
    description: 'Financial capital - Bollywood and business center'
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    timezone: 'Asia/Kolkata',
    population: 32900000,
    description: 'Capital city - Political and cultural heart of India'
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    timezone: 'Asia/Kolkata',
    population: 14850000,
    description: 'City of Joy - Cultural capital with rich heritage'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lon: 80.2707,
    timezone: 'Asia/Kolkata',
    population: 11500000,
    description: 'Detroit of India - Major automotive and IT hub'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lon: 78.4867,
    timezone: 'Asia/Kolkata',
    population: 10500000,
    description: 'Cyberabad - IT and pharmaceutical industry center'
  }
]

export const getCityById = (id: string): City | undefined => {
  return INDIAN_CITIES.find(city => city.id === id)
}

export const getDefaultCity = (): City => {
  return INDIAN_CITIES[0] // Bengaluru as default
}
