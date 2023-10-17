const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.',
    unique: true,
    validate: {
      validator: emailValidate,
      message: props => `${props.value} must have @ sign,domain must be one or more lowercase letters, numbers, underscores, dots, or hyphens.. and then another (escaped) dot, with the extension being 2 to 63 letters or dots`
    }
  },
  password: {
    type: String,
    required: 'This field is required.'
  }
});

userSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Userdata', userSchema);


function emailValidate(value) {
  var reg_email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/;

  if (!reg_email.test(value)) {
    return false;
  }
  return true
}