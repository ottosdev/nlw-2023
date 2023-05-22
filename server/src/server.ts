import 'dotenv/config'
import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'
import { authRotes } from './routes/auth'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { uploadRouts } from './routes/upload'
import staticFile from '@fastify/static'
import { resolve } from 'path'

const app = fastify()

app.register(staticFile, {
  root: resolve(__dirname, '../', 'uploads'),
  prefix: '/uploads',
})

app.register(multipart)

app.register(cors, {
  origin: ['http://localhost:3000'],
})

app.register(jwt, {
  secret: 'spacetime',
})

app.register(memoriesRoutes)
app.register(authRotes)
app.register(uploadRouts)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Iniciou o servidor')
  })
