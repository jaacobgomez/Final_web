/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// QR generado en el propio móvil (el enlace no sale a ningún servicio externo)
export default function CodigoQR({ texto }) {
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    let activo = true;
    QRCode.toDataURL(texto, { margin: 1, width: 480, errorCorrectionLevel: "M" })
      .then((url) => activo && setImagen(url))
      .catch(() => activo && setImagen(""));
    return () => {
      activo = false;
    };
  }, [texto]);

  if (!imagen) return null;
  return <img src={imagen} alt={`Código QR para entrar: ${texto}`} className="fiesta-qr" />;
}
