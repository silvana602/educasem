import { PrismaClient } from '@prisma/client'

// Crear tipo global para evitar múltiples instancias en dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Instancia de Prisma
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query'], // opcional
  })

// Guardar en global para Hot Reload
if (process.env.NODE_ENV !== 'production') global.prisma = prisma