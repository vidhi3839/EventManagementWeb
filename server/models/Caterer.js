const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: String // You can store the image URLs here
});

const catererSchema = new mongoose.Schema({
    cname:{
        type:String,
        required:'This field is required'
    },
    clocation:{
        type:String,
        required:'This field is required'
    },
    cratings:{
        type:Number,
        required:'This field is required',
        default:0
    },
    cratingscount:{
        type:Number,
        default:0
    },
    cvegonly:{
        type:String,
        required:'This field is required'
    },
    cvegprice:{
        type:Number,
        required:'This field is required'
    },
    cnonvegprice:{
        type:String,
        required:'This field is required'
    },
    cprofilepic:{
        type:String,
        required:'This field is required'
    },
    cabout:{
        type:String,
        required:'This field is required'
    },
    csince:{
        type:String,
        required:'This field is required'
    },
    cyearop:{
        type:String,
        required:'This field is required'
    },
    ccaterertype:{
        type:String,
        required:'This field is required'
    },
    cuisines:{
        type:String,
        required:'This field is required'
    },
    cmincapacity:{
        type:String,
        required:'This field is required'
    },
    cmaxcapacity:{
        type:String,
        required:'This field is required'
    },
    cpack:{
        type:[String],
        required : 'This field is required'
    },
    cinstaurl:{
        type:String,
        default:'N/A'
    },
    cfburl:{
        type:String,
        default:'N/A'
    },
    ccontact:{
        type:String,
        default:'N/A'
    },
    userid:{
        type:String,
        required : 'This field is required'
    },
    cportfolio:[imageSchema],
});

module.exports = mongoose.model('Caterer',catererSchema);