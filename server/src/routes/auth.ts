import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import axios from 'axios'
import { primas } from '../lib/prisma'
export async function authRotes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchma = z.object({
      code: z.string(),
    })

    const { code } = bodySchma.parse(request.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )
    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await primas.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!user) {
      user = await primas.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          avatarUser: userInfo.avatar_url,
          name: userInfo.name,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUser,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
