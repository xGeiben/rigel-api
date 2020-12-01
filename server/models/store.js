const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
  values: ['ADMIN_ROLE', 'BASIC_STORE_ROLE'],
  message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let storeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'BASIC_STORE_ROLE',
    enum: validRoles
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false,
  }
});

storeSchema.methods.toJSON = function() {
  let store = this;
  let storeObject = store.toObject();
  delete storeObject.password;

  return storeObject;
}

storeSchema.plugin( uniqueValidator, { message: '{PATH} debe de serr unico'} );

module.exports = mongoose.model('Store', storeSchema);