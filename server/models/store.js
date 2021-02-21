const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
  values: ['ADMIN_ROLE', 'BASIC_STORE_ROLE'],
  message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let storeSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: [true, 'Name is a required field']},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String, required: false },
  role: { type: String, default: 'BASIC_STORE_ROLE', enum: validRoles },
  status: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
  // might move these into his own schema
  plan: { type: Schema.Types.ObjectId, ref: 'Plan' },
  creationDate: { type: Date },
  nextBillingDate: { type: Date },
  addedStrains: { type: Number, required: true, default: 0 },
  publishedStrains: { type: Number, required: true, default: 0 },
});

// storeSchema.methods.Publish = function() {
//   store
// }


storeSchema.methods.toJSON = function() {
  let store = this;
  let storeObject = store.toObject();
  // storeObject.id = storeObject._id;
  delete storeObject.password;
  // delete storeObject._id;
  // delete storeObject.__v;

  return storeObject;
}

storeSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'} );

module.exports = mongoose.model('Store', storeSchema);