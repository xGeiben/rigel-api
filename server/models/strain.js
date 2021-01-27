const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let strainTypes = {
  values: ['SATIVA', 'INDICA', 'MIXED'],
  message: '{VALUE} its not a valid strain type'
};

// let errormsg = function (field) {
//   return `${field} is a required field`;
// }

let strainSchema = new Schema({
  id: { type: String, unique: true, required: true },
  cbd: { type: Number, required: true },
  description: { type: String },
  inExistence: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  live: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  name: { type: String, required: [ true, 'Name is a required field' ] },
  price: { type: Number, default: 0.00, required: [ true, 'Price is a required field'] },
  thc: { type: Number, required: true },
  type: { type: String, enum: strainTypes },
  stock: { type: Number, default: 0 },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
  views: { type: Number, default: 0 }
});

strainSchema.methods.toJSON = function() {
  let strain = this;
  let strainObject = strain.toObject();
  // strainObject.id = strainObject._id;
  // delete strainObject._id;
  // delete strainObject.__v;

  return strainObject;
}

module.exports = mongoose.model('Strain', strainSchema);