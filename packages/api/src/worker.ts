import { trpcServer } from '@hono/trpc-server'
import { createContext, Context as ApiContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { createYoga, createSchema, YogaInitialContext } from 'graphql-yoga'
import { createDb } from './db/client'
import { CarTable, Lexeme, LexemeTable, Translation, TranslationTable } from './db/schema'
import { buildSchema } from '@t4/api/src/graphql/schema'

type Bindings = {
  DB: D1Database
  JWT_VERIFICATION_KEY: string
  APP_URL: string
}

type AppEnv = { Bindings: Bindings }

const app = new Hono<AppEnv>()

// Setup CORS for the frontend
app.use('/trpc/*', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log(
      'APP_URL is not set. CORS errors may occur. Make sure the .dev.vars file is present at /packages/api/.dev.vars'
    )
  }
  return await cors({
    origin: (origin) => (origin.endsWith(new URL(c.env.APP_URL).host) ? origin : c.env.APP_URL),
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    // https://hono.dev/middleware/builtin/cors#options
  })(c, next)
})

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(opts.req, c.env.DB, c.env.JWT_VERIFICATION_KEY)
    },
  })(c, next)
})

const schema = buildSchema<YogaInitialContext & ApiContext>({
  Query: {
    cars: async (parent, args, context, info) => {
      const { db } = context
      const allCars = await db.select().from(CarTable).all()
      return allCars
    },
    lexemes: async (parent, args, context, info) => {
      const { db } = context
      const result = await db.batch([
        db.select().from(LexemeTable),
        db.select().from(TranslationTable),
      ])
      const [lexemeResult, translationResult] = result
      const translationMap = translationResult.reduce((acc, row) => {
        if (acc.has(row.lexemeId)) acc.get(row.lexemeId)?.push(row)
        else acc.set(row.lexemeId, [row])
        return acc
      }, new Map<Lexeme['id'], Array<Translation>>())
      return lexemeResult
        .filter((lexeme) => !args.filter || lexeme.text.includes(args.filter))
        .map((lexeme) => ({
          ...lexeme,
          translations: translationMap.get(lexeme.id) || [],
        }))
    },
  },
})

app.on(['POST', 'GET', 'OPTIONS'], '/graphql/*', async (c) =>
  createYoga({
    schema,
    context: createContext(c.req.raw, c.env.DB, c.env.JWT_VERIFICATION_KEY),
  }).fetch(c.req.raw, c.env, c.executionCtx)
)

export default app
