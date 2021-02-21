const express = require('express');
const _ = require('underscore');
const Strain = require('../models/strain');
const Store = require('../models/store');
const Plan = require('../models/plan');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();              // get an instance of the express Router
const ApiError = require('../error/ApiError');



// middleware to use for all requests
// router.use(function(req, res, next) {
//     // do logging
//     //console.log('Something is happening.'); EVERY time an action occurs it enters here
//     next(); // make sure we go to the next routes and don't stop here
// });

router.route('/strain')
  .get(verifyToken, (req, res) => {
    // Strain.find({ storeId: req.query.storeId })
    Strain.find({}, { _id: 0, __v: 0 })
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
  })
  .post(verifyToken, (req, res, next) => {
    // Check if the store can add more strains
    Store.findById( req.body.storeId, { id: 1, addedStrains: 1, planId: 1 })
    .populate({ path: 'plan', select: 'addedStrainsLimit'})
    .exec( (err, storeDB) => {
      if( err ) {
        next(ApiError.badRequest(err));
      };

      // Check if the current number of strains is higher than the allowed one
      if( storeDB.addedStrains >=  storeDB.plan.addedStrainsLimit ) {
        next(ApiError.badRequest('La tienda a excedido el numero de platas que puede agregar.'));
        return;
      }
      // Passed validations
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
          next(ApiError.badRequest(err));
        };
        // Update the number of addedStrains the store has
        Store.findByIdAndUpdate(storeDB.id, { addedStrains: storeDB.addedStrains + 1 }, (err, updatedStore) => {
          if( err ) {
            next(ApiError.badRequest(err));
          };
          // Get strains by storeId
          Strain.find({ storeId: strainDB.storeId })
          .exec( (err, strains) => {
            if( err ) {
              next(ApiError.badRequest(err));
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
        });
      });
    })
  })
  .put(verifyToken, (req, res) => {
    let body = _.pick(req.body, ['cbd', 'description', 'name', 'price', 'thc', 'type']);

    Strain.findByIdAndUpdate(req.body.id, body, { new: true, runValidators: true }, (err, strainDB) => {

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
    });
  });

router.route('/strain/publish')
  .put([verifyToken], (req, res) => {
    Strain.findByIdAndUpdate(req.body.id, { live: true }, { multi: false }, (err, strainDB) => {
      if( err ) {
        return res.status(500).json({
          ok: false,
          err
        });
      };
  
      if( !strainDB ) {
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

    });
  });

router.route('/strain/unpublish')
  .put(verifyToken, (req, res) => {
    Strain.findByIdAndUpdate(req.body.id, { live: false }, { multi: false }, (err, strainDB) => {
      if( err ) {
        return res.status(500).json({
          ok: false,
          err
        });
      };
  
      if( !strainDB ) {
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
    });
  });

function errorHandler(error) {
  if (error) {
    res.json({
      ok: false,
      error: '[Strain API Error]' + error
    })
  }
}
module.exports = router;