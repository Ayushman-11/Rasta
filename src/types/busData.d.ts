export interface BusData {
  id: string;
  route: string;
  startPoint: string;
  destination: string;
  latitude: number;
  longitude: number;
  stops: string[];
  stopTimes: string[];
  estimatedArrival: string;
  travelTime: string;
  estimatedTime: string;
  currentLocation?: string;
  coordinates?: { latitude: number; longitude: number }[];
  crowd?: string;
}
