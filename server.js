require('dotenv').config()

const app = require('./lib/sql/app');
const pool = require('./lib/utils/pool');


const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  
  console.log(`Started on ${PORT}`);
});

process.on('exit', () => {
  console.log('Goodbye!');
  pool.end();
});


