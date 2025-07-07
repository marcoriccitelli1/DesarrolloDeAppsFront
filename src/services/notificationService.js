import * as Notifications from 'expo-notifications';
import config from '../config/api';
import { getToken } from '../utils/tokenStorage';

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
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
    },
    trigger: null,
  });
}

let notificationInterval = null;
let lastNotifiedOrderCount = null;

export function startPeriodicNotifications(intervalMinutes = 1) {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  notificationInterval = setInterval(async () => {
    try {
      const response = await checkForOrderUpdates();
      if (response.success && response.data.hasUpdates) {
        const currentCount = response.data.orderCount;
        if (lastNotifiedOrderCount === null || currentCount > lastNotifiedOrderCount) {
          await sendNotification(response.data.title, response.data.message);
          lastNotifiedOrderCount = currentCount;
        }
      } else if (response.success && response.data.hasUpdates === false) {
        lastNotifiedOrderCount = 0;
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

// Esta función consulta el backend real para novedades de pedidos
async function checkForOrderUpdates() {
  try {
    const token = await getToken();
    if (!token) return { success: false, data: null };
    const res = await fetch(`${config.API_BASE_URL}/orders/updates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.novedades) {
      return {
        success: true,
        data: {
          hasUpdates: true,
          orderCount: data.pedidos.length,
          title: '¡Nuevos pedidos!',
          message: `Tienes ${data.pedidos.length} pedidos nuevos para despachar.`
        }
      };
    } else {
      return { success: true, data: { hasUpdates: false, orderCount: 0 } };
    }
  } catch (error) {
    return { success: false, data: null };
  }
} 