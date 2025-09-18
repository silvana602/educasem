"use client";

import { useState, useEffect } from "react";

export function useRememberMe() {
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    try {
      const storedRemember = localStorage.getItem("rememberMe") === "true";
      const storedEmail = localStorage.getItem("userEmail") || "";

      console.log("🔄 Cargando datos guardados:", { storedRemember, storedEmail });

      setRememberMe(storedRemember);
      
      // Solo establecer el email si "recordarme" estaba activado
      if (storedRemember && storedEmail) {
        setSavedEmail(storedEmail);
        console.log("✅ Email restaurado:", storedEmail);
      }
    } catch (error) {
      console.error("Error cargando localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleRememberMe = () => {
    setRememberMe((prev) => {
      const newValue = !prev;
      
      console.log("🔄 Cambiando recordarme:", prev, "→", newValue);
      
      try {
        localStorage.setItem("rememberMe", String(newValue));
        
        // Si se desactiva "recordarme", limpiar email guardado
        if (!newValue) {
          localStorage.removeItem("userEmail");
          setSavedEmail("");
          console.log("🗑️ Email eliminado del localStorage");
        }
      } catch (error) {
        console.error("Error guardando en localStorage:", error);
      }
      
      return newValue;
    });
  };

  const saveEmail = (email: string) => {
    console.log("💾 Intentando guardar email:", email, "| RememberMe:", rememberMe);
    
    if (rememberMe && email) {
      try {
        localStorage.setItem("userEmail", email);
        setSavedEmail(email);
        console.log("✅ Email guardado exitosamente:", email);
      } catch (error) {
        console.error("Error guardando email:", error);
      }
    } else {
      console.log("⏭️ No guardando email (recordarme desactivado o email vacío)");
    }
  };

  return {
    rememberMe,
    savedEmail,
    toggleRememberMe,
    saveEmail,
    isLoaded, // Para evitar parpadeos en el UI
  };
}