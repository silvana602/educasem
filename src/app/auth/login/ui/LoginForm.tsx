'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Por favor, completa todos los campos')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        setError('Credenciales inválidas')
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error en el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}

        {/* Correo */}
        <input
          type="email"
          placeholder="tu@email.com"
          className="input-field"
          name="email"
          required
          disabled={loading}
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="input-field"
          name="password"
          required
          disabled={loading}
        />

        {/* Opciones */}
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" /> Recordarme
          </label>
          <a href="/forgot-password" className="forgot-link">
            ¿Olvidó su contraseña?
          </a>
        </div>

        {/* Botón login */}
        <LoginButton loading={loading} />

        {/* Separador */}
        <div className="divider">
          <span>O continua con</span>
        </div>

        {/* Botón Google */}
        <button type="button" className="google-btn" disabled={loading}>
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
            className="google-icon"
          />
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
  )
}

function LoginButton({ loading }: { loading: boolean }) {
  return (
    <button 
      type="submit" 
      className={clsx({
        "btn btn-primary": !loading,
        "btn btn-disabled": loading
      })}
      disabled={loading}
    >
      {loading ? 'Cargando...' : 'Ingresar'}
    </button>
  );
}