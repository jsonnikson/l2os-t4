import { g, buildSchema as gBuildSchema, InferResolvers } from 'garph'

const translationType = g.type('Translation', {
    id: g.id(),
    text: g.string(),
})

const lexemeType = g.type('Lexeme', {
    id: g.id(),
    text: g.string(),
    translations: g.ref(translationType).list()
})

const queryType = g.type('Query', {
    lexemes: g.ref(lexemeType).list()
})

type QueryResolvers = typeof queryType
type Resolvers = { Query: QueryResolvers }

export const buildResolvers = <Ctx>(resolvers: InferResolvers<Resolvers, { context: Ctx }>) => resolvers
export const buildSchema = <Ctx>(resolvers: ReturnType<typeof buildResolvers<Ctx>>) => gBuildSchema({ g, resolvers })