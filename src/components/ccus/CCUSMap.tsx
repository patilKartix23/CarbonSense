import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface StateData {
  depleted_oil_wells: number;
  saline_aquifers: number;
  coal_seams: number;
  total_capacity: number;
  active_projects?: string[];
  description?: string;
}

interface StorageLocation {
  name: string;
  lat: number;
  lng: number;
  data: StateData;
}

interface CCUSMapProps {
  stateData: Record<string, StateData>;
}

// Approximate coordinates for Indian states
const stateCoordinates: Record<string, { lat: number; lng: number }> = {
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 }
};

const MapCenterControl: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    // Set the view to center of India
    map.setView([20.5937, 78.9629], 5);
  }, [map]);
  
  return null;
};

const CCUSMap: React.FC<CCUSMapProps> = ({ stateData }) => {
  // Prepare location data
  const locations: StorageLocation[] = Object.entries(stateData)
    .filter(([stateName]) => stateCoordinates[stateName])
    .map(([stateName, data]) => ({
      name: stateName,
      lat: stateCoordinates[stateName].lat,
      lng: stateCoordinates[stateName].lng,
      data: data
    }));

  // Calculate radius based on capacity (for circle markers)
  const getRadius = (capacity: number) => {
    return Math.sqrt(capacity) * 0.8;
  };

  // Get color based on capacity
  const getColor = (capacity: number) => {
    if (capacity > 10000) return '#10b981'; // green
    if (capacity > 7000) return '#3b82f6'; // blue
    if (capacity > 5000) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapCenterControl />
        
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Circle markers for each state */}
        {locations.map((location) => (
          <CircleMarker
            key={location.name}
            center={[location.lat, location.lng]}
            radius={getRadius(location.data.total_capacity)}
            fillColor={getColor(location.data.total_capacity)}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.6}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2 text-blue-900">{location.name}</h3>
                
                {location.data.description && (
                  <p className="text-sm text-gray-600 mb-3 italic">{location.data.description}</p>
                )}
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">🛢️ Oil Wells:</span>
                    <span className="font-semibold">{location.data.depleted_oil_wells} MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">💧 Aquifers:</span>
                    <span className="font-semibold">{location.data.saline_aquifers} MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">⛽ Coal Seams:</span>
                    <span className="font-semibold">{location.data.coal_seams} MT</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-bold text-gray-900">Total Capacity:</span>
                    <span className="font-bold text-blue-600">{location.data.total_capacity} MT</span>
                  </div>
                </div>

                {location.data.active_projects && location.data.active_projects.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold text-green-700 mb-2">✓ Active Projects:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {location.data.active_projects.map((project, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-600 mr-1">•</span>
                          <span>{project}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Regular markers with labels */}
        {locations.map((location) => (
          <Marker
            key={`marker-${location.name}`}
            position={[location.lat, location.lng]}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold">{location.name}</p>
                <p className="text-sm text-gray-600">{location.data.total_capacity} MT</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CCUSMap;
