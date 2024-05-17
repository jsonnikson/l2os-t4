import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'

// User
export const UserTable = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})

export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>
export const insertUserSchema = createInsertSchema(UserTable)
export const selectUserSchema = createSelectSchema(UserTable)

// Car
export const CarTable = sqliteTable('Car', {
  id: text('id').primaryKey(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  price: real('price').notNull(),
  mileage: integer('mileage').notNull(),
  fuelType: text('fuelType').notNull(),
  transmission: text('transmission').notNull(),
})

export type Car = InferSelectModel<typeof CarTable>
export type InsertCar = InferInsertModel<typeof CarTable>
export const insertCarSchema = createInsertSchema(CarTable)
export const selectCarSchema = createSelectSchema(CarTable)

// Lexemes
export const LexemeTable = sqliteTable('Lexeme', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
})

export type Lexeme = InferSelectModel<typeof LexemeTable>
export type InsertLexeme = InferInsertModel<typeof LexemeTable>
export const insertLexemeSchema = createInsertSchema(LexemeTable)
export const selectLexemeSchema = createSelectSchema(LexemeTable)

// Translations
export const TranslationTable = sqliteTable('Translation', {
  id: text('id').primaryKey(),
  lexemeId: text('lexemeId').notNull().references(() => LexemeTable.id), 
  text: text('text').notNull(),
}, t => ({
  unq: unique().on(t.lexemeId, t.text)
}))

export type Translation = InferSelectModel<typeof TranslationTable>
export type InsertTranslation = InferInsertModel<typeof TranslationTable>
export const insertTranslationSchema = createInsertSchema(TranslationTable)
export const selectTranslationSchema = createSelectSchema(TranslationTable)

