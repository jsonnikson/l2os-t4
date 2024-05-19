import { GarphSchema, buildSchema as gBuildSchema, InferResolvers } from 'garph'

const g = new GarphSchema()

const carType = g.type('Car', {
  id: g.id(),
  make: g.string(),
  model: g.string(),
  year: g.int(),
  color: g.string(),
  price: g.float(),
  mileage: g.int(),
  fuelType: g.string(),
  transmission: g.string(),
})

const translationType = g.type('Translation', {
  id: g.id(),
  text: g.string(),
})

const lexemeType = g.type('Lexeme', {
  id: g.id(),
  text: g.string(),
  translations: g.ref(translationType).list(),
})

export const queryType = g.type('Query', {
  cars: g.ref(carType).list(),
  lexemes: g.ref(lexemeType).list().args({
    filter: g.string().optional(),
  }),
})

type Resolvers = { Query: typeof queryType }

export const buildResolvers = <Ctx>(resolvers: InferResolvers<Resolvers, { context: Ctx }>) =>
  resolvers
// BUG [garph]: resolvers should be passable as undefined to get a valid schema, but this breaks
export const buildSchema = <Ctx>(resolvers?: ReturnType<typeof buildResolvers<Ctx>>) =>
  gBuildSchema({ g, resolvers: resolvers || ({} as any) })
