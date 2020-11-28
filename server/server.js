require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
 
app.get('/strain', function (req, res) {
  res.json('get strain')
});

app.post('/strain', function (req, res) {

  let body = req.body;
  res.json({
    strain: body
  });
});

app.put('/strain/:id', function (req, res) {
  let id = req.params.id;

  res.json({
    id
  })
});

app.delete('/strain', function (req, res) {
  res.json('delete strain')
});
 
app.listen(process.env.PORT, () => {
  console.log('Escuchando en puerto:', process.env.PORT);
});