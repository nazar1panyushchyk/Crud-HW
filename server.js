const express = require('express'); 
const fs = require('fs'); 
const path = require('path'); 
const bodyParser = require('body-parser'); 
const { v4: uuidv4 } = require('uuid'); 
 
const app = express(); 
const PORT = 3000; 
const DB_FILE = path.join(__dirname, 'db.json'); 
 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
 
function readDatabase() { 
  const data = fs.readFileSync(DB_FILE, 'utf8'); 
  return JSON.parse(data); 
} 
 
function writeDatabase(data) { 
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8'); 
} 
 
app.get('/movies', (req, res) => { 
  const db = readDatabase(); 
  res.json(db.movies); 
}); 
 
app.post('/movies', (req, res) => { 
  const db = readDatabase(); 
  const newMovie = { id: uuidv4(), ...req.body }; 
  db.movies.push(newMovie); 
  writeDatabase(db); 
  res.status(201).json(newMovie); 
}); 
 
app.put('/movies/:id', (req, res) => { 
  const { id } = req.params; 
  const db = readDatabase(); 
  const movieIndex = db.movies.findIndex(movie => movie.id === id); 
 
  if (movieIndex === -1) { 
    return res.status(404).json({ message: 'Movie not found' }); 
  } 
 
  db.movies[movieIndex] = { ...db.movies[movieIndex], ...req.body }; 
  writeDatabase(db); 
  res.json(db.movies[movieIndex]); 
}); 
 
app.delete('/movies/:id', (req, res) => { 
  const { id } = req.params; 
  const db = readDatabase(); 
  const updatedMovies = db.movies.filter(movie => movie.id !== id); 
 
  if (updatedMovies.length === db.movies.length) { 
    return res.status(404).json({ message: 'Movie not found' }); 
  } 
 
  db.movies = updatedMovies; 
  writeDatabase(db); 
  res.status(204).send(); 
}); 
 
app.use(express.static(path.join(__dirname, 'public'))); 
 
app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`); 
});