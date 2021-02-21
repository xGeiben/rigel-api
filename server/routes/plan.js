const express = require('express');
// const _ = require('underscore');
const Plan = require('../models/plan');
const router = express.Router(); 

router.route('/plan')
  .get((req, res) => {
    Plan.find({})
    .exec( (err, plans) => {
      if( err ) {
        return res.status(400).json({
          ok: false,
          err
        });
      };

      Plan.collection.countDocuments({}, (err, count) => {
        res.json({
          ok: true,
          plans,
          count
        });
      });
    });
  })
 .post((req, res) => {
  let body = req.body;
  let plan = new Plan({
    addedStrainsLimit: body.addedStrainsLimit,
    paymentAmount: body.paymentAmount,
    planTier: body.planTier,
    publishedStrainsLimit: body.publishedStrainsLimit,
  });
  plan.id = plan._id;
  // Save the new plan
  plan.save( ( err, planDB ) => {
    if( err ) {
      return res.status(400).json({
        ok: false,
        err
      });
    };
    
    // Get all plans
    Plan.find({  })
    .exec( (err, plans) => {
      if( err ) {
        return res.status(400).json({
          ok: false,
          err
        });
      };

      // Return all the plans
      Plan.collection.countDocuments({}, (err, count) => {
        res.json({
          ok: true,
          plans,
          count
        });
      });
    });
  });
 })

 module.exports = router;