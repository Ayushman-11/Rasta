import { BusData } from '../types';
import { KOLHAPUR_LOCATIONS, KOLHAPUR_ROUTES } from '../constants/mockData';
import { fetchDirectionsPolyline, snapToRoad } from './googleMaps';

/**
 * Generate mock bus locations and routes using Google APIs for real road-following paths and snapped markers
 */
export const generateMockBuses = async (): Promise<BusData[]> => {
  // Helper to get a random intermediate point along a route
  function getRandomRoutePoint(route) {
    const idx = Math.max(1, Math.floor(Math.random() * (route.coordinates.length - 2)));
    return route.coordinates[idx];
  }

  // Bus 27: Rankala Lake to D.Y. College
  const bus27Origin = KOLHAPUR_ROUTES[0].coordinates[0];
  const bus27Dest = KOLHAPUR_ROUTES[0].coordinates[KOLHAPUR_ROUTES[0].coordinates.length - 1];
  const bus27Route = await fetchDirectionsPolyline(bus27Origin, bus27Dest);
  const bus27Marker = await snapToRoad(bus27Route[0]);

  // Bus 15: Railway Station to Hospital
  const bus15Origin = KOLHAPUR_ROUTES[1].coordinates[0];
  const bus15Dest = KOLHAPUR_ROUTES[1].coordinates[KOLHAPUR_ROUTES[1].coordinates.length - 1];
  const bus15Route = await fetchDirectionsPolyline(bus15Origin, bus15Dest);
  const bus15Marker = await snapToRoad(bus15Route[0]);

  return [
    {
      id: 'bus-27',
      ...bus27Marker,
      route: '27',
      passengers: 4,
      estimatedTime: '2 min',
      startPoint: 'Rankala Lake',
      destination: 'D.Y. College',
      currentLocation: 'ST Stand',
      stops: KOLHAPUR_ROUTES[0].stops,
      coordinates: bus27Route,
    },
    {
      id: 'bus-15',
      ...bus15Marker,
      route: '15',
      passengers: 6,
      estimatedTime: '5 min',
      startPoint: 'Railway Station',
      destination: 'Hospital',
      currentLocation: 'Market Yard',
      stops: KOLHAPUR_ROUTES[1].stops,
      coordinates: bus15Route,
    },
  ];
};

/**
 * Filter buses based on search query
 */
export const filterBuses = (buses: BusData[], query: string): BusData[] => {
  if (query.trim() === '') return buses;
  
  const lowerQuery = query.toLowerCase();
  return buses.filter(bus => 
    bus.destination.toLowerCase().includes(lowerQuery) ||
    bus.startPoint.toLowerCase().includes(lowerQuery) ||
    bus.currentLocation.toLowerCase().includes(lowerQuery) ||
    bus.route.toLowerCase().includes(lowerQuery)
  );
};
