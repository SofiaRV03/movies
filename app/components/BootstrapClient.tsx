"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Importar el JS de Bootstrap solo en el lado del cliente una vez
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
