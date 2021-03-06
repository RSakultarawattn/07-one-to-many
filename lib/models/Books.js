//const { static } = require('express');
const pool = require('../utils/pool');
const Chapter = require('./Chapters')

module.exports = class Book {
    id;
    title;
    description;
    author;
    


    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.description = row.description;
      this.author = row.author;
      
    }

    static async insert({ title, description, author}) {
      const { rows } = await pool.query(
        'INSERT INTO books (title, description, author) VALUES ($1, $2, $3) RETURNING *',
        [title, description, author]
      );

      return new Book(rows[0]);
    }


    static async find() {
      const { rows } = await pool.query('SELECT * FROM books'); 

      return rows.map(row => new Book(row));
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT
         books.*,
         array_to_json(array_agg(chapters.*)) AS chapters
          FROM 
          books 
          JOIN chapters
          ON books.id = chapters.book_id
          WHERE books.id=$1
          GROUP BY books.id
          `,
        [id]
      );
      if(!rows[0]) throw new Error(`No book with id ${id}`);
      return {
        ...new Book(rows[0]),
        chapters: rows[0].chapters.map(chapter => new Chapter(chapter))
      };
    }

    static async update(id, { title, description, author }) {
      const { rows } = await pool.query(
        `UPDATE books 
        SET title=$1,
            description=$2,
            author=$3
        WHERE id=$4
        RETURNING *
      `,
        [title, description, author, id]
      );

      return new Book(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM books WHERE id=$1 RETURNING *',
        [id]
      );

      return new Book(rows[0]);
    }
};
