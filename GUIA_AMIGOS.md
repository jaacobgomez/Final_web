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

## 5. Más de 5 personas: "usa tu propia clave"
Quien no esté en tu lista entra desde la portada → **"¿No estás en la lista? Usa tu propia clave"** (`/mi-clave`).
- Cada persona crea gratis su propia app en developer.spotify.com (necesita **Premium**), con el Redirect URI que le muestra la página, y pega su **Client ID** (nunca el secret).
- El login usa **PKCE**: el navegador habla directamente con Spotify; tu servidor y tu secreto no intervienen.
- El Client ID se guarda solo en su dispositivo. Desde `/mi-clave` puede dejar de usarlo.

## 6. Novedades
- **Recuerda tu sesión:** al cerrar y abrir la app siguen tu lista, tus filtros y la playlist vinculada (se borra al cerrar sesión).
- **Partir de una playlist tuya:** en el panel, "Partir de una playlist tuya" → genera más en su línea sin repetir lo que ya tiene.
- **Compartir:** tras guardar, botón 📤 (menú del móvil o WhatsApp). Marca "Pública" al guardar para que tus amigos puedan abrirla.
- **Mezcla de grupo** (`/grupo`): cada amigo pulsa "Compartir mi gusto" y te manda el enlace; tú los abres, pulsas "Generar mezcla de grupo" y la guardas en tu Spotify. Primero salen los artistas en común.

## 7. Novedades (28-10-2026)
- **Número exacto**: si pides 50 canciones salen 50 (la app pide más páginas a Spotify hasta completarlo). Solo se queda corta si no existen tantas con esos filtros, y te avisa.
- **Cantidad libre**: además de los botones, en "Otra:" eliges cualquier número de canciones (1-200) o de minutos (5-600).
- **Añadir más con los mismos filtros**: abre un panel con los filtros de la última generación; puedes quitar uno a uno, quitarlos todos (usa tus más escuchados) o usar los que tengas ahora en el panel, y elegir cuántas más.
