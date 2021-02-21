const mongoose = require('mongoose');
let Schema = mongoose.Schema;
var schemaOptions = {
  toObject: {
    virtuals: true
  }
  ,toJSON: {
    virtuals: true
  }
};

let planTiers = {
  values: ['FREE', 'BASIC', 'PREMIUM'],
  message: '{VALUE} its not a valid plan tier'
};

let planSchema = new Schema({
  id: { type: String, unique: true, required: true },
  addedStrainsLimit: { type: Number, required: true },
  paymentAmount: { type: Number, required: true },
  planTier: { type: String, enum: planTiers, required: true },
  publishedStrainsLimit: { type: Number, required: true },
}, schemaOptions);

module.exports = mongoose.model('Plan', planSchema);