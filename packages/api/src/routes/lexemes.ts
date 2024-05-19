import { eq } from 'drizzle-orm'
import { Lexeme, LexemeTable, Translation, TranslationTable } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export interface LexemeWithTranslations extends Lexeme {
  translations: Translation[]
}

export const lexemesRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx
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
    // const ret = Object.values(
    //   result.reduce((acc, row) => {
    //     if (!acc[row.Lexeme.id]) acc[row.Lexeme.id] = { ...row.Lexeme, translations: [] }
    //     if (row.Translation) acc[row.Lexeme.id].translations.push(row.Translation)
    //     return acc
    //   }, {} as { [item: Lexeme['id']]: LexemeWithTranslations })
    // )
    // console.log(ret)
    return lexemeResult.map((lexeme) => ({
      ...lexeme,
      translations: translationMap.get(lexeme.id) || [],
    }))
  }),
})
