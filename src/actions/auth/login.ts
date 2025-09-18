"use server";

import { signIn } from "@/auth.config";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validación básica
    if (!email || !password) {
      return 'Por favor, completa todos los campos';
    }

    // Usar signIn sin redirectTo para manejar el redirect manualmente
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Si el result indica éxito, redirigir
    if (result && !result.error) {
      window.location.replace("/dashboard");
      // redirect("/dashboard");
    } else {
      return 'Credenciales inválidas';
    }

  } catch (error: unknown) {
    console.log('Login error:', error);

    // Manejar redirect errors (son válidos)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    // Manejar errores de credenciales
    if (error instanceof Error) {
      if (error.name === 'CredentialsSignin' || 
          error.message?.includes('CredentialsSignin')) {
        return 'Credenciales inválidas';
      }
    }

    return 'Error del servidor. Intenta de nuevo.';
  }
}