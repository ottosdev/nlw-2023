import { PrismaClient } from '@prisma/client'

export const primas = new PrismaClient({
  log: ['query'],
})
