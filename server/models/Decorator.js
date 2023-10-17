const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
    dname:{
        type:String,
        required:'This field is required'
    },
    dlocation:{
        type:String,
        required:'This field is required'
    },
    dratings:{
        type:Number,
        required:'This field is required',
        default:0
    },
    dratingscount:{
        type:Number,
        default:0
    },
    dstartprice:{
        type:Number,
        required:'This field is required'
    },
    dprofilepic:{
        type:String,
        required:'This field is required'
    },
    dabout:{
        type:String,
        required:'This field is required'
    },
    dsince:{
        type:String,
        required:'This field is required'
    },
    dyearop:{
        type:String,
        required:'This field is required'
    },
    dservicetype:{
        type:String,
        required:'This field is required'
    },
    dindoor:{
        type:String,
        required:'This field is required'
    },
    doutdoor:{
        type:String,
        required:'This field is required'
    },
});

module.exports = mongoose.model('Decorator',decorSchema);