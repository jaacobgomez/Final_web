module.exports = [
"[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buscarArtistasSpotify",
    ()=>buscarArtistasSpotify,
    "buscarCancionesSpotify",
    ()=>buscarCancionesSpotify,
    "buscarTracksPorGenero",
    ()=>buscarTracksPorGenero,
    "generatePlaylist",
    ()=>generatePlaylist,
    "getRandomSpotifyImage",
    ()=>getRandomSpotifyImage,
    "obtenerTopTracksArtista",
    ()=>obtenerTopTracksArtista
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/auth.js [app-ssr] (ecmascript)");
;
async function generatePlaylist(preferences) {
    const { artists, genres, decades, popularity } = preferences;
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    let allTracks = [];
    // 1. Obtener top tracks de artistas seleccionados
    for (const artist of artists){
        const tracks = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await tracks.json();
        allTracks.push(...data.tracks);
    }
    // 2. Buscar por géneros
    for (const genre of genres){
        const results = await fetch(`https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await results.json();
        allTracks.push(...data.tracks.items);
    }
    // 3. Filtrar por década
    if (decades.length > 0) {
        allTracks = allTracks.filter((track)=>{
            const year = new Date(track.album.release_date).getFullYear();
            return decades.some((decade)=>{
                const decadeStart = parseInt(decade);
                return year >= decadeStart && year < decadeStart + 10;
            });
        });
    }
    // 4. Filtrar por popularidad
    if (popularity) {
        const [min, max] = popularity;
        allTracks = allTracks.filter((track)=>track.popularity >= min && track.popularity <= max);
    }
    // 5. Eliminar duplicados y limitar a 30 canciones
    const uniqueTracks = Array.from(new Map(allTracks.map((track)=>[
            track.id,
            track
        ])).values()).slice(0, 30);
    return uniqueTracks;
}
async function getRandomSpotifyImage() {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    if (!token) {
        throw new Error('No hay token de Spotify. Inicia sesión primero.');
    }
    const res = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=20', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('Error al pedir new releases:', res.status, text);
        throw new Error('Error al pedir datos a Spotify');
    }
    const data = await res.json();
    const albums = data.albums.items;
    if (!albums.length) {
        throw new Error('Spotify no devolvió álbumes');
    }
    const randomIndex = Math.floor(Math.random() * albums.length);
    const album = albums[randomIndex];
    return {
        url: album.images[0]?.url || '',
        name: album.name,
        artist: album.artists?.[0]?.name || ''
    };
}
//Buscar artistas 
// Pequeña función para leer el token del localStorage de forma segura
function obtenerTokenCliente() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
async function buscarArtistasSpotify(terminoBusqueda) {
    const token = obtenerTokenCliente();
    if (!token) {
        throw new Error("No hay token de Spotify. Inicia sesión de nuevo para buscar artistas.");
    }
    const parametros = new URLSearchParams({
        type: "artist",
        q: terminoBusqueda,
        limit: "10"
    });
    const respuesta = await fetch(`https://api.spotify.com/v1/search?${parametros.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (respuesta.status === 401) {
        throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
    }
    if (!respuesta.ok) {
        throw new Error(`Error al buscar artistas (código ${respuesta.status}). Inténtalo de nuevo.`);
    }
    const datos = await respuesta.json();
    return datos.artists?.items || [];
}
async function buscarCancionesSpotify(terminoBusqueda) {
    const token = obtenerTokenCliente();
    if (!token) {
        throw new Error("No hay token de Spotify. Inicia sesión de nuevo para buscar canciones.");
    }
    const parametros = new URLSearchParams({
        type: "track",
        q: terminoBusqueda,
        limit: "10"
    });
    const respuesta = await fetch(`https://api.spotify.com/v1/search?${parametros.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (respuesta.status === 401) {
        throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
    }
    if (!respuesta.ok) {
        throw new Error(`Error al buscar canciones (código ${respuesta.status}). Inténtalo de nuevo.`);
    }
    const datos = await respuesta.json();
    return datos.tracks?.items || [];
}
async function obtenerTopTracksArtista(artistId, market = "ES") {
    const token = obtenerTokenCliente();
    if (!token) {
        throw new Error("No hay token de Spotify para cargar top tracks.");
    }
    const respuesta = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (respuesta.status === 401) {
        throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
    }
    if (!respuesta.ok) {
        throw new Error(`Error al obtener top tracks del artista (código ${respuesta.status}).`);
    }
    const datos = await respuesta.json();
    return datos.tracks || [];
}
async function buscarTracksPorGenero(genero, limit = 10) {
    const token = obtenerTokenCliente();
    if (!token) {
        throw new Error("No hay token de Spotify para buscar por género.");
    }
    const parametros = new URLSearchParams({
        type: "track",
        q: `genre:${genero}`,
        limit: String(limit)
    });
    const respuesta = await fetch(`https://api.spotify.com/v1/search?${parametros.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (respuesta.status === 401) {
        throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
    }
    if (!respuesta.ok) {
        throw new Error(`Error al buscar canciones por género (código ${respuesta.status}).`);
    }
    const datos = await respuesta.json();
    return datos.tracks?.items || [];
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GenreWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const TODOS_LOS_GENEROS = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "blues",
    "brazil",
    "chill",
    "classical",
    "dance",
    "disco",
    "edm",
    "electronic",
    "folk",
    "funk",
    "hip-hop",
    "house",
    "indie",
    "indie-pop",
    "jazz",
    "k-pop",
    "latin",
    "metal",
    "pop",
    "punk",
    "r-n-b",
    "reggae",
    "reggaeton",
    "rock",
    "soul",
    "techno",
    "trance",
    "world-music"
];
function GenreWidget({ generosSeleccionados, onCambiarGeneros }) {
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Filtramos la lista según el texto que escribe el usuario
    const generosFiltrados = TODOS_LOS_GENEROS.filter((genero)=>genero.toLowerCase().includes(busqueda.toLowerCase()));
    const limiteSeleccion = 5;
    const manejarClickGenero = (genero)=>{
        // Si ya está seleccionado, lo quitamos
        if (generosSeleccionados.includes(genero)) {
            const nuevaLista = generosSeleccionados.filter((g)=>g !== genero);
            onCambiarGeneros(nuevaLista);
            return;
        }
        // Si NO está seleccionado y ya hemos llegado al límite, no dejamos añadir más
        if (generosSeleccionados.length >= limiteSeleccion) {
            alert(`Solo puedes seleccionar hasta ${limiteSeleccion} géneros.`);
            return;
        }
        const nuevaLista = [
            ...generosSeleccionados,
            genero
        ];
        onCambiarGeneros(nuevaLista);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card widget-generos",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "widget-titulo",
                children: "Géneros favoritos"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                lineNumber: 77,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "widget-texto",
                children: [
                    "Escribe para filtrar y elige hasta ",
                    limiteSeleccion,
                    " géneros que te representen."
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Buscar género (ej. rock, jazz, pop)...",
                className: "widget-input",
                value: busqueda,
                onChange: (e)=>setBusqueda(e.target.value)
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                lineNumber: 83,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lista-generos",
                children: generosFiltrados.map((genero)=>{
                    const estaSeleccionado = generosSeleccionados.includes(genero);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `boton-genero ${estaSeleccionado ? "boton-genero-activo" : ""}`,
                        onClick: ()=>manejarClickGenero(genero),
                        children: genero
                    }, genero, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                        lineNumber: 95,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                lineNumber: 91,
                columnNumber: 9
            }, this),
            generosSeleccionados.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-seleccionados",
                children: [
                    "Seleccionados: ",
                    generosSeleccionados.join(", ")
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
                lineNumber: 110,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DecadeWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const TODAS_LAS_DECADAS = [
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s"
];
function DecadeWidget({ decadasSeleccionadas, onCambiarDecadas }) {
    const [mostrarMasInfo, setMostrarMasInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const limiteSeleccion = 3;
    const manejarClickDecada = (decada)=>{
        // Si ya está seleccionada, la quitamos
        if (decadasSeleccionadas.includes(decada)) {
            const nuevaLista = decadasSeleccionadas.filter((d)=>d !== decada);
            onCambiarDecadas(nuevaLista);
            return;
        }
        // Límite de décadas seleccionadas
        if (decadasSeleccionadas.length >= limiteSeleccion) {
            alert(`Solo puedes seleccionar hasta ${limiteSeleccion} décadas.`);
            return;
        }
        const nuevaLista = [
            ...decadasSeleccionadas,
            decada
        ];
        onCambiarDecadas(nuevaLista);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card widget-decadas",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "widget-titulo",
                children: "Décadas preferidas"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "widget-texto",
                children: "Elige las épocas musicales que más te gustan. Usaremos estas décadas para filtrar la música."
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lista-decadas",
                children: TODAS_LAS_DECADAS.map((decada)=>{
                    const activa = decadasSeleccionadas.includes(decada);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `boton-decada ${activa ? "boton-decada-activa" : ""}`,
                        onClick: ()=>manejarClickDecada(decada),
                        children: decada
                    }, decada, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            decadasSeleccionadas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-seleccionados",
                children: [
                    "Has seleccionado: ",
                    decadasSeleccionadas.join(", ")
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "boton-info-decadas",
                onClick: ()=>setMostrarMasInfo(!mostrarMasInfo),
                children: mostrarMasInfo ? "Ocultar detalle" : "¿Qué significa cada década?"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            mostrarMasInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "lista-detalle-decadas",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "1950s → 1950 - 1959"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "1960s → 1960 - 1969"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "1970s → 1970 - 1979"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "1980s → 1980 - 1989"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "1990s → 1990 - 1999"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "2000s → 2000 - 2009"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "2010s → 2010 - 2019"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: "2020s → 2020 - 2029"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PopularityWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const OPCIONES = {
    underground: {
        min: 0,
        max: 40,
        etiqueta: "Underground (0 - 40)"
    },
    popular: {
        min: 40,
        max: 75,
        etiqueta: "Popular (40 - 75)"
    },
    mainstream: {
        min: 75,
        max: 100,
        etiqueta: "Mainstream (75 - 100)"
    }
};
function PopularityWidget({ popularidad, onCambiarPopularidad }) {
    const [opcionSeleccionada, setOpcionSeleccionada] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("popular");
    // Cuando cambie la popularidad desde fuera, intentamos ajustar la opción
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!popularidad) return;
        const { min, max } = popularidad;
        if (min === OPCIONES.underground.min && max === OPCIONES.underground.max) {
            setOpcionSeleccionada("underground");
        } else if (min === OPCIONES.popular.min && max === OPCIONES.popular.max) {
            setOpcionSeleccionada("popular");
        } else if (min === OPCIONES.mainstream.min && max === OPCIONES.mainstream.max) {
            setOpcionSeleccionada("mainstream");
        } else {
            setOpcionSeleccionada("personalizado");
        }
    }, [
        popularidad
    ]);
    const manejarClickOpcion = (opcionClave)=>{
        if (opcionClave === "personalizado") {
            setOpcionSeleccionada("personalizado");
            return;
        }
        const rango = OPCIONES[opcionClave];
        setOpcionSeleccionada(opcionClave);
        onCambiarPopularidad({
            min: rango.min,
            max: rango.max
        });
    };
    /* El slider del widget me da un valor de 0 a 100, que yo interpreto como el centro del rango de popularidad. 
  Uso una constante amplitud = 10 para construir alrededor de ese centro un intervalo [valor - 10, valor + 10], 
  y lo recorto entre 0 y 100 con Math.max y Math.min. Así siempre trabajo con un rango (mínimo y máximo) en lugar 
  de un solo número*/ const manejarCambioSlider = (e)=>{
        const valor = Number(e.target.value);
        // Creamos un rango pequeño alrededor del valor central
        const amplitud = 10;
        const min = Math.max(0, valor - amplitud);
        const max = Math.min(100, valor + amplitud);
        onCambiarPopularidad({
            min,
            max
        });
        setOpcionSeleccionada("personalizado");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card widget-popularidad",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "widget-titulo",
                children: "Nivel de popularidad"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "widget-texto",
                children: "Decide si quieres descubrimientos más alternativos o temas muy conocidos."
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "botones-popularidad",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `boton-popularidad ${opcionSeleccionada === "underground" ? "boton-popularidad-activo" : ""}`,
                        onClick: ()=>manejarClickOpcion("underground"),
                        children: "Underground"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `boton-popularidad ${opcionSeleccionada === "popular" ? "boton-popularidad-activo" : ""}`,
                        onClick: ()=>manejarClickOpcion("popular"),
                        children: "Popular"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `boton-popularidad ${opcionSeleccionada === "mainstream" ? "boton-popularidad-activo" : ""}`,
                        onClick: ()=>manejarClickOpcion("mainstream"),
                        children: "Mainstream"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "popularidad-slider-bloque",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "popularidad-label",
                        children: "Ajuste fino (personalizado)"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0",
                        max: "100",
                        step: "1",
                        className: "popularidad-slider",
                        value: Math.round((popularidad.min + popularidad.max) / 2),
                        onChange: manejarCambioSlider
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "popularidad-rango",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Mín: ",
                                    popularidad.min
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Máx: ",
                                    popularidad.max
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @next/next/no-img-element */ __turbopack_context__.s([
    "default",
    ()=>ArtistWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ArtistWidget({ artistasSeleccionados, onCambiarArtistas }) {
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [resultados, setResultados] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cargando, setCargando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const limiteSeleccion = 5;
    // Buscar artistas con "debounce"
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Si el texto es muy corto, no buscamos
        if (!busqueda || busqueda.trim().length < 2) {
            setResultados([]);
            setError("");
            return;
        }
        setCargando(true);
        setError("");
        const idTimeout = setTimeout(async ()=>{
            try {
                const artistas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buscarArtistasSpotify"])(busqueda.trim());
                setResultados(artistas);
            } catch (err) {
                console.error(err);
                setError(err.message || "Error al buscar artistas.");
                setResultados([]);
            } finally{
                setCargando(false);
            }
        }, 500); // esperamos 500ms desde que el usuario deja de escribir
        // limpiar timeout si el usuario sigue escribiendo
        return ()=>clearTimeout(idTimeout);
    }, [
        busqueda
    ]); // solo depende del texto de búsqueda
    const manejarClickArtista = (artista)=>{
        const yaEsta = artistasSeleccionados.some((a)=>a.id === artista.id);
        if (yaEsta) {
            // quitar de la lista
            const nuevaLista = artistasSeleccionados.filter((a)=>a.id !== artista.id);
            onCambiarArtistas(nuevaLista);
            return;
        }
        if (artistasSeleccionados.length >= limiteSeleccion) {
            alert(`Solo puedes seleccionar hasta ${limiteSeleccion} artistas.`);
            return;
        }
        const nuevaLista = [
            ...artistasSeleccionados,
            artista
        ];
        onCambiarArtistas(nuevaLista);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card widget-artistas",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "widget-titulo",
                children: "Artistas favoritos"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "widget-texto",
                children: [
                    "Busca artistas por nombre y selecciona hasta ",
                    limiteSeleccion,
                    ". Usaremos sus canciones más populares al generar la playlist."
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Buscar artista (ej. Queen, Rosalía, Bad Bunny)...",
                className: "widget-input",
                value: busqueda,
                onChange: (e)=>setBusqueda(e.target.value)
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            cargando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-estado-busqueda",
                children: "Buscando artistas..."
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 85,
                columnNumber: 9
            }, this),
            error && !cargando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-error-busqueda",
                children: error
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 89,
                columnNumber: 9
            }, this),
            !cargando && !error && resultados.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "lista-artistas",
                children: resultados.map((artista)=>{
                    const imagen = artista.images && artista.images.length > 0 ? artista.images[artista.images.length - 1].url // la más pequeña
                     : null;
                    const estaSeleccionado = artistasSeleccionados.some((a)=>a.id === artista.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `item-artista ${estaSeleccionado ? "item-artista-seleccionado" : ""}`,
                            onClick: ()=>manejarClickArtista(artista),
                            children: [
                                imagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: imagen,
                                    alt: artista.name,
                                    className: "imagen-artista"
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                                    lineNumber: 114,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "info-artista",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "nombre-artista",
                                            children: artista.name
                                        }, void 0, false, {
                                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                                            lineNumber: 121,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "detalle-artista",
                                            children: [
                                                "Popularidad: ",
                                                artista.popularity,
                                                " · Seguidores:",
                                                " ",
                                                artista.followers?.total?.toLocaleString("es-ES")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                                            lineNumber: 122,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                                    lineNumber: 120,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                            lineNumber: 106,
                            columnNumber: 17
                        }, this)
                    }, artista.id, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                        lineNumber: 105,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 93,
                columnNumber: 9
            }, this),
            artistasSeleccionados.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "seleccion-artistas",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "texto-seleccionados",
                        children: "Artistas seleccionados:"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chips-artistas",
                        children: artistasSeleccionados.map((artista)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip-artista",
                                children: artista.name
                            }, artista.id, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
                lineNumber: 135,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @next/next/no-img-element */ __turbopack_context__.s([
    "default",
    ()=>TrackWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function TrackWidget({ cancionesSeleccionadas, onCambiarCanciones }) {
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [resultados, setResultados] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cargando, setCargando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const limiteSeleccion = 5;
    // Búsqueda con pequeño debounce
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!busqueda || busqueda.trim().length < 2) {
            setResultados([]);
            setError("");
            return;
        }
        setCargando(true);
        setError("");
        const idTimeout = setTimeout(async ()=>{
            try {
                const canciones = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buscarCancionesSpotify"])(busqueda.trim());
                setResultados(canciones);
            } catch (err) {
                console.error(err);
                setError(err.message || "Error al buscar canciones.");
                setResultados([]);
            } finally{
                setCargando(false);
            }
        }, 500);
        return ()=>clearTimeout(idTimeout);
    }, [
        busqueda
    ]);
    const manejarClickCancion = (cancion)=>{
        const yaEsta = cancionesSeleccionadas.some((c)=>c.id === cancion.id);
        if (yaEsta) {
            const nuevaLista = cancionesSeleccionadas.filter((c)=>c.id !== cancion.id);
            onCambiarCanciones(nuevaLista);
            return;
        }
        if (cancionesSeleccionadas.length >= limiteSeleccion) {
            alert(`Solo puedes seleccionar hasta ${limiteSeleccion} canciones.`);
            return;
        }
        const nuevaLista = [
            ...cancionesSeleccionadas,
            cancion
        ];
        onCambiarCanciones(nuevaLista);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card widget-canciones",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "widget-titulo",
                children: "Canciones favoritas"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "widget-texto",
                children: "Busca canciones concretas y selecciónalas como referencia. También podrás marcarlas como favoritas más adelante."
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Buscar canción (ej. Blinding Lights, As It Was)...",
                className: "widget-input",
                value: busqueda,
                onChange: (e)=>setBusqueda(e.target.value)
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            cargando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-estado-busqueda",
                children: "Buscando canciones..."
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 82,
                columnNumber: 9
            }, this),
            error && !cargando && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "texto-error-busqueda",
                children: error
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 86,
                columnNumber: 9
            }, this),
            !cargando && !error && resultados.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "lista-canciones",
                children: resultados.map((cancion)=>{
                    const imagen = cancion.album?.images && cancion.album.images.length > 0 ? cancion.album.images[cancion.album.images.length - 1].url : null;
                    const artistasTexto = cancion.artists?.map((a)=>a.name).join(", ");
                    const estaSeleccionada = cancionesSeleccionadas.some((c)=>c.id === cancion.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: `item-cancion ${estaSeleccionada ? "item-cancion-seleccionada" : ""}`,
                            onClick: ()=>manejarClickCancion(cancion),
                            children: [
                                imagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: imagen,
                                    alt: cancion.name,
                                    className: "imagen-cancion"
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                    lineNumber: 115,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "info-cancion",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "nombre-cancion",
                                            children: cancion.name
                                        }, void 0, false, {
                                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                            lineNumber: 123,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "detalle-cancion",
                                            children: [
                                                artistasTexto,
                                                " · ",
                                                cancion.album?.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                            lineNumber: 124,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                    lineNumber: 122,
                                    columnNumber: 19
                                }, this),
                                cancion.explicit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "etiqueta-explicit",
                                    children: "E"
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                    lineNumber: 130,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                            lineNumber: 107,
                            columnNumber: 17
                        }, this)
                    }, cancion.id, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                        lineNumber: 106,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 90,
                columnNumber: 9
            }, this),
            cancionesSeleccionadas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "seleccion-canciones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "texto-seleccionados",
                        children: "Canciones seleccionadas:"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chips-canciones",
                        children: cancionesSeleccionadas.map((cancion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chip-cancion",
                                children: cancion.name
                            }, cancion.id, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
                lineNumber: 140,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @next/next/no-img-element */ __turbopack_context__.s([
    "default",
    ()=>TrackCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function TrackCard({ track, esFavorito, onToggleFavorito, onEliminar }) {
    const imagen = track.album?.images && track.album.images.length > 0 ? track.album.images[track.album.images.length - 1].url : null;
    const artistas = track.artists?.map((a)=>a.name).join(", ");
    const duracionMs = track.duration_ms || 0;
    const minutos = Math.floor(duracionMs / 60000);
    const segundos = Math.floor(duracionMs % 60000 / 1000).toString().padStart(2, "0");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "track-card",
        children: [
            imagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imagen,
                alt: track.name,
                className: "track-card-imagen"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "track-card-info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "track-card-titulos",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "track-card-nombre",
                                children: track.name
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "track-card-artista",
                                children: [
                                    artistas,
                                    " · ",
                                    track.album?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "track-card-extra",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "track-card-duracion",
                                children: [
                                    minutos,
                                    ":",
                                    segundos
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "track-card-popularidad",
                                children: [
                                    "Popularidad: ",
                                    track.popularity
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "track-card-acciones",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `track-card-boton track-card-favorito ${esFavorito ? "track-card-favorito-activo" : ""}`,
                        onClick: ()=>onToggleFavorito(track),
                        children: esFavorito ? "★" : "☆"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "track-card-boton track-card-eliminar",
                        onClick: ()=>onEliminar(track.id),
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/auth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$GenreWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/GenreWidget.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$DecadeWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$PopularityWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/PopularityWidget.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$ArtistWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/ArtistWidget.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$TrackWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/TrackWidget.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$TrackCard$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/TrackCard.jsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardPage() {
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [preferencias, setPreferencias] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        artistas: [],
        canciones: [],
        generos: [],
        decadas: [],
        popularidad: {
            min: 30,
            max: 90
        },
        mood: {
            energia: 0.7,
            valencia: 0.7,
            baile: 0.7
        }
    });
    const [listaReproduccion, setListaReproduccion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [favoritos, setFavoritos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cargandoPlaylist, setCargandoPlaylist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorPlaylist, setErrorPlaylist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    // Si no está autenticado, devolverlo al inicio
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAuthenticated"])()) {
            router.push("/");
        }
    }, [
        router
    ]);
    // Cargar favoritos desde localStorage (si existen)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const guardados = localStorage.getItem("favorite_tracks");
            if (guardados) {
                setFavoritos(JSON.parse(guardados));
            }
        } catch (error) {
            console.error("Error leyendo favoritos de localStorage", error);
        }
    }, []);
    // Convertir "1980s" -> {min: 1980, max: 1989}
    function rangoDecada(decada) {
        const inicio = parseInt(decada.slice(0, 4), 10);
        if (Number.isNaN(inicio)) return null;
        return {
            min: inicio,
            max: inicio + 9
        };
    }
    function anioDeTrack(track) {
        const fecha = track.album?.release_date;
        if (!fecha) return null;
        // formato "YYYY-MM-DD" o "YYYY"
        const anio = parseInt(fecha.slice(0, 4), 10);
        return Number.isNaN(anio) ? null : anio;
    }
    // Generar playlist usando las preferencias
    async function generarPlaylist() {
        setCargandoPlaylist(true);
        setErrorPlaylist("");
        try {
            let tracks = [];
            // 1) Top tracks de artistas seleccionados
            for (const artista of preferencias.artistas.slice(0, 3)){
                const topTracks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["obtenerTopTracksArtista"])(artista.id);
                tracks.push(...topTracks.slice(0, 5)); // 5 por artista
            }
            // 2) Canciones por género
            for (const genero of preferencias.generos.slice(0, 3)){
                const tracksGenero = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buscarTracksPorGenero"])(genero, 8);
                tracks.push(...tracksGenero);
            }
            // 3) Añadir canciones seleccionadas directamente en el widget de canciones
            tracks.push(...preferencias.canciones);
            // 4) Eliminar duplicados por id
            const mapa = new Map();
            for (const t of tracks){
                if (!mapa.has(t.id)) {
                    mapa.set(t.id, t);
                }
            }
            tracks = Array.from(mapa.values());
            // 5) Filtrar por popularidad
            const { min, max } = preferencias.popularidad;
            tracks = tracks.filter((t)=>t.popularity >= min && t.popularity <= max);
            // 6) Filtrar por década (si se han seleccionado)
            if (preferencias.decadas.length > 0) {
                const rangos = preferencias.decadas.map(rangoDecada).filter(Boolean);
                tracks = tracks.filter((t)=>{
                    const anio = anioDeTrack(t);
                    if (!anio) return false;
                    return rangos.some((r)=>anio >= r.min && anio <= r.max);
                });
            }
            // 7) Limitar tamaño final (por ejemplo 30 canciones)
            tracks = tracks.slice(0, 30);
            setListaReproduccion(tracks);
        } catch (error) {
            console.error(error);
            setErrorPlaylist(error.message || "Error al generar la playlist. Inténtalo de nuevo.");
            setListaReproduccion([]);
        } finally{
            setCargandoPlaylist(false);
        }
    }
    // Añadir más canciones sobre la playlist actual
    async function agregarMasCanciones() {
        if (listaReproduccion.length === 0) {
            await generarPlaylist();
            return;
        }
        setCargandoPlaylist(true);
        setErrorPlaylist("");
        try {
            let nuevas = [];
            for (const artista of preferencias.artistas.slice(0, 2)){
                const topTracks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["obtenerTopTracksArtista"])(artista.id);
                nuevas.push(...topTracks.slice(0, 5));
            }
            for (const genero of preferencias.generos.slice(0, 2)){
                const tracksGenero = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buscarTracksPorGenero"])(genero, 5);
                nuevas.push(...tracksGenero);
            }
            const mapa = new Map();
            for (const t of [
                ...listaReproduccion,
                ...nuevas
            ]){
                if (!mapa.has(t.id)) {
                    mapa.set(t.id, t);
                }
            }
            setListaReproduccion(Array.from(mapa.values()).slice(0, 50));
        } catch (error) {
            console.error(error);
            setErrorPlaylist(error.message || "Error al añadir más canciones.");
        } finally{
            setCargandoPlaylist(false);
        }
    }
    // Eliminar una canción de la playlist
    function eliminarTrackDePlaylist(idTrack) {
        setListaReproduccion((prev)=>prev.filter((t)=>t.id !== idTrack));
    }
    // Toggle favorito y persistir en localStorage
    function toggleFavorito(track) {
        setFavoritos((prev)=>{
            const existe = prev.some((t)=>t.id === track.id);
            let nuevaLista;
            if (existe) {
                nuevaLista = prev.filter((t)=>t.id !== track.id);
            } else {
                nuevaLista = [
                    ...prev,
                    track
                ];
            }
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return nuevaLista;
        });
    }
    function esFavorito(trackId) {
        return favoritos.some((t)=>t.id === trackId);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "dashboard",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "dashboard-contenedor",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-columna-izquierda",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "dashboard-cabecera",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "dashboard-titulo",
                                children: [
                                    "Panel de mezcla",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "dashboard-texto",
                                        children: "Configura tus preferencias con los widgets (artistas, géneros, décadas, etc.) y genera una playlist personalizada."
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 225,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 223,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid-widgets",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$GenreWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                generosSeleccionados: preferencias.generos,
                                onCambiarGeneros: (nuevosGeneros)=>setPreferencias((previas)=>({
                                            ...previas,
                                            generos: nuevosGeneros
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$DecadeWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            decadasSeleccionadas: preferencias.decadas,
                            onCambiarDecadas: (nuevasDecadas)=>setPreferencias((previas)=>({
                                        ...previas,
                                        decadas: nuevasDecadas
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$PopularityWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            popularidad: preferencias.popularidad,
                            onCambiarPopularidad: (nuevaPopularidad)=>setPreferencias((previas)=>({
                                        ...previas,
                                        popularidad: nuevaPopularidad
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 255,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$ArtistWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            artistasSeleccionados: preferencias.artistas,
                            onCambiarArtistas: (nuevosArtistas)=>setPreferencias((previas)=>({
                                        ...previas,
                                        artistas: nuevosArtistas
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$TrackWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            cancionesSeleccionadas: preferencias.canciones,
                            onCambiarCanciones: (nuevasCanciones)=>setPreferencias((previas)=>({
                                        ...previas,
                                        canciones: nuevasCanciones
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                    lineNumber: 222,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-columna-derecha",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bloque-playlist",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bloque-cabecera",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "bloque-titulo",
                                        children: "Playlist generada"
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "bloque-subtitulo",
                                        children: "Aquí aparecen las canciones según tus widgets. Puedes regenerarla, añadir más temas, marcar favoritos o quitar los que no te encajen."
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "botones-playlist",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "boton-playlist",
                                        onClick: generarPlaylist,
                                        disabled: cargandoPlaylist,
                                        children: cargandoPlaylist ? "Generando..." : "Generar playlist"
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "boton-playlist secundario",
                                        onClick: agregarMasCanciones,
                                        disabled: cargandoPlaylist || listaReproduccion.length === 0,
                                        children: "Añadir más canciones"
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this),
                            errorPlaylist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "texto-error-busqueda",
                                children: errorPlaylist
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 315,
                                columnNumber: 15
                            }, this),
                            listaReproduccion.length === 0 && !cargandoPlaylist && !errorPlaylist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lista-vacia",
                                children: [
                                    "Todavía no hay canciones. Configura tus widgets y pulsa",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: ' "Generar playlist"'
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 321,
                                        columnNumber: 17
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 319,
                                columnNumber: 15
                            }, this),
                            listaReproduccion.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lista-playlist",
                                children: listaReproduccion.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$TrackCard$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        track: track,
                                        esFavorito: esFavorito(track.id),
                                        onToggleFavorito: toggleFavorito,
                                        onEliminar: eliminarTrackDePlaylist
                                    }, track.id, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 328,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 326,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card bloque-favoritos",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bloque-cabecera",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "bloque-titulo",
                                                children: "Tus canciones favoritas"
                                            }, void 0, false, {
                                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                                lineNumber: 340,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "bloque-subtitulo",
                                                children: [
                                                    "Se guardan en ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        children: "localStorage"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                                        lineNumber: 342,
                                                        columnNumber: 29
                                                    }, this),
                                                    ". Puedes marcarlas desde la playlist."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                                lineNumber: 341,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 339,
                                        columnNumber: 11
                                    }, this),
                                    favoritos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "lista-vacia",
                                        children: "Aún no has marcado ninguna canción como favorita."
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "lista-favoritos",
                                        children: favoritos.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    track.name,
                                                    " ·",
                                                    " ",
                                                    track.artists?.map((a)=>a.name).join(", ")
                                                ]
                                            }, track.id, true, {
                                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                                lineNumber: 353,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 338,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                        lineNumber: 285,
                        columnNumber: 10
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                    lineNumber: 284,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
            lineNumber: 221,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
        lineNumber: 220,
        columnNumber: 3
    }, this);
}
}),
];

//# sourceMappingURL=Practica_Final_spotify2_Final_web_src_56ec13a1._.js.map