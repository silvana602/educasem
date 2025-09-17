import { getServerSession } from "next-auth/next";
import { authConfig } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function ClassLayout({ 
  children 
}: {
  children: React.ReactNode;
}) {
  // Usar getServerSession para NextAuth v4
  const session = await getServerSession(authConfig);
  console.log({ session });

  // Si el usuario ya está logueado, redirigir
  if (session?.user) {
    redirect('/dashboard'); // Cambia '/dash' por '/dashboard' o tu ruta correcta
  }

  return (
    <main>
      {children}
    </main>
  );
}