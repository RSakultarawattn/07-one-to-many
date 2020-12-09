const express = require('express');

const Book = require('./models/Books');
const Chapter = require('./models/Chapters');




const app = express();

app.use(express.json());



app.post('/api/v1/books', (req, res, next) => {
  Book
    .insert(req.body)
    .then(book => res.send(book))
    .catch(next);
});
  
  
app.get('/api/v1/books', (res) => {
  Book
    .find()
    .then(book => res.send(book));
});
  
app.get('/api/v1/books/:id', (req, res, next) => {
  Book
    .findById(req.params.id)
    .then(book => res.send(book))
    .catch(next);
  
});
  
  
app.put('/api/v1/books/:id', (req, res, next) => {
  Book  
    .update(req.params.id, req.body)
    .then(book => res.send(book))
    .catch(next);
});
  
  
app.delete('/api/v1/books/:id', (req, res) => {
  Book
    .delete(req.params.id)
    .then(book => res.send(book));
      
    
});

app.post('/api/v1/chapters', (req, res, next) => {
  Chapter
    .insert(req.body)
    .then(chapter => res.send(chapter))
    .catch(next);
});
    
    
app.get('/api/v1/chapters', (res) => {
  Chapter
    .find()
    .then(chapter => res.send(chapter));
});
    
app.get('/api/v1/chapters/:id', (req, res, next) => {
  Chapter
    .findById(req.params.id)
    .then(chapter => res.send(chapter))
    .catch(next);
    
});
    
    
app.put('/api/v1/chapters/:id', (req, res, next) => {
  Chapter  
    .update(req.params.id, req.body)
    .then(chapter => res.send(chapter))
    .catch(next);
});
    
    
app.delete('/api/v1/chapters/:id', (req, res) => {
  Chapter
    .delete(req.params.id)
    .then(chapter => res.send(chapter));
        
      
});
  

module.exports = app;
