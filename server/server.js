require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// cors
app.use(cors());

//Configuracion global de rutas
app.use(require('./routes/index'));
 
// const uri = 'mongodb+srv://geiben-usr:Joinmeindead1!@cluster0.er82s.mongodb.net/rigel-api?retryWrites=true&w=majority'
const uri = "mongodb+srv://geiben-user:TuXBaowYxiMmbHCU@cluster0.lzo7s.mongodb.net/rigel-api?retryWrites=true&w=majority";
// const uri = "mongodb+srv://geiben-user:<password>@cluster0.lzo7s.mongodb.net/<dbname>?retryWrites=true&w=majority";
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