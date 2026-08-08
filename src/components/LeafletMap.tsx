import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Car, Compass, Layers, Maximize2, ShieldCheck, Zap } from 'lucide-react';

interface LeafletMapProps {
  startCoords?: [number, number];
  destCoords?: [number, number];
  startLocationName?: string;
  destLocationName?: string;
  interactive?: boolean;
  showVehicleSimulation?: boolean;
  vehicleModel?: string;
  driverName?: string;
  height?: string;
  onLocationSelect?: (coords: [number, number], name: string) => void;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

// Comprehensive Kolkata Geocoding Lookup Table
export function getKolkataGeoCoords(name: string, fallback: [number, number]): [number, number] {
  if (!name) return fallback;
  const str = name.toLowerCase().trim();
  if (str.includes('ballygunge')) return [22.5280, 88.3650];
  if (str.includes('bally')) return [22.6500, 88.3400];
  if (str.includes('dankuni')) return [22.6842, 88.2917];
  if (str.includes('howrah')) return [22.5892, 88.3431];
  if (str.includes('park street') || str.includes('park st')) return [22.5510, 88.3524];
  if (str.includes('sector v') || str.includes('salt lake') || str.includes('tech hub')) return [22.5804, 88.4378];
  if (str.includes('new town') || str.includes('eco space') || str.includes('action area')) return [22.5851, 88.4807];
  if (str.includes('rajarhat')) return [22.6200, 88.5100];
  if (str.includes('gariahat')) return [22.5186, 88.3653];
  if (str.includes('shyambazar')) return [22.6030, 88.3713];
  if (str.includes('science city')) return [22.5448, 88.3920];
  if (str.includes('chingrighata') || str.includes('em bypass')) return [22.5690, 88.4050];
  if (str.includes('dum dum') || str.includes('dumdum')) return [22.6450, 88.4300];
  if (str.includes('airport') || str.includes('ccu')) return [22.6547, 88.4467];
  if (str.includes('behala')) return [22.4988, 88.3186];
  if (str.includes('alipore')) return [22.5312, 88.3275];
  if (str.includes('sealdah')) return [22.5670, 88.3711];
  if (str.includes('esplanade')) return [22.5645, 88.3517];
  if (str.includes('jadavpur')) return [22.4955, 88.3709];
  if (str.includes('tollygunge')) return [22.5009, 88.3444];
  if (str.includes('barasat')) return [22.7230, 88.4820];
  if (str.includes('barrackpore')) return [22.7600, 88.3700];
  if (str.includes('ultadanga')) return [22.5970, 88.3920];
  if (str.includes('ruby')) return [22.5130, 88.3990];
  if (str.includes('kasba')) return [22.5150, 88.3850];
  if (str.includes('kalighat')) return [22.5200, 88.3450];
  if (str.includes('khidirpur')) return [22.5350, 88.3250];
  if (str.includes('dakshineswar')) return [22.6550, 88.3570];
  if (str.includes('kankurgachi')) return [22.5780, 88.3880];
  if (str.includes('panihati')) return [22.6950, 88.3750];

  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 1000) / 1000) * 0.12 - 0.06;
  const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000) * 0.12 - 0.06;
  return [22.5650 + latOffset, 88.3800 + lngOffset];
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  startCoords: initialStartCoords,
  destCoords: initialDestCoords,
  startLocationName = 'Park Street, Kolkata',
  destLocationName = 'Sector V, Salt Lake, Kolkata',
  interactive = true,
  showVehicleSimulation = false,
  vehicleModel = 'Swift Dzire',
  driverName = 'Raj Patel',
  height = '420px',
  onLocationSelect,
  className = '',
}) => {
  const startCoords = initialStartCoords || getKolkataGeoCoords(startLocationName, [22.5510, 88.3524]);
  const destCoords = initialDestCoords || getKolkataGeoCoords(destLocationName, [22.5804, 88.4378]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const [simProgress, setSimProgress] = useState(0.35); // 35% along journey
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Generate exact intermediate waypoint coordinates connecting start and destination
  const generateRouteWaypoints = (start: [number, number], end: [number, number]) => {
    const mid1: [number, number] = [
      (start[0] * 2 + end[0]) / 3 + 0.004,
      (start[1] * 2 + end[1]) / 3 + 0.006,
    ];
    const mid2: [number, number] = [
      (start[0] + end[0] * 2) / 3 - 0.003,
      (start[1] + end[1] * 2) / 3 + 0.004,
    ];
    return [start, mid1, mid2, end];
  };


  // Interpolate position along route
  const getInterpolatedPoint = (waypoints: [number, number][], progress: number): [number, number] => {
    const totalSegments = waypoints.length - 1;
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    return [
      p1[0] + (p2[0] - p1[0]) * segmentProgress,
      p1[1] + (p2[1] - p1[1]) * segmentProgress,
    ];
  };

  useEffect(() => {
    // Check if Leaflet is loaded on window
    const checkLeaflet = () => {
      if (window.L) {
        setIsLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };
    checkLeaflet();
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;

    const L = window.L;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(startCoords, 11);

      // Dark theme map tiles (CartoDB Dark Matter / OpenStreetMap)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Zoom Control
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const waypoints = generateRouteWaypoints(startCoords, destCoords);

      // Route Polyline (Glow effect & main line)
      const glowLine = L.polyline(waypoints, {
        color: '#3b82f6',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
      }).addTo(map);

      const mainLine = L.polyline(waypoints, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.9,
        dashArray: showVehicleSimulation ? '6, 8' : undefined,
        lineCap: 'round',
      }).addTo(map);

      routePolylineRef.current = mainLine;

      // Custom HTML Icons
      const startHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 border-2 border-slate-900 animate-pulse">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      `;
      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: startHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const destHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/50 border-2 border-slate-900">
          <div class="w-3.5 h-3.5 bg-white rounded-sm"></div>
        </div>
      `;
      const destIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: destHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const startMarker = L.marker(startCoords, { icon: startIcon }).addTo(map);
      startMarker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pickup Point</p>
          <p class="text-sm font-semibold">${startLocationName}</p>
        </div>
      `);

      const destMarker = L.marker(destCoords, { icon: destIcon }).addTo(map);
      destMarker.bindPopup(`
        <div class="p-2 text-slate-900 font-sans">
          <p class="text-xs font-bold text-red-600 uppercase tracking-wider">Destination</p>
          <p class="text-sm font-semibold">${destLocationName}</p>
        </div>
      `);

      // Vehicle Marker (if simulated tracking)
      if (showVehicleSimulation) {
        const vehiclePos = getInterpolatedPoint(waypoints, simProgress);
        const carHtml = `
          <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/60 border-2 border-white transform transition-transform duration-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4zm-9-5h10l-1-6H6l-1 6zm-2 2h14v2H5v-2z" />
            </svg>
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
        `;
        const carIcon = L.divIcon({
          className: 'custom-car-marker',
          html: carHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const vehicleMarker = L.marker(vehiclePos, { icon: carIcon }).addTo(map);
        vehicleMarker.bindPopup(`
          <div class="p-2 text-slate-900 font-sans">
            <p class="text-xs font-bold text-blue-600 uppercase tracking-wider">Live Vehicle</p>
            <p class="text-sm font-semibold">${driverName} (${vehicleModel})</p>
            <p class="text-xs text-slate-600 mt-0.5">Speed: 48 km/h • ETA: 5 min</p>
          </div>
        `);
        vehicleMarkerRef.current = vehicleMarker;
      }

      // Add nearby pooling vehicles
      const nearbyCarHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-blue-400 border border-blue-500/40 shadow-md">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
          </svg>
        </div>
      `;
      const nearbyIcon = L.divIcon({
        className: 'nearby-marker',
        html: nearbyCarHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Sample nearby verified carpool drivers
      const nearbyPositions: { coords: [number, number]; title: string }[] = [
        { coords: [23.0550, 72.5210], title: 'Swapnil Shaw (Tata Nexon EV) - 3 Seats' },
        { coords: [23.1300, 72.5800], title: 'Bhavya (Honda City) - 2 Seats' },
      ];

      nearbyPositions.forEach((pos) => {
        const m = L.marker(pos.coords, { icon: nearbyIcon }).addTo(map);
        m.bindPopup(`
          <div class="p-2 text-slate-900 font-sans">
            <p class="text-xs font-bold text-slate-600 uppercase">Available Pooled Ride</p>
            <p class="text-xs font-medium text-slate-800">${pos.title}</p>
          </div>
        `);
      });

      // Fit bounds with padding
      const group = new L.featureGroup([startMarker, destMarker, glowLine]);
      map.fitBounds(group.getBounds().pad(0.2));

      // Click to select location
      if (interactive && onLocationSelect) {
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          onLocationSelect([lat, lng], `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        });
      }

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Error initializing map:', err);
    }
  }, [isLeafletReady, startCoords, destCoords, startLocationName, destLocationName, showVehicleSimulation, interactive]);

  // Live simulation tick
  useEffect(() => {
    if (!showVehicleSimulation || !mapInstanceRef.current || !vehicleMarkerRef.current || !window.L) return;

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        const next = prev >= 0.95 ? 0.1 : prev + 0.04;
        const waypoints = generateRouteWaypoints(startCoords, destCoords);
        const nextPoint = getInterpolatedPoint(waypoints, next);
        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setLatLng(nextPoint);
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [showVehicleSimulation, startCoords, destCoords]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-[9999] h-[calc(100vh-2rem)]' : ''
      } ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map HUD overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-medium text-slate-200 shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Gujarat IT Corridor Route</span>
        </div>

        {showVehicleSimulation && (
          <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-md text-xs font-semibold text-emerald-300 shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Vehicle Telemetry Active</span>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Route Summary Pill */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto z-10 pointer-events-none">
        <div className="pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-slate-900/95 border border-slate-800/90 backdrop-blur-xl shadow-2xl text-xs text-slate-300 max-w-lg">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="font-semibold text-white truncate max-w-[140px]">{startLocationName.split(',')[0]}</span>
            <span className="text-slate-500">→</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <span className="font-semibold text-white truncate max-w-[140px]">{destLocationName.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto text-slate-400 font-mono text-[11px]">
            <span className="text-cyan-400 font-semibold">24.2 km</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">~34 mins</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">₹120/seat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
