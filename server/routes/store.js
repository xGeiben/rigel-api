const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Store = require('../models/store');
const { verifyToken } = require('../middlewares/auth');
const app = express();
const router = express.Router();


router.route('/store')
  .get(verifyToken, (req, res) => {
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
      });
  })
  .post((req, res) => {
    let body = req.body;
    let store = new Store({
      name: body.name,
      addedStrains: 0,
      publishedStrains: 0,
      email: body.email,
      creationDate: new Date(),
      password: bcrypt.hashSync(body.password, 10),
      role: body.role,
    });
    store.id = store._id;
    store.save( (err, storeDB) => {
  
      if ( err ) {
        return res.status(500).json({
          ok: false,
          err
        });
      };
  
      if ( !storeDB ) {
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
  })

router.route('/store/:id')
  .put(verifyToken, (req, res) => {
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
  })
  .delete((req, res) => {
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
  })






module.exports = router;