// Type definitions for the app

export interface BusData {
  id: string;
  latitude: number;
  longitude: number;
  route: string;
  passengers: number;
  estimatedTime: string;
  startPoint: string;
  destination: string;
  currentLocation: string;
  stops?: string[];
  coordinates?: { latitude: number; longitude: number }[];
  crowd?: 'low' | 'medium' | 'high';
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}
