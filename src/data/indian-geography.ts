export interface IndianCity {
  name: string;
  state: string;
  lat: number;
  lon: number;
  population?: number;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
}

export interface IndianState {
  name: string;
  code: string;
  capital: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  area: number; // in sq km
  coordinates: {
    lat: number;
    lon: number;
  };
}

export const INDIAN_CITIES: IndianCity[] = [
  // Major Metropolitan Cities
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, population: 12442373, zone: 'West' },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lon: 77.1025, population: 11034555, zone: 'North' },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946, population: 8443675, zone: 'South' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, population: 6993262, zone: 'South' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, population: 4646732, zone: 'South' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, population: 4496694, zone: 'East' },
  
  // Tier 1 Cities
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, population: 3124458, zone: 'West' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, population: 5570585, zone: 'West' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, population: 3046163, zone: 'North' },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311, population: 4467797, zone: 'West' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, population: 2817105, zone: 'North' },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319, population: 2767031, zone: 'North' },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, population: 2405421, zone: 'Central' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, population: 1964086, zone: 'Central' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185, population: 1730320, zone: 'South' },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, population: 1684222, zone: 'East' },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lon: 73.1812, population: 1666703, zone: 'West' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lon: 77.4538, population: 1636068, zone: 'North' },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, population: 1618879, zone: 'North' },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081, population: 1585704, zone: 'North' },
  
  // State Capitals and Important Cities
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lon: 76.9366, population: 957730, zone: 'South' },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lon: 85.8245, population: 837737, zone: 'East' },
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lon: 76.7794, population: 1055450, zone: 'North' },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673, population: 677381, zone: 'South' },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, population: 1061447, zone: 'South' },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362, population: 963429, zone: 'Northeast' },
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lon: 78.0322, population: 578420, zone: 'North' },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734, population: 169758, zone: 'North' },
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lon: 88.6065, population: 100286, zone: 'Northeast' },
  { name: 'Panaji', state: 'Goa', lat: 15.4909, lon: 73.8278, population: 114405, zone: 'West' },
  
  // Tourist and Climate Important Cities
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2396, lon: 77.1887, population: 8096, zone: 'North' },
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.0360, lon: 88.2627, population: 118805, zone: 'East' },
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4064, lon: 76.6932, population: 88430, zone: 'South' },
  { name: 'Udaipur', state: 'Rajasthan', lat: 25.2968, lon: 73.0310, population: 451735, zone: 'West' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, population: 1198491, zone: 'North' },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lon: 74.8723, population: 1132761, zone: 'North' },
  { name: 'Mysore', state: 'Karnataka', lat: 12.2958, lon: 76.6394, population: 920550, zone: 'South' },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, population: 1561129, zone: 'South' }
];

export const INDIAN_STATES: IndianState[] = [
  // Northern States
  { name: 'Delhi', code: 'DL', capital: 'New Delhi', zone: 'North', area: 1484, coordinates: { lat: 28.7041, lon: 77.1025 } },
  { name: 'Punjab', code: 'PB', capital: 'Chandigarh', zone: 'North', area: 50362, coordinates: { lat: 31.1471, lon: 75.3412 } },
  { name: 'Haryana', code: 'HR', capital: 'Chandigarh', zone: 'North', area: 44212, coordinates: { lat: 29.0588, lon: 76.0856 } },
  { name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow', zone: 'North', area: 240928, coordinates: { lat: 26.8467, lon: 80.9462 } },
  { name: 'Uttarakhand', code: 'UT', capital: 'Dehradun', zone: 'North', area: 53483, coordinates: { lat: 30.0668, lon: 79.0193 } },
  { name: 'Himachal Pradesh', code: 'HP', capital: 'Shimla', zone: 'North', area: 55673, coordinates: { lat: 31.1048, lon: 77.1734 } },
  { name: 'Jammu and Kashmir', code: 'JK', capital: 'Srinagar', zone: 'North', area: 222236, coordinates: { lat: 34.0837, lon: 74.7973 } },
  { name: 'Rajasthan', code: 'RJ', capital: 'Jaipur', zone: 'North', area: 342239, coordinates: { lat: 27.0238, lon: 74.2179 } },
  
  // Western States
  { name: 'Maharashtra', code: 'MH', capital: 'Mumbai', zone: 'West', area: 307713, coordinates: { lat: 19.7515, lon: 75.7139 } },
  { name: 'Gujarat', code: 'GJ', capital: 'Gandhinagar', zone: 'West', area: 196244, coordinates: { lat: 22.2587, lon: 71.1924 } },
  { name: 'Goa', code: 'GA', capital: 'Panaji', zone: 'West', area: 3702, coordinates: { lat: 15.2993, lon: 74.1240 } },
  
  // Southern States
  { name: 'Karnataka', code: 'KA', capital: 'Bangalore', zone: 'South', area: 191791, coordinates: { lat: 15.3173, lon: 75.7139 } },
  { name: 'Tamil Nadu', code: 'TN', capital: 'Chennai', zone: 'South', area: 130058, coordinates: { lat: 11.1271, lon: 78.6569 } },
  { name: 'Kerala', code: 'KL', capital: 'Thiruvananthapuram', zone: 'South', area: 38852, coordinates: { lat: 10.8505, lon: 76.2711 } },
  { name: 'Andhra Pradesh', code: 'AP', capital: 'Amaravati', zone: 'South', area: 162968, coordinates: { lat: 15.9129, lon: 79.7400 } },
  { name: 'Telangana', code: 'TG', capital: 'Hyderabad', zone: 'South', area: 112077, coordinates: { lat: 18.1124, lon: 79.0193 } },
  
  // Eastern States
  { name: 'West Bengal', code: 'WB', capital: 'Kolkata', zone: 'East', area: 88752, coordinates: { lat: 22.9868, lon: 87.8550 } },
  { name: 'Odisha', code: 'OR', capital: 'Bhubaneswar', zone: 'East', area: 155707, coordinates: { lat: 20.9517, lon: 85.0985 } },
  { name: 'Jharkhand', code: 'JH', capital: 'Ranchi', zone: 'East', area: 79714, coordinates: { lat: 23.6102, lon: 85.2799 } },
  { name: 'Bihar', code: 'BR', capital: 'Patna', zone: 'East', area: 94163, coordinates: { lat: 25.0961, lon: 85.3131 } },
  
  // Central States
  { name: 'Madhya Pradesh', code: 'MP', capital: 'Bhopal', zone: 'Central', area: 308245, coordinates: { lat: 22.9734, lon: 78.6569 } },
  { name: 'Chhattisgarh', code: 'CG', capital: 'Raipur', zone: 'Central', area: 135192, coordinates: { lat: 21.2787, lon: 81.8661 } },
  
  // Northeastern States
  { name: 'Assam', code: 'AS', capital: 'Dispur', zone: 'Northeast', area: 78438, coordinates: { lat: 26.2006, lon: 92.9376 } },
  { name: 'Arunachal Pradesh', code: 'AR', capital: 'Itanagar', zone: 'Northeast', area: 83743, coordinates: { lat: 28.2180, lon: 94.7278 } },
  { name: 'Manipur', code: 'MN', capital: 'Imphal', zone: 'Northeast', area: 22327, coordinates: { lat: 24.6637, lon: 93.9063 } },
  { name: 'Meghalaya', code: 'ML', capital: 'Shillong', zone: 'Northeast', area: 22429, coordinates: { lat: 25.4670, lon: 91.3662 } },
  { name: 'Mizoram', code: 'MZ', capital: 'Aizawl', zone: 'Northeast', area: 21081, coordinates: { lat: 23.1645, lon: 92.9376 } },
  { name: 'Nagaland', code: 'NL', capital: 'Kohima', zone: 'Northeast', area: 16579, coordinates: { lat: 26.1584, lon: 94.5624 } },
  { name: 'Tripura', code: 'TR', capital: 'Agartala', zone: 'Northeast', area: 10486, coordinates: { lat: 23.9408, lon: 91.9882 } },
  { name: 'Sikkim', code: 'SK', capital: 'Gangtok', zone: 'Northeast', area: 7096, coordinates: { lat: 27.5330, lon: 88.5122 } }
];

export const INDIA_BOUNDS = {
  north: 37.6,
  south: 6.4,
  east: 97.25,
  west: 68.7
};

export const CLIMATE_ZONES = {
  'Tropical Wet': {
    description: 'High rainfall, high humidity, warm temperatures year-round',
    regions: ['Kerala', 'coastal Karnataka', 'Western Ghats'],
    characteristics: ['Heavy monsoons', 'High humidity', 'Dense forests']
  },
  'Tropical Wet and Dry': {
    description: 'Distinct wet and dry seasons, moderate to high temperatures',
    regions: ['Most of peninsular India', 'Central India'],
    characteristics: ['Monsoon rains', 'Dry winters', 'Deciduous forests']
  },
  'Tropical Semi-arid': {
    description: 'Low rainfall, hot temperatures, dry climate',
    regions: ['Rajasthan', 'parts of Gujarat', 'Deccan plateau'],
    characteristics: ['Scanty rainfall', 'High temperatures', 'Desert vegetation']
  },
  'Humid Subtropical': {
    description: 'Hot summers, mild winters, moderate rainfall',
    regions: ['Northern plains', 'parts of central India'],
    characteristics: ['Hot summers', 'Cool winters', 'Monsoon dependency']
  },
  'Mountain Climate': {
    description: 'Cool temperatures, varied precipitation, altitude dependent',
    regions: ['Himalayas', 'Western Ghats peaks', 'Nilgiris'],
    characteristics: ['Cool temperatures', 'Snow in winter', 'Alpine vegetation']
  }
};

// Helper functions
export const getCitiesByState = (stateName: string): IndianCity[] => {
  return INDIAN_CITIES.filter(city => city.state === stateName);
};

export const getCitiesByZone = (zone: string): IndianCity[] => {
  return INDIAN_CITIES.filter(city => city.zone === zone);
};

export const getStatesByZone = (zone: string): IndianState[] => {
  return INDIAN_STATES.filter(state => state.zone === zone);
};

export const findCityByName = (name: string): IndianCity | undefined => {
  return INDIAN_CITIES.find(city => 
    city.name.toLowerCase() === name.toLowerCase()
  );
};

export const findStateByName = (name: string): IndianState | undefined => {
  return INDIAN_STATES.find(state => 
    state.name.toLowerCase() === name.toLowerCase()
  );
};