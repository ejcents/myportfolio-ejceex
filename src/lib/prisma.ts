import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaInstance = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaInstance;
}

export const prisma = prismaInstance;
export default prisma;