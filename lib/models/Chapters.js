const pool = require('../utils/pool');


module.exports = class Chapter {
    id;
    length;
    chapterId;

    constructor(row) {
      this.id = String(row.id);
      this.length = row.length;
      this.chapterId = String(row.chapter_id);
    }

    static async insert({ length, chapterId }) {
      const { rows } = await pool.query(
        'INSERT INTO chapters(length, chapter_id) VALUES ($1, $2) RETURNING *',
        [length, chapterId] 
      );

      return new Chapter(rows[0]);
    }
};


