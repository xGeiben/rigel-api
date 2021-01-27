const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Store = require('../models/store');

const { verifyToken } = require('../middlewares/auth');
const app = express();





app.get('/store', verifyToken, (req, res) => {
  let from = req.query.from || 0;
  let limit = req.query.limit || 5;

  from = Number(from);
  limit = Number(limit);

  Store.find({ status: true }, 'name email role status google')
    .skip(from)
    .limit(limit)
    .exec( (err, stores) => {
     if( err ) {
       return res.status(400).json({
         ok: false,
         err
       });
     };

     Store.collection.countDocuments({ status: true }, (err, count) => {

      res.json({
        ok: true,
        stores,
        cuantos: count
      });

     });

    
    })



});

app.post('/store', (req, res) => {

  let body = req.body;
  let store = new Store({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });
  store.id = store._id;
  store.save( (err, storeDB) => {

    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    
    res.json({
      ok: true,
      store: storeDB
    });

  });
});




app.put('/store/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);



  Store.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, storeDB) => {

    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    res.json({
      ok: true,
      store: storeDB
    });

  });

});




app.delete('/store/:id', verifyToken, (req, res) => {
  
  let id = req.params.id;

  let updateEstatus = {
    status: false
  };


  Store.findByIdAndUpdate(id, updateEstatus, { new: true },  (err, deletedStore) => {
    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if ( !deletedStore ) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Store not found'
        }
      });
    }

    res.json({
      ok: true,
      store: deletedStore
    });
  });




});


module.exports = app;