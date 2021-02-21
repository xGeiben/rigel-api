const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Store = require('../models/store');
const app = express();


app.post('/login', (req, res) => {

  let body = req.body;

  // Store.findOne({ email: body.email }, { _id: 0, __v: 0 }, (err, storeDB) => {
  Store.findOne({ email: body.email }, { _id: 0, __v: 0 })
  .populate({ path: 'plan', select: '-_id -__v'})
  .exec( (err, storeDB) => {
    if( err ) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if ( !storeDB ) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Email) or password incorrect'
        }
      });
    }

    if ( !bcrypt.compareSync( body.password, storeDB.password ) ){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Email or (password) incorrect'
        }
      });
    }

    let token = jwt.sign({
      store: storeDB
    }, process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

    res.json({
      ok: true,
      store: storeDB,
      token: token
    });
  });
});



module.exports = app;