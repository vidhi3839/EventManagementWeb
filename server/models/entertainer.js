const mongoose = require('mongoose');
const entertainerSchema = new mongoose.Schema({
   date:{
       type: Date,
       default: Date.now
   },
  name: {
    type: String,
    required: 'This field is required.'
  },
  address: {
    type: String,
    required: 'This field is required.'
  },
  location:{
    type: String,
    required: 'This field is required.'
  },
  addressUrl:{
      type: String,
    default: 'N/A'
  },
  about: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  services: {
    type: String,
    required: 'This field is required.'
  },
  since: {
    type: String,
    required: 'This field is required.'
  },
  payment_terms:{
    type: String,
    required: 'This field is required.'
  },
  experience: {
    type: String,
    required: 'This field is required.'
  },
  budget:{
    type:Number,
    required: 'This field is required.'
  },
  travelCost: {
    type: String,
    required: 'This field is required.'
  },
  instaUrl:{
      type: String,
    default: 'N/A'
  },
  fbUrl:{
      type: String,
    default: 'N/A'
  },
  prices: [{
    event:{
    type: String,
    required: 'This field is required.'
    },
    price:{
      type: Number,
    required: 'This field is required.'
    }
}],

  portfolioPhoto: {
    type: String,
    required: 'This field is required.'
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
// entertainerSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
entertainerSchema.index({ "$**" : 'text' });
module.exports = mongoose.model('Entertainer', entertainerSchema);