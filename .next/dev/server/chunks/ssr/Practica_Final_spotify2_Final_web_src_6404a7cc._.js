module.exports = [
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
(()=>{
    const e = new Error("Cannot find module '@/components/widgets/GenreWidget'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$components$2f$Widgets$2f$DecadeWidget$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/components/Widgets/DecadeWidget.jsx [app-ssr] (ecmascript)");
'use client';
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-contenedor",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 52,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid-widgets",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GenreWidget, {
                                generosSeleccionados: preferencias.generos,
                                onCambiarGeneros: (nuevosGeneros)=>setPreferencias((previas)=>({
                                            ...previas,
                                            generos: nuevosGeneros
                                        }))
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 62,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 61,
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
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card widget-placeholder",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "widget-titulo",
                                    children: "Widget de popularidad"
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "widget-texto",
                                    children: "Aquí ajustarás si quieres temas más conocidos o joyas ocultas."
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card widget-placeholder",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "widget-titulo",
                                    children: "Widget de artistas"
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "widget-texto",
                                    children: "Aquí buscarás y guardarás tus artistas clave."
                                }, void 0, false, {
                                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                            lineNumber: 90,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                    lineNumber: 51,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-columna-derecha",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "bloque-subtitulo",
                                        children: "Aquí aparecerán las canciones según tus widgets."
                                    }, void 0, false, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            listaReproduccion.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lista-vacia",
                                children: "Todavía no hay canciones. Cuando tengamos los widgets listos, podrás generar tu primera mezcla aquí."
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {}, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                        lineNumber: 100,
                        columnNumber: 11
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
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "bloque-subtitulo",
                                        children: [
                                            "Se guardan usando ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "localStorage"
                                            }, void 0, false, {
                                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                                lineNumber: 123,
                                                columnNumber: 35
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            favoritos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lista-vacia",
                                children: "Aún no has marcado ninguna canción como favorita."
                            }, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {}, void 0, false, {
                                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
                lineNumber: 99,
                columnNumber: 10
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/dashboard/page.js",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Practica_Final_spotify2_Final_web_src_6404a7cc._.js.map