"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, target = 'body' }) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Crear un contenedor específico para modales si no existe
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      modalRoot.style.position = 'relative';
      modalRoot.style.zIndex = '9999';
      document.body.appendChild(modalRoot);
    }
    
    setContainer(modalRoot);
    setMounted(true);

    // Cleanup function
    return () => {
      // Solo removemos el contenedor si está vacío
      if (modalRoot && modalRoot.children.length === 0) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
};

export default Portal;