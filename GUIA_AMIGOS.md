# Taste Mixer para amigos · guía rápida

## 1. Probarla en tu ordenador
1. Spotify Dashboard → tu app → **Settings**:
   - **Rotate client secret** y pega el nuevo en `.env.local` (`SPOTIFY_CLIENT_SECRET=`).
   - En **Redirect URIs** debe estar `http://127.0.0.1:3000/auth/callback`.
2. `npm run dev` y abre **http://127.0.0.1:3000** (no `localhost`: Spotify ya no lo acepta).
3. Inicia sesión. Si ya estabas logueado de antes, cierra sesión y vuelve a entrar: hay un permiso nuevo (canciones guardadas).

## 2. Publicarla gratis (Vercel)
1. vercel.com → entra con GitHub → **Add New → Project** → elige `Final_web` y la rama que quieras publicar.
2. En **Environment Variables** añade las 4 de `.env.example`, con
   `NEXT_PUBLIC_REDIRECT_URI=https://TU-APP.vercel.app/auth/callback`.
3. **Deploy**. Después añade esa misma URL en los Redirect URIs de Spotify.

## 3. Dar acceso a tus amigos (máx. 5 contándote a ti)
Spotify Dashboard → tu app → **User Management** → nombre + **correo de su cuenta de Spotify**.
Si alguien no está dado de alta, la app le dirá que pida acceso.

## 4. Instalarla en el móvil (PWA, sin tiendas)
- **iPhone (Safari):** abrir la URL → Compartir → **Añadir a pantalla de inicio**.
- **Android (Chrome):** abrir la URL → menú ⋮ → **Instalar aplicación**.

## Qué cambió respecto a la práctica
- Generador nuevo: filtros de década dentro de la búsqueda, reparto por turnos entre artistas/géneros, sin duplicados ni remasters repetidos.
- Popularidad (Spotify la eliminó) → modos **Conocidas / Equilibrado / Descubrir** + duración (canciones o minutos) + "mis artistas más escuchados".
- Botón **Guardar en mi Spotify**.
- La sesión se renueva sola; ya no caduca a la hora.
- Solo usa endpoints que siguen vivos tras los cambios de la API de febrero de 2026.
