import { InferClient, createClient } from '@garph/gqty'
import { createScalarsEnumsHash, createGeneratedSchema } from '@garph/gqty/dist/utils'
import { buildSchema, queryType } from '@t4/api/src/graphql/schema'

const schema = buildSchema()

type ClientTypes = InferClient<{ query: typeof queryType }>

export const { useQuery } = createClient<ClientTypes>({
  generatedSchema: createGeneratedSchema(schema),
  scalarsEnumsHash: createScalarsEnumsHash(schema),
  url: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
})

// Needed for the babel plugin
export { schema as compiledSchema }
