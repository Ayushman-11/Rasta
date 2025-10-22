import polyline from '@mapbox/polyline';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBpQnI0-K5oT-a19VF84C_NeYXM6sS8kGk';

/**
 * Fetch a road-following polyline from Google Directions API
 * @param origin { latitude, longitude }
 * @param destination { latitude, longitude }
 * @returns Array of { latitude, longitude } points
 */
export async function fetchDirectionsPolyline(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes || !data.routes[0]) throw new Error('No route found');
  const points = data.routes[0].overview_polyline.points;
  return polyline.decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
}

/**
 * Snap a point to the nearest road using Google Roads API
 * @param point { latitude, longitude }
 * @returns { latitude, longitude }
 */
export async function snapToRoad(point) {
  const url = `https://roads.googleapis.com/v1/snapToRoads?path=${point.latitude},${point.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.snappedPoints || !data.snappedPoints[0]) throw new Error('No snapped point');
  const { latitude, longitude } = data.snappedPoints[0].location;
  return { latitude, longitude };
}
