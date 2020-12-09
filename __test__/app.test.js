const fs = require('fs');
const request = require('supertest');
const Book = require('../lib/models/Books.js');
const app = require('../lib/sql/app.js');
const pool = require('../lib/utils/pool');




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

  it('finds a book by id via GET', async() => {
    const book = await Book.insert({ title: 'shunned', description: 'outcast', author: 'Left Out' });
    
    const response = await request(app)
      .get(`/api/v1/books/${book.id}`);
    
    expect(response.body).toEqual(book);
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
  
