const mongoose = require('mongoose');

const packagesSchema = new mongoose.Schema({
  pkgname: {
    type: String,
    required: 'This field is required.'
  },  
  apImg:{
    type: String,
    required: 'This field is required.'
  },
  bItemList:{
    type: Object,
    basicItem:{
      type: String,
      required:'This field is required.'
    },
    basicPrice:{
      type:String,
      required:'This field is required.'
    }
  },
  totalBasicPrice:{
    type:String,
    required:'This field is required'
  },

  bDesList:{
    type: Object,
    basicDesTitle:{
      type: String,
      required:'This field is required.'
    },
    basicDes:{
      type:String,
      required:'This field is required.'
    }
  },
  pItemList:{
    type: Object,
    premiumItem:{
      type: String,
      required:'This field is required.'
    },
    premiumPrice:{
      type:String,
      required:'This field is required.'
    }
  },
  totalPremiumPrice:{
    type:String,
    required:'This field is required'
  },
  pDesList:{
    type: Object,
    premiumDesTitle:{
      type: String,
      required:'This field is required.'
    },
    premiumDes:{
      type:String,
      required:'This field is required.'
    }
  },
  uItemList:{
    type: Object,
    ultimateItem:{
      type: String,
      required:'This field is required.'
    },
    ultimatePrice:{
      type:String,
      required:'This field is required.'
    }
  },
  totalUltimatePrice:{
    type:String,
    required:'This field is required'
  },
  uDesList:{
    type: Object,
    ultimateDesTitle:{
      type: String,
      required:'This field is required.'
    },
    ultimateDes:{
      type:String,
      required:'This field is required.'
    }
  }

});




module.exports = mongoose.model('Packages', packagesSchema);