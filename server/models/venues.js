const mongoose = require('mongoose');
const venueSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  }, 
  userid:{
    type:String,
   // required : 'This field is required'
  },
  name: {
    type: String,
  //  required: 'This field is required.'
  },
  address: {
    type: String,
  //  required: 'This field is required.'
  },
  location: {
    type: String,
  //  required: 'This field is required.'
  },
  addressUrl: {
      type: String,
    default: 'N/A'
  },
  about: {
    type: String,
  //  required: 'This field is required.'
  },
  contact:{
    type: String,
  //  required: 'This field is required.',
    validate: {
      validator: contactValidate,
      message: props => `${props.value} Invalid contact number.`
    }
  },
  email: {
    type: String,
  //  required: 'This field is required.',
    unique: true,
    validate: {
      validator: emailValidate,
      message: props => `${props.value} must have @ sign,domain must be one or more lowercase letters, numbers, underscores, dots, or hyphens.. and then another (escaped) dot, with the extension being 2 to 63 letters or dots`
    }
  },
  services: [{
    type: String,
  //  required: 'This field is required.'
  }],
  eventsManaged:{
    type: Number,
  //  required: 'This field is required.'
  },
  since: {
    type: String,
  //  required: 'This field is required.'
  },
  venue_type: {
    type: String,
  //  required: 'This field is required.'
  },
  parking: {
    type: String,
  //  required: 'This field is required.'
  },
  smallpartyvenue: {
    type: String,
  //  required: 'This field is required.'
  },
  features: {
    type: String,
  //  required: 'This field is required.'
  },
  space: {
    type: String,
  //  required: 'This field is required.'
  },
  room_count: {
    type: Number,
  },
  guests: {
    type: Number,
  },
  catering_policy: {
    type: String,
  //  required: 'This field is required.'
  },
  decor_policy: {
    type: String,
  //  required: 'This field is required.'
  },
  outside_alcohol: {
    type: String,
  //  required: 'This field is required.'
  },
  dj_policy: {
    type: String,
  //  required: 'This field is required.'
  },
  room_start_price:{
     type: Number,
    //  required: 'This field is required.'
  },
  starting_price: {
    type: Number
  },
  instaUrl:{
      type: String,
    default: 'N/A'
  },
  fbUrl:{
      type: String,
    default: 'N/A'
  },
  food_price: [{
    food_type: {
      type: String
    },
    food_price: {
      type: Number,
    }
  }],
  halls: [{

    hall_name: {
      type: String,
    //  required: 'This field is required.'
    },
    hall_space: {
      type: String,
    //  required: 'This field is required.'
    },
    hall_seating: {
      type: Number,
    //  required: 'This field is required.'
    },
    hall_floating: {
      type: Number,
    //  required: 'This field is required.'
    },
    hall_price: {
      type: Number,
    //  required: 'This field is required.'
    }
  }],
  rooms: [{
    room_name: {
      type: String,
    //  required: 'This field is required.'
    },
    room_price: {
      type: String,
    //  required: 'This field is required.'
    }
  }],
  decor: [{
    event: {
      type: String,
    //  required: 'This field is required.'
    },
    decor_price: {
      type: String,
    //  required: 'This field is required.'
    }
  }], 

  profilePhoto: {
    type: String,
  //  required: 'This field is required.'
  },
  portfolioPhotos: [{
    url: {
      type: String
    }
  }],
  ratings: [{
    user_id: {
      type: String
    },
    rate: {
      type: Number
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },

});
// venueSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
venueSchema.index({ "$**" : 'text' });



function contactValidate(value) {
  var contact = /^\d{10}$/;
  if (!contact.test(value)) {
    return false;
  }
  return true
}

function emailValidate(value) {
  var reg_email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/;

  if (!reg_email.test(value)) {
    return false;
  }
  return true
}

module.exports = mongoose.model('Venue', venueSchema);