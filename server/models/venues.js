const mongoose = require('mongoose');
const venueSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
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
    required: 'This field is required.'
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
    type: Number,
    //  required: 'This field is required.'
  },
  email: {
    type: String,
    //  required: 'This field is required.'
  },
  services: [{
    type: String,
    //  required: 'This field is required.'
  }],
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
     type: Number
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
  }

});
// venueSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
venueSchema.index({ "$**" : 'text' });
module.exports = mongoose.model('Venue', venueSchema);