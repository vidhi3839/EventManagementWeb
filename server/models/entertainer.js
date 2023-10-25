const mongoose = require('mongoose');
const entertainerSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  userid: {
    type: String,
    required: 'This field is required'
  },
  name: {
    type: String,
    // required: 'This field is required.'
  },
  address: {
    type: String,
    // required: 'This field is required.'
  },
  location: {
    type: String,
    // required: 'This field is required.'
  },
  addressUrl: {
    type: String,
    default: 'N/A'
  },
  about: {
    type: String,
    // required: 'This field is required.'
  },
  contact: {
    type: String,
    // required: 'This field is required.',
    validate: {
      validator: contactValidate,
      message: props => `${props.value} Invalid contact number.`
    }
  },
  email: {
    type: String,
    // required: 'This field is required.',
    unique: true,
    validate: {
      validator: emailValidate,
      message: props => `${props.value} must have @ sign,domain must be one or more lowercase letters, numbers, underscores, dots, or hyphens.. and then another (escaped) dot, with the extension being 2 to 63 letters or dots`
    }
  },
  entertainer_type: {
    type: String,
    // required: 'This field is required.'
  },
  services: [{
    type: String,
    // required: 'This field is required.'
  }],
  eventsManaged: {
    type: Number,
    // required: 'This field is required.'
  },
  since: {
    type: String,
    // required: 'This field is required.'
  },
  payment_terms: {
    type: String,
    // required: 'This field is required.'
  },
  experience: {
    type: String,
    // required: 'This field is required.'
  },
  budget: {
    type: Number,
    // required: 'This field is required.'
  },
  travelCost: {
    type: String,
    // required: 'This field is required.'
  },
  instaUrl: {
    type: String,
    default: 'N/A'
  },
  fbUrl: {
    type: String,
    default: 'N/A'
  },
  prices: [{
    event: {
      type: String,
      // required: 'This field is required.'
    },
    price: {
      type: Number,
      // required: 'This field is required.'
    }
  }],

  profilePhoto: {
    type: String,
    // required: 'This field is required.'
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
  }

});
// entertainerSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
entertainerSchema.index({ "$**": 'text' });



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
module.exports = mongoose.model('Entertainer', entertainerSchema);