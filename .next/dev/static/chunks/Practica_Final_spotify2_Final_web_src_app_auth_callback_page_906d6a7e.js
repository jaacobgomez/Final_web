(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CallbackPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Practica_Final/spotify2/Final_web/src/lib/auth.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CallbackPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const hasProcessed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    console.log('CallbackPage rendered with searchParams:', Array.from(searchParams.entries()));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallbackPage.useEffect": ()=>{
            // Prevenir ejecución duplicada
            if (hasProcessed.current) return;
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const errorParam = searchParams.get('error');
            if (errorParam) {
                setError('Autenticación cancelada');
                return;
            }
            if (!code) {
                setError('No se recibió código de autorización');
                return;
            }
            // Validar state para prevenir CSRF
            const savedState = localStorage.getItem('spotify_auth_state');
            if (!state || state !== savedState) {
                setError('Error de validación de seguridad (CSRF). Intenta iniciar sesión de nuevo.');
                localStorage.removeItem('spotify_auth_state');
                return;
            }
            // Limpiar state después de validar
            localStorage.removeItem('spotify_auth_state');
            // Marcar como procesado
            hasProcessed.current = true;
            // Intercambiar código por token
            const exchangeCodeForToken = {
                "CallbackPage.useEffect.exchangeCodeForToken": async (code)=>{
                    try {
                        const response = await fetch('/api/spotify-token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                code
                            })
                        });
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(data.error || 'Error al obtener token');
                        }
                        // Guardar tokens
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$src$2f$lib$2f$auth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveTokens"])(data.access_token, data.refresh_token, data.expires_in);
                        // Redirigir al dashboard
                        router.push('/dashboard');
                    } catch (error) {
                        console.error('Error:', error);
                        setError(error.message);
                    }
                }
            }["CallbackPage.useEffect.exchangeCodeForToken"];
            exchangeCodeForToken(code);
        }
    }["CallbackPage.useEffect"], [
        searchParams,
        router
    ]);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-900",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-red-500 mb-4",
                        children: "Error"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white mb-6",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/'),
                        className: "bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700",
                        children: "Volver al inicio"
                    }, void 0, false, {
                        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
            lineNumber: 78,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center min-h-screen bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                    lineNumber: 96,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white text-xl",
                    children: "Autenticando..."
                }, void 0, false, {
                    fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
            lineNumber: 95,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Practica_Final/spotify2/Final_web/src/app/auth/callback/page.js",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(CallbackPage, "m9QsBuk0IJe4BCM+zVo33qfpaHU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Practica_Final$2f$spotify2$2f$Final_web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = CallbackPage;
var _c;
__turbopack_context__.k.register(_c, "CallbackPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Practica_Final_spotify2_Final_web_src_app_auth_callback_page_906d6a7e.js.map