import * as Notifications from 'expo-notifications';
import config from '../config/api';
import { getToken } from '../utils/tokenStorage';
import { Platform } from 'react-native';

export async function configureNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableVibrate: true,
      showBadge: true,
    });
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      channelId: 'default',
    },
    trigger: null,
  });
}

let notificationInterval = null;
let lastNotifiedOrderCount = null;
let lastOrderStates = new Map(); // Para trackear el estado anterior de cada pedido
let lastOrderLocations = new Map(); // Para trackear la ubicación anterior de cada pedido

export function startPeriodicNotifications(intervalMinutes = 1) {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  notificationInterval = setInterval(async () => {
    try {
      const response = await checkForOrderUpdates();
      if (response.success) {
        // Notificar cambios de estado
        if (response.data.statusChanges && response.data.statusChanges.length > 0) {
          for (const change of response.data.statusChanges) {
            if (change.type === 'delivered') {
              await sendNotification('¡Pedido Entregado!', `El pedido #${change.orderId} ha sido entregado exitosamente.`);
            } else if (change.type === 'cancelled') {
              await sendNotification('Pedido Cancelado', `El pedido #${change.orderId} ha sido cancelado.`);
            }
          }
        }
        
        // Notificar cambios de ubicación
        if (response.data.locationChanges && response.data.locationChanges.length > 0) {
          for (const change of response.data.locationChanges) {
            await sendNotification('Destino Cambiado', `El pedido #${change.orderId} tiene nueva dirección: ${change.newLocation}`);
          }
        }
        
        // Notificar nuevos pedidos (lógica existente)
        if (response.data.hasUpdates) {
          const currentCount = response.data.orderCount;
          if (lastNotifiedOrderCount === null || currentCount > lastNotifiedOrderCount) {
            await sendNotification(response.data.title, response.data.message);
            lastNotifiedOrderCount = currentCount;
          }
        } else if (response.data.hasUpdates === false) {
          lastNotifiedOrderCount = 0;
        }
      }
    } catch (error) {
      console.error('[Notification] Error:', error);
    }
  }, intervalMs);

  return true;
}

export function stopPeriodicNotifications() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    return true;
  }
  return false;
}

export function isNotificationServiceRunning() {
  return notificationInterval !== null;
}

// Función para forzar la detección de cambios cuando se complete/cancele un pedido
export async function checkForImmediateUpdates() {
  try {
    console.log('[Notification] Verificando actualizaciones inmediatas...');
    const response = await checkForOrderUpdates();
    if (response.success) {
      // Notificar cambios de estado inmediatamente
      if (response.data.statusChanges && response.data.statusChanges.length > 0) {
        for (const change of response.data.statusChanges) {
          if (change.type === 'delivered') {
            await sendNotification('¡Pedido Entregado!', `El pedido #${change.orderId} ha sido entregado exitosamente.`);
          } else if (change.type === 'cancelled') {
            await sendNotification('Pedido Cancelado', `El pedido #${change.orderId} ha sido cancelado.`);
          }
        }
      }
      
      // Notificar cambios de ubicación inmediatamente
      if (response.data.locationChanges && response.data.locationChanges.length > 0) {
        for (const change of response.data.locationChanges) {
          await sendNotification('Destino Cambiado', `El pedido #${change.orderId} tiene nueva dirección: ${change.newLocation}`);
        }
      }
    }
  } catch (error) {
    console.error('[Notification] Error en checkForImmediateUpdates:', error);
  }
}

// Modificar checkForOrderUpdates para detectar cambios de estado y ubicación
async function checkForOrderUpdates() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: null };
    
    const res = await fetch(`${config.API_BASE_URL}/orders/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    
    // Debug: Log de la respuesta del backend
    console.log('[Notification] Respuesta del backend:', JSON.stringify(data, null, 2));
    
    const statusChanges = [];
    const locationChanges = [];
    
    // Procesar pedidos asignados para detectar cambios de estado
    if (data.assignedOrders && Array.isArray(data.assignedOrders)) {
      console.log('[Notification] Procesando', data.assignedOrders.length, 'pedidos asignados');
      
      for (const pedido of data.assignedOrders) {
        const orderId = pedido.id;
        const currentState = pedido.estado;
        const currentLocation = pedido.destino;
        const previousState = lastOrderStates.get(orderId);
        const previousLocation = lastOrderLocations.get(orderId);
        
        // Debug: Log de cada pedido
        console.log(`[Notification] Pedido ${orderId}:`, {
          currentState,
          previousState: previousState || 'PRIMERA_VEZ',
          currentLocation,
          previousLocation: previousLocation || 'PRIMERA_VEZ'
        });
        
        // Si es la primera vez que vemos este pedido, solo guardar el estado actual
        if (!previousState) {
          console.log(`[Notification] Primera vez viendo pedido ${orderId}, guardando estado: ${currentState}`);
          lastOrderStates.set(orderId, currentState);
          lastOrderLocations.set(orderId, currentLocation);
          continue; // Saltar a la siguiente iteración
        }
        
        // Verificar cambios de estado
        if (previousState === 'En curso' && currentState === 'entregado') {
          console.log(`[Notification] ¡Cambio detectado! Pedido ${orderId} entregado`);
          statusChanges.push({ type: 'delivered', orderId });
        } else if (previousState === 'En curso' && currentState === 'no entregado') {
          console.log(`[Notification] ¡Cambio detectado! Pedido ${orderId} cancelado`);
          statusChanges.push({ type: 'cancelled', orderId });
        } else if (previousState !== currentState) {
          console.log(`[Notification] Cambio de estado detectado: ${previousState} → ${currentState} para pedido ${orderId}`);
        }
        
        // Verificar cambios de ubicación
        if (previousLocation && currentLocation && previousLocation !== currentLocation) {
          console.log(`[Notification] ¡Cambio de ubicación detectado! Pedido ${orderId}`);
          locationChanges.push({ 
            type: 'location_changed', 
            orderId, 
            newLocation: currentLocation,
            previousLocation: previousLocation 
          });
        }
        
        // Actualizar el estado y ubicación actual para la próxima verificación
        lastOrderStates.set(orderId, currentState);
        lastOrderLocations.set(orderId, currentLocation);
      }
    }
    
    // Verificar si hay nuevos pedidos sin asignar
    const hasNewOrders = data.unassignedOrders && data.unassignedOrders.length > 0;
    
    console.log('[Notification] Resumen de cambios:', {
      statusChanges: statusChanges.length,
      locationChanges: locationChanges.length,
      hasNewOrders,
      totalAssigned: data.assignedOrders?.length || 0,
      totalUnassigned: data.totalUnassigned || 0
    });
    
    return {
      success: true,
      data: {
        hasUpdates: hasNewOrders,
        orderCount: data.totalUnassigned || 0,
        statusChanges,
        locationChanges,
        title: '¡Nuevos pedidos!',
        message: `Tienes ${data.totalUnassigned || 0} pedidos nuevos para despachar.`
      }
    };
    
  } catch (error) {
    console.error('[Notification] Error en checkForOrderUpdates:', error);
    return { success: false, data: null };
  }
}