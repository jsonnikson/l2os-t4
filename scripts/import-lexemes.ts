import * as fs from 'fs';

interface LexemeEntry {
    text: string
    translations: string[]
    audioURL: string
    isNew: string
}

const makeIdMap = () => {
    const ids = new Map<string, number>()
    let nextId = 1
    return (text: string) => ids.get(text) ?? ids.set(text, nextId++).get(text)
};

const sqlText = (text: string) => "'" + text.replace("'", "''") + "'"

const translationId = makeIdMap()
const lexemeId = makeIdMap()

const lexemes = JSON.parse(fs.readFileSync('./all-lexemes.json', 'utf-8')) as LexemeEntry[]

const sql = 
    'INSERT INTO Lexeme (id, text)\n' +
    'VALUES\n' +
    lexemes.map(lexeme => `(${lexemeId(lexeme.text)}, ${sqlText(lexeme.text)})`).join(',\n') +
    ';\n' +
    '\n' +
    'INSERT INTO Translation (lexemeId, id, text)\n' +
    'VALUES\n' +
    lexemes.flatMap(lexeme => lexeme.translations.map(tr =>
        '(' + [
            lexemeId(lexeme.text),
            translationId(lexeme.text + ':' + tr),
            sqlText(tr)
        ].join(',') + ')'
    )).join(',\n') + 
    ';\n'


console.log(sql)