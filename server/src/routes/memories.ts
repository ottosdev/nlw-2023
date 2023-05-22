import { FastifyInstance } from 'fastify'
import { primas } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await primas.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return memories.map((memory) => {
      return {
        id: memory.id,
        covertUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
        createdAt: memory.createdAt,
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await primas.memory.findFirstOrThrow({
      where: { id },
    })
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }
    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = {
      content,
      coverUrl,
      isPublic,
      userId: request.user.sub,
    }
    const saveMemory = await primas.memory.create({
      data: {
        ...memory,
      },
    })

    return saveMemory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memoryExist = await primas.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memoryExist.isPublic && memoryExist.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    const memory = {
      content,
      coverUrl,
      isPublic,
    }
    const updateMemory = await primas.memory.update({
      where: { id },
      data: {
        ...memory,
      },
    })

    return updateMemory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memoryExist = await primas.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memoryExist.isPublic && memoryExist.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await primas.memory.delete({
      where: { id },
    })
  })
}
