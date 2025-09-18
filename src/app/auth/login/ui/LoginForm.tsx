"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { IoLogoGoogle, IoAlertCircleOutline } from "react-icons/io5";
import { useRememberMe } from "@/hooks/useRememberMe";

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { rememberMe, savedEmail, toggleRememberMe, saveEmail } = useRememberMe();
  
  // Usar el email guardado como valor inicial
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Usar los valores del estado, no del FormData
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        setError("Credenciales inválidas");
      } else if (result?.ok) {
        // Guardar email SOLO si la autenticación es exitosa Y "Recordarme" está activado
        if (rememberMe) {
          saveEmail(email);
        }
        
        // router.push("/dashboard");
        window.location.replace('/dashboard')
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Correo */}
        <input
          type="email"
          placeholder="tu@email.com"
          className="input-field"
          name="email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email" // Ayuda al navegador a recordar
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field"
          name="password"
          required
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" // Ayuda al navegador a recordar
        />

        {/* Opciones */}
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={toggleRememberMe}
            />{" "}
            Recordarme
          </label>
          <a href="/forgot-password" className="forgot-link">
            ¿Olvidó su contraseña?
          </a>
        </div>

        {/* Error message */}
        {error && (
          <div className="msg-error">
            <IoAlertCircleOutline />
            <span>{error}</span>
          </div>
        )}

        {/* Botón login */}
        <LoginButton loading={loading} />

        {/* Separador */}
        <div className="divider">
          <span>O continua con</span>
        </div>

        {/* Botón Google */}
        <button type="button" className="google-btn" disabled={loading}>
          <IoLogoGoogle />
          Google
        </button>
      </form>

      {/* Registro */}
      <p className="signup-text">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="signup-link">
          Registrarse
        </Link>
      </p>
    </>
  );
};

function LoginButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      className={clsx({
        "btn btn-primary": !loading,
        "btn btn-disabled": loading,
      })}
      disabled={loading}
    >
      {loading ? "Cargando..." : "Ingresar"}
    </button>
  );
}