const mongoose = require('mongoose');

const packagesSchema = new mongoose.Schema({
  pkgcmpyname:{
    type: String,
    // required: 'This field is required.'
  },
  pkgname: {
    type: String,
    //required: 'This field is required.'
  },  
  apImg:{
    type: String,
   // required: 'This field is required.'
  },
  bItemList:[{
    basicItem:String,
    basicPrice:String
  }]
 ,
  totalBasicPrice:{
    type:String,
    //required:'This field is required'
  },

  bDesList:[{
    basicDesTitle:String,
    basicDes:String
  }]
  ,
  pItemList:[{
    premiumItem:String,
    premiumPrice:String
  }]
  ,
  totalPremiumPrice:{
    type:String,
   // required:'This field is required'
  },
  pDesList:[{
    premiumDesTitle:String,
    premiumDes:String
  }]
 ,
  uItemList:[{
    ultimateItem: String,
    ultimatePrice: String
  }]
 ,
  totalUltimatePrice:{
    type:String,
  //  required:'This field is required'
  },
  uDesList:[{
    ultimateDesTitle: String,
    ultimateDes: String
  }],
  userid:{
    type:String,
   // required : 'This field is required'
}
  

});


packagesSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Packages', packagesSchema);