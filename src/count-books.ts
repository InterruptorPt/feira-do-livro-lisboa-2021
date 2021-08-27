import fs from 'fs/promises'
import path from 'path'

const countBooksInEachFile = async () => {
  const files = await fs.readdir('./out')
  const jsonFiles = files.filter((file) => file.endsWith('.json'))

  const details = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.resolve(__dirname, `../out/${file}`)

      const books = (await import(filePath)).default

      return { file, count: books.length }
    }),
  )

  console.table(details)
}

countBooksInEachFile()
