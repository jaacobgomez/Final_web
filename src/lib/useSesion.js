import { useSyncExternalStore } from 'react';
import { getClientIdPropio, isAuthenticated, suscribirseSesion } from './auth';

// true/false según haya sesión; null mientras se renderiza en el servidor
// (así no se pinta la pantalla equivocada y luego se cambia de golpe)
export function useSesion() {
  return useSyncExternalStore(suscribirseSesion, isAuthenticated, () => null);
}

// Client ID propio guardado en este dispositivo (null si usa la app compartida)
export function useClientIdPropio() {
  return useSyncExternalStore(suscribirseSesion, getClientIdPropio, () => null);
}
