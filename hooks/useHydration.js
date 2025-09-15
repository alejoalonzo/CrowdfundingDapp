"use client";

import { useState, useEffect } from "react";

/**
 * Hook personalizado para manejar hydratación de forma segura
 * Evita problemas de SSR/Client mismatch
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Componente wrapper para contenido que solo debe renderizarse del lado del cliente
 */
export function ClientOnly({ children, fallback = null }) {
  const isHydrated = useHydration();

  return isHydrated ? children : fallback;
}
