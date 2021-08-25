import axios from 'axios'
import fs from 'fs'
import * as changeCase from 'change-case'

type Book = {
  participante_id: string
  isbn: string
  wp_posts_ID: string
  titulo: string
  subtitulo: null
  stand: string
  autor: string | null
  ano: null
  chancela: string | null
  idioma: null
  dimensoes: null
  encadernacao: null
  paginas: null
  link_comprar: null
  pvp: string
  pvp_feira: string
  livro_do_dia_datas: string[]
  pvp_livro_do_dia: string
  promocao_datas: null
  pvp_promocao: null
  invisuais_formato: null
  sinopse: null
  wp_updated_at: string
  created_at: string
  updated_at: string
  ID: string
  post_title: string
  pvp_dia: string
  participant_name: string
  cover_jpg: string | null
  cover_webp: string | null
}

type BookLite = Pick<
  Book,
  | 'isbn'
  | 'titulo'
  | 'stand'
  | 'autor'
  | 'chancela'
  | 'pvp'
  | 'pvp_feira'
  | 'livro_do_dia_datas'
  | 'pvp_livro_do_dia'
  | 'participant_name'
>

const fetchBooks = async () => {
  const res = await axios.get<Book[]>(
    'https://feiradolivrodelisboa.pt/_fll/wp-admin/admin-ajax.php',
    {
      params: {
        action: 'getSearchedBooks',
        day: 'all',
        invisuais: 0,
        limit: 10000,
        'livros-do-dia': 1,
        offset: 0,
      },
    },
  )

  return res.data
}

const tidyBook = (book: Book): BookLite => {
  return {
    isbn: book.isbn,
    titulo: book.titulo.trim(),
    stand: book.stand.trim(),
    autor: (book.autor || '').trim(),
    pvp: book.pvp,
    pvp_feira: book.pvp_feira,
    pvp_livro_do_dia: book.pvp_livro_do_dia,
    participant_name: book.participant_name.trim(),
    livro_do_dia_datas: book.livro_do_dia_datas.filter(
      (date) => !date.startsWith('1970'),
    ),
    chancela: (book.chancela || book.participant_name).trim(),
  }
}

const run = async () => {
  const books = await fetchBooks()
  const tidiedBooks = books.map((book) => tidyBook(book))

  fs.writeFileSync(
    `./out/books-list-${changeCase.paramCase(new Date().toISOString())}.json`,
    JSON.stringify(tidiedBooks),
  )
}

run()
