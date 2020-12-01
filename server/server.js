require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/store'));
 
const uri = 'mongodb+srv://geiben-usr:Joinmeindead1!@cluster0.er82s.mongodb.net/rigel-api?retryWrites=true&w=majority'
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {
  if( err ) throw err;

  console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando en puerto:', process.env.PORT);
});