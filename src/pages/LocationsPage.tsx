import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { apiService, Location } from '../utils/api';
import StatusBar from '../components/StatusBar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default center (Tashkent, Uzbekistan)
  const defaultCenter: [number, number] = [41.2995, 69.2401];

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const locationsData = await apiService.getLocations();
      setLocations(locationsData);
    } catch (err: any) {
      console.error('Error loading locations:', err);
      setError(err.message || 'Failed to load locations');
      // Set mock data for demo
      setLocations([
        {
          id: 1,
          name: 'Korzinka - Amore',
          address: 'Amir Temur Ave, Tashkent',
          latitude: 41.2995,
          longitude: 69.2401,
        },
        {
          id: 2,
          name: 'Korzinka - Beruniy',
          address: 'Beruniy St, Tashkent',
          latitude: 41.3111,
          longitude: 69.2797,
        },
        {
          id: 3,
          name: 'Korzinka Mahalla',
          address: 'Shota Rustaveli St, Tashkent',
          latitude: 41.2856,
          longitude: 69.2034,
        },
        {
          id: 4,
          name: 'Korzinka - Chirchik',
          address: 'Chirchik City Center',
          latitude: 41.4689,
          longitude: 69.5828,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <StatusBar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Store Locations</h1>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            Using demo data. {error}
          </div>
        )}

        <div className="map-container">
          <MapContainer
            center={defaultCenter}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
              >
                <Popup>
                  <div>
                    <strong>{location.name}</strong>
                    <br />
                    {location.address}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {locations.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📍</div>
            <div className="empty-state-text">No stores found</div>
          </div>
        )}
      </div>
    </>
  );
}


