const fs = require('fs');
const request = require('supertest');
const Book = require('../lib/models/Books.js');
const app = require('../lib/app.js');
const pool = require('../lib/utils/pool');
const Chapter = require('../lib/models/Chapters.js');



describe('app tests', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./lib/sql/setup.sql', 'utf-8'));
  });
    
  afterAll(() => {
    return pool.end();
  });
  
  it('creates a book via POST', async() => {
    const response = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'shunned',
        description: 'outcast',
        author: 'Left Out'
      });
  
    expect(response.body).toEqual({
      id: '1',
      title: 'shunned',
      description: 'outcast',
      author: 'Left Out'

    });
  });

  it('finds a book by id and associated chapters via GET', async() => {
    const book = await Book.insert({
      title: 'clowns',
      description: 'scary',
      author: 'Pennywise'
    });

    const chapters = await Promise.all([
      { length: 5, bookId: book.id },
      { length: 10, bookId: book.id },
      { length: 3, bookId: book.id }
    ].map(chapter => Chapter.insert(chapter)));

    const res = await request(app)
      .get(`/api/v1/books/${book.id}`);

    expect(res.body).toEqual({
      ...book,
      chapters: expect.arrayContaining(chapters)
    });
  });

  it('finds all books via GET', async() => {
    const books = await Promise.all([
      {
        title: 'clowns',
        description: 'scary',
        author: 'Pennywise'
      },
      {
        title: 'clowns',
        description: 'sad',
        author: 'Pennywise'
      },
      {
        title: 'clowns',
        description: 'funny',
        author: 'Pennywise'
      }
    ].map(book => Book.insert(book)));

    const res = await request(app)
      .get('/api/v1/books');

    expect(res.body).toEqual(expect.arrayContaining(books));
    expect(res.body).toHaveLength(books.length);
  });
    
  it('updates a book by id via PUT', async() => {
    const book = await Book.insert({ title: 'swooned', description: 'fainted', author: 'Fell Down' });
    
    const response = await request(app)
      .put(`/api/v1/books/${book.id}`)
      .send({
        title: 'swooned',
        description: 'fainted',
        author: 'Stood Up'
        

      });
    
    expect(response.body).toEqual({
      ...book,
      title: 'swooned',
      description: 'fainted',
      author: 'Stood Up'
    });
  });
  it('removes a book by id via DELETE', async() => {
    const book = await Book.insert({ title: 'recall', description: 'recollections', author: 'Jess Remembered' });
    
    const response = await request(app)
      .delete(`/api/v1/books/${book.id}`);
    
    expect(response.body).toEqual(book);

  });
});
  
