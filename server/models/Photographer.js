const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  date:{
    type: Date,
    default: Date.now
},
  name: {
    type: String,
    // required: 'This field is required.'
  },
  address: {
    type: String,
    // required: 'This field is required.'
  },
  location:{
    type: String,
    // required: 'This field is required.'
  },
  addressUrl:{
    type: String,
    default: 'N/A'
  },
  about: {
    type: String,
    // required: 'This field is required.'
  },
  contact:{
    type: Number,
    // required: 'This field is required.'
  },
  email: {
    type: String,
    // required: 'This field is required.'
  },
  services: [{
    type: String,
    // required: 'This field is required.'
  }],
  since: {
    type: String,
    // required: 'This field is required.'
  },
  paymentTerms: {
    type: String,
    // required: 'This field is required.'
  },
  travelCost: {
    type: String,
    // required: 'This field is required.'
  },
  mostBooked: {
    type: String,
    // required: 'This field is required.'
  },
  deliveryTime: {
    type: String,
    // required: 'This field is required.'
  },
  budget: {
    type: Number,
    // required: 'This field is required.'
  },
  instaUrl:{
    type: String,
    default: 'N/A'
  },
  fbUrl:{
    type: String,
    default: 'N/A'
  },
  photo: {
    type: String,
    // required: 'This field is required.'
  },
  photoVideo: {
    type: String,
    // required: 'This field is required.'
  },
  albums: {
    type: String,
    // required: 'This field is required.'
  },
  packages: [{
    package_name: String,
    package_price: Number
  }],
  smallFunction: {
    type: String,
    // required: 'This field is required.'
  },
  profilePhoto: {
    type: String,
    // required: 'This field is required.'
  },
  photos: {
    type: Array,
  },
  ratings: [{
    user_id: {
      type: String
    },
    rate: {
      type: Number
    }
  }],
  averageRating:{
    type: Number,
    default: 0
  }
});

// photographerSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
photographerSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Photographer', photographerSchema);