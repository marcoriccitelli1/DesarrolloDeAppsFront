import { Linking, Platform } from 'react-native';

/**
 * Abre Google Maps con una ubicación específica
 * @param {string} location - La ubicación a mostrar en el mapa
 */
export const openGoogleMaps = (location) => {
  const encodedLocation = encodeURIComponent(location);
  const url = Platform.select({
    ios: `maps:0,0?q=${encodedLocation}`,
    android: `geo:0,0?q=${encodedLocation}`
  });

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
        return Linking.openURL(browserUrl);
      }
    })
    .catch(err => console.error('Error al abrir Google Maps:', err));
};

/**
 * Abre Google Maps con una ruta que incluye múltiples destinos
 * @param {Array} orders - Array de pedidos con propiedades destino
 */
export const openAllRoutes = (orders) => {
  if (!orders.length) return;
  
  const destinos = orders
    .map(order => order.destino)
    .filter(Boolean);
  
  if (destinos.length === 0) return;
  
  if (destinos.length === 1) {
    const destination = destinos[0] + ', Argentina';
    const url = `https://www.google.com/maps/dir/?api=1&origin=Mi ubicación&destination=${destination}`;
    Linking.openURL(url);
    return;
  }
  
  const destination = destinos[destinos.length - 1] + ', Argentina';
  const waypoints = destinos.slice(0, -1);
  
  let url = `https://www.google.com/maps/dir/?api=1&origin=Mi ubicación&destination=${destination}`;
  
  if (waypoints.length > 0) {
    const waypointsWithCountry = waypoints.map(wp => wp + ', Argentina');
    const waypointsString = waypointsWithCountry.join('|');
    url += `&waypoints=${waypointsString}`;
  }
  
  Linking.openURL(url);
};

/**
 * Abre Google Maps con una ruta desde la ubicación actual hasta un destino específico
 * @param {string} destination - El destino de la ruta
 */
export const openRouteToDestination = (destination) => {
  const encodedDestination = encodeURIComponent(destination + ', Argentina');
  const url = `https://www.google.com/maps/dir/?api=1&origin=Mi ubicación&destination=${encodedDestination}`;
  Linking.openURL(url);
}; 