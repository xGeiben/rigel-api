const express = require('express');
const app = express();

app.use(require('./store'));
app.use(require('./login'));

module.exports = app;