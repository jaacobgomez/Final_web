import { useSyncExternalStore } from 'react';
import { isAuthenticated, suscribirseSesion } from './auth';

// true/false según haya sesión; null mientras se renderiza en el servidor
// (así no se pinta la pantalla equivocada y luego se cambia de golpe)
export function useSesion() {
  return useSyncExternalStore(suscribirseSesion, isAuthenticated, () => null);
}
