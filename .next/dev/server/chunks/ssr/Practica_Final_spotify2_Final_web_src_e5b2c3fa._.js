module.exports = [
"[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generatePlaylist",
    ()=>generatePlaylist,
    "getRandomSpotifyImage",
    ()=>getRandomSpotifyImage
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
}),
"[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/spotify.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function DashboardPage() {
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$spotify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRandomSpotifyImage"])().then(setImage).catch((err)=>{
            console.error(err);
            setError(err.message);
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "Estamos en el Dashboard"
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500 mb-4",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                lineNumber: 24,
                columnNumber: 9
            }, this),
            image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg",
                        children: [
                            image.name,
                            " — ",
                            image.artist
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: image.url,
                        alt: image.name
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                lineNumber: 29,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/Practica_Final/spotify2/Final_web/src/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PaginaInicio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/auth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$app$2f$dashboard$2f$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function PaginaInicio() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Si ya está logueado, lo mandamos directo al dashboard
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAuthenticated"])()) {
            router.push('/dashboard');
        }
    }, [
        router
    ]);
    const manejarLoginSpotify = ()=>{
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthUrl"])();
        window.location.href = url;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "portada-inicio",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tarjeta-inicio card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "texto-pequeno",
                    children: "Proyecto final · Programación Web I"
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "titulo-inicio",
                    children: "Spotify Taste Mixer"
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "texto-descripcion",
                    children: "Genera playlists personalizadas mezclando tus artistas, géneros y épocas favoritas. Todo usando tu cuenta de Spotify."
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "lista-caracteristicas",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "🎧 Widgets para artistas, géneros y décadas."
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "⭐ Marca canciones como favoritas y guárdalas."
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: "📱 Interfaz oscura, sencilla y adaptada a móvil."
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: manejarLoginSpotify,
                    className: "boton-inicio",
                    children: "Iniciar sesión con Spotify"
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "nota-inicio",
                    children: "Necesitas una cuenta de Spotify (gratuita o premium) para continuar."
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/page.js",
        lineNumber: 24,
        columnNumber: 4
    }, this);
}
}),
];

//# sourceMappingURL=Practica_Final_spotify2_Final_web_src_e5b2c3fa._.js.map