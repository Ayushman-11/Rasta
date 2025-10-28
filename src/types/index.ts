// Type definitions for the app

export * from './busData';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}
