const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
  //  required: 'This field is required.'
  },
  userRating: {
    type: Number,
    required: 'This field is required.'
  },
  userRatingDes: {
    type: String,
    required: 'This field is required.'
  },
  reviewDate:{
    type: String,
  },
  userid:{
    type:String,
   // required : 'This field is required'
}
});

module.exports = mongoose.model('review', reviewSchema);