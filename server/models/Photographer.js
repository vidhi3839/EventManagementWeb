const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  address: {
    type: String,
    required: 'This field is required.'
  },
  about: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  contact: {
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
  paymentTerms: {
    type: String,
    required: 'This field is required.'
  },
  travelCost: {
    type: String,
    required: 'This field is required.'
  },
  mostBooked: {
    type: String,
    required: 'This field is required.'
  },
  deliveryTime: {
    type: String,
    required: 'This field is required.'
  },
  photo: {
    type: String,
  },
  photoVideo: {
    type: String,
  },
  candid: {
    type: String,
  },
  cinematography: {
    type: String,
  },
  studio: {
    type: String,
  },
  preWedding: {
    type: String,
  },
  albums: {
    type: String,
  },
  videography: {
    type: String,
  },
  smallFunction: {
    type: String,
  },
  profilePhoto: {
    type: String,
    required: 'This field is required.'
  },
//   portfolioPhotos: {
//     type: Array,
//     required: 'This field is required.'
//   },
//   portfolioVideos: {
//     type: Array,
//     required: 'This field is required.'
//   },
//   portfolioAlbums: {
//     type: Array,
//     required: 'This field is required.'
//   },
  rating:{
    type: String
  }

});

photographerSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Photographer', photographerSchema);