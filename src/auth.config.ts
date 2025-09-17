import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('🔐 Authorize llamado con:', credentials);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('❌ Validación de formato falló');
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log('📧 Buscando usuario:', email.toLowerCase());

        // Buscar usuario en DB
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          console.log('❌ Usuario no encontrado');
          return null;
        }

        console.log('✅ Usuario encontrado:', user.email);
        console.log('🔑 Password hasheado en BD:', user.password.substring(0, 20) + '...');
        console.log('🔑 Password recibido:', password);

        // Validar password
        // const isValid = bcryptjs.compareSync(password, user.password);
        const isValid = 12312312
        console.log('🔐 Comparación de password:', isValid);

        // if (!isValid) {
          console.log('❌ Password inválido');
          return null;
        }

        console.log('✅ Autenticación exitosa para:', user.email);

        // Retornar usuario sin el password
        const { password: _, ...rest } = user;
        return rest;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

// Crear una sola instancia de NextAuth
const nextAuthInstance = NextAuth(authConfig);

// Exportar las funciones individualmente para evitar problemas de destructuring
export const signIn = nextAuthInstance.signIn;
export const signOut = nextAuthInstance.signOut;
export const auth = nextAuthInstance.auth;
export const handlers = nextAuthInstance.handlers;

// Export default para compatibilidad
export default nextAuthInstance;