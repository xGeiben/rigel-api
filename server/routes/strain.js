const express = require('express');
const _ = require('underscore');
const Strain = require('../models/strain');
const { verifyToken } = require('../middlewares/auth');
const app = express();

app.get('/strain', verifyToken, (req, res) => {
  // let from = req.query.from || 0;
  // let limit = req.query.limit || 5;

  // from = Number(from);
  // limit = Number(limit);
  // Strain.find({ storeId: req.query.storeId })
  Strain.find({}, { _id: 0, __v: 0 })
    // .skip(from)
    // .limit(limit)
    .exec( (err, strains) => {
      if( err ) {
        return res.status(400).json({
          ok: false,
          err
        });
      };

      Strain.collection.countDocuments({}, (err, count) => {
        res.json({
          ok: true,
          strains,
          count
        });
      });
    });
});

app.post('/strain', verifyToken, (req, res) => {
  let body = req.body;
  let strain = new Strain({
    cbd: body.cbd,
    description: body.description,
    inExistence: body.inExistence,
    likes: 0,
    live: false,
    rating: 0,
    name: body.name,
    price: body.price,
    thc: body.thc,
    type: body.type,
    stock: 0,
    storeId: body.storeId,
    views: 0
  });
  strain.id = strain._id;
  // Save the new strain
  strain.save( ( err, strainDB ) => {
    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    };
    
    // Get strains by  storeId
    Strain.find({ storeId: strainDB.storeId })
    .exec( (err, strains) => {
      if( err ) {
        return res.status(400).json({
          ok: false,
          err
        });
      };

      // Return all the strains corresponding the store
      Strain.collection.countDocuments({}, (err, count) => {
        res.json({
          ok: true,
          strains,
          count
        });
      });
    });



    // res.json({
    //   ok: true,
    //   strain: strainDB
    // });
  });
});

app.put('/strain/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['cbd', 'description', 'name', 'price', 'thc', 'type']);

  Strain.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, strainDB) => {

    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    // Get strains by  storeId
    Strain.find({ storeId: strainDB.storeId })
    .exec( (err, strains) => {
      if( err ) {
        return res.status(400).json({
          ok: false,
          err
        });
      };

      // Return all the strains corresponding the store
      Strain.collection.countDocuments({}, (err, count) => {
        res.json({
          ok: true,
          strains,
          count
        });
      });
    });

    // res.json({
    //   ok: true,
    //   strain: strainDB
    // });
  });
});

module.exports = app;