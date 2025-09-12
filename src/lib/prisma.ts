// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // opcional: muestra queries en consola
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
