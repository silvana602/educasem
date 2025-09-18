import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Definir tipos personalizados
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  }
}

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      
      // En el primer login, user contiene los datos del authorize
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      
      return token;
    },

    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);
      
      // Pasar datos del token a la sesión
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image,
        };
      }
      
      return session;
    },

    // Opcional: Callback para redirección personalizada
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback - URL:", url, "Base URL:", baseUrl);
      
      // Si es una URL relativa, permitirla
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Si es la misma base URL, permitirla
      if (new URL(url).origin === baseUrl) return url;
      
      // Por defecto, redirigir al dashboard
      return `${baseUrl}/dashboard`;
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize llamado con:", credentials);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("❌ Validación de formato falló");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log("📧 Buscando usuario:", email.toLowerCase());

        // Buscar usuario en DB
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          console.log("❌ Usuario no encontrado");
          return null;
        }

        console.log("✅ Usuario encontrado:", user.email);

        // Validar password
        const isValid = bcryptjs.compareSync(password, user.password);
        console.log("🔐 Comparación de password:", isValid);

        if (!isValid) {
          console.log("❌ Password inválido");
          return null;
        }

        console.log("✅ Autenticación exitosa para:", user.email);

        // Retornar usuario sin el password y con tipado correcto
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
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