require('../models/database');
const Photographer = require('../models/Photographer');
const Packages = require('../models/Packages');
const Decorator = require('../models/Decorator'); 
const Caterer = require('../models/Caterer'); 
const Invitation = require('../models/Invitation'); 
const User = require('../models/User');
const usermiddle = require('../middleware/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');



/**
 * GET /
 * 
*/
exports.homepage = async(req,res)=>{
  try {
    const limitNumber = 10;
    const packages = await Packages.find({}).limit(limitNumber);
    res.render('index', {  packages } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET / packages
 * 
*/
exports.explorePackages = async(req, res) => {
    
  Packages.find({}).then(packages => {
      res.render('index',
          {
              packagesList: packages
          })
      }
)} 

/**
 * GET /package name 
 *
 */
exports.packageName=async (req, res)=>{
try {
  let packageId=req.params.id;
  const packages = await Packages.findById(packageId);
  res.render('packages',
          {packages });
} catch (error) {
  res.status(500).send({message: error.message || "Error Occured" });  
}
}

/**
 * GET / photographer
 * 
*/
exports.explorePhotographers = async(req, res) => {
    
    Photographer.find({}).then(photographers => {
        res.render('photographers',
            {
                photographerList: photographers
            })
        }
)} 
 


/**
 * GET /photographers/:id
 * Photographer
*/
exports.explorePhotographer = async(req, res) => {
  try {
    let photographerId = req.params.id;
    const photographer = await Photographer.findById(photographerId);
    res.render('photographer_details', { photographer });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/*
GET Decorators
*/

exports.exploreDecorators = async(req,res) => {
  Decorator.find({}).then(decorators => {
    res.render('decorators',{
      decoratorList : decorators
  })
}
)}

/**
 * GET /decorators/:id
 * Decorator
*/
exports.exploreDecorator = async(req, res) => {
  try {
    let decoratorId = req.params.id;
    const decorator = await Decorator.findById(decoratorId);
    const decorid = decorator._id;
    res.render('decorator_details', { decorator , decorid});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/*
GET Caterers
*/

exports.exploreCaterers = async(req,res) => {
  Caterer.find({}).then(caterers => {
    res.render('caterers',{
      catererList : caterers
  })
}
)}

/**
 * GET /caterers/:id
 * Caterer
*/
exports.exploreCaterer = async(req, res) => {
  try {
    let catererId = req.params.id;
    const caterer = await Caterer.findById(catererId);
    const catid = caterer._id;
    res.render('caterer_details', { caterer , catid });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/*
GET Invitations 
*/

exports.exploreInvites = async(req,res) => {
  Invitation.find({}).then(invitations => {
    res.render('invitations',{
      inviteList : invitations
  })
}
)}

/**
 * GET /invitations/:id
 * Invitation
*/
exports.exploreInvite = async(req, res) => {
  try {
    let inviteId = req.params.id;
    const invite = await Invitation.findById(inviteId);
    const inviteid = invite._id;
    res.render('invitation_details', { invite , inviteid });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/*
Update the ratings of Invitaion Card Providers
*/

exports.updateRating =  async (req, res) => {
  const inviteId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const invite = await Invitation.findById(inviteId);

  if (!invite) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  let updatedRating;
  if (invite.iratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (invite.iratings * invite.iratingscount + clientRating) / (invite.iratingscount + 1);
  }  
  invite.iratingscount = invite.iratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Invitation.findByIdAndUpdate(inviteId, { iratings: updatedRating , iratingscount: invite.iratingscount});

  res.json({ updatedRating });
}

/*
Update the ratings of Decorators
*/

exports.decorupdateRating =  async (req, res) => {
  const decorId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const decorator = await Decorator.findById(decorId);

  if (!decorator) {
    return res.status(404).json({ error: 'Decorator not found' });
  }

  let updatedRating;
  if (decorator.dratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (decorator.dratings * decorator.dratingscount + clientRating) / (decorator.dratingscount + 1);
  }  
  decorator.dratingscount = decorator.dratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Decorator.findByIdAndUpdate(decorId, { dratings: updatedRating , dratingscount: decorator.dratingscount});

  res.json({ updatedRating });
}

/*
Update the ratings of Caterers
*/

exports.catererupdateRating =  async (req, res) => {
  const catererId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const caterer = await Caterer.findById(catererId);

  if (!caterer) {
    return res.status(404).json({ error: 'Caterer not found' });
  }

  let updatedRating;
  if (caterer.cratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (caterer.cratings * caterer.cratingscount + clientRating) / (caterer.cratingscount + 1);
  }  
  caterer.cratingscount = caterer.cratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Caterer.findByIdAndUpdate(catererId, { cratings: updatedRating , cratingscount: caterer.cratingscount});

  res.json({ updatedRating });
}

/*
Search Invitation Providers
*/

exports.searchInvite = async(req,res) => {
 try{
  const searchtext = req.query.searchtext;
  const invitations = await Invitation.find({
    "$or":[
      {"iname":{"$regex":searchtext , $options : 'i'}},
      {"ilocation":{"$regex":searchtext , $options : 'i'}},
    ]
  }).then(invitations => {
    res.render('invitations',{
      inviteList : invitations
  })
})
 }catch (error) {
  res.status(500).send({message: error.message || "Error Occured" });
}
}

 /*
Filter the Invitation-Card Providers
*/

exports.filterInvite = async (req, res) => {
  const budgetRange = req.query.budget; 
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "istart": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "iratings": { $gte: minRating, $lte: maxRating}
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };
  
    const invitations = await Invitation.find(query).then(invitations => {
      console.log(invitations);
      res.render('invitations',{
        inviteList : invitations
    })
  })
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
};

/*
Search Decorators
*/

exports.searchDecor = async(req,res) => {
  try{
   const searchtext = req.query.searchtext;
   const decorators = await Decorator.find({
     "$or":[
       {"dname":{"$regex":searchtext , $options : 'i'}},
       {"dlocation":{"$regex":searchtext , $options : 'i'}},
     ]
   }).then(decorators => {
     res.render('decorators',{
       decoratorList : decorators
   })
 })
  }catch (error) {
   res.status(500).send({message: error.message || "Error Occured" });
 }
 }

 /*
Search Caterers
*/

 exports.searchCaterer = async(req,res) => {
  try{
   const searchtext = req.query.searchtext;
   const caterers = await Caterer.find({
     "$or":[
       {"cname":{"$regex":searchtext , $options : 'i'}},
       {"clocation":{"$regex":searchtext , $options : 'i'}},
     ]
   }).then(caterers => {
     res.render('caterers',{
       catererList : caterers
   })
 })
  }catch (error) {
   res.status(500).send({message: error.message || "Error Occured" });
 }
 }

 /*
 Filter the Decorators
 */
 exports.filterDecor = async (req, res) => {
  const budgetRange = req.query.budget; 
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "dstartprice": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "dratings": { $gte: minRating, $lte: maxRating}
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };
  
    const decorators = await Decorator.find(query).then(decorators => {
      console.log(decorators);
      res.render('decorators',{
        decoratorList : decorators
    })
  })
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
};

/*
 Filter the Caterers
 */
 exports.filterCaterer = async (req, res) => {
  const budgetRange = req.query.budget; 
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "cvegprice": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "cratings": { $gte: minRating, $lte: maxRating}
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };
  
    const caterers = await Caterer.find(query).then(caterers => {
      console.log(caterers);
      res.render('caterers',{
        catererList : caterers
    })
  })
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
};


// Signup Function
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
 
      // Check if the email already exists
      let user = await User.findOne({ email });

      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
          // res.redirect('/index#loginModal');
      }

      user = new User({
          username,
          email,
          password,
          role,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create a session to log the user in
      // req.session.userId = user._id;
      res.redirect('/');

  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

// Login Function
exports.login = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ msg: 'User does not exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid password' });
      }

      console.log(user);

     console.log(user._id);
     req.session.isAuth = true;

    res.render('index');
    //  res.redirect('/decorators');
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};



// data=[{
//     name:"The Wedding Scenerio",
//     address: "Alkapuri, Vadodara",
//     about: "The Wedding Scenario are the professional wedding photographers based in Vadoara.With an industry experience of 8 years, they have attained proficiency in capturing the perfect moments. They believe that bonds are beautiful and it is more beautiful to capture them in real- life settings.Bonds are more celebrated at weddings.To capture this celebration in the autocracy of beauty is the aim of The Wedding Scenario. Well - equipped with tools of photography, they provide services in an excellent manner.They are a good option to hire for wedding photography at reasonable prices",
//     email: "xyz@ad.com",
//     contact: "378472847",
//     services: "videos,photos",
//     since: "2 years",
//     paymentTerms: "50% advance",
//     travelCost: "Outstation travel charges borne on client",
//     mostBooked: "10000",
//     deliveryTime: "2 weeks",
//     photo: "35000",
//     photoVideo: "40000",
//     candid: "10000",
//     cinematography: "20000",
//     studio: "10000",
//     preWedding: "30000",
//     albums: "26000",
//     videography: "20000",
//     smallFunction: "10000",
//     profilePhoto: "fern-venue.webp",
//     rating: "5.0"
// },
// {
//     name:"The Photoholics",
//     address: "Alkapuri, Vadodara",
//     about: "The Photoholics are the professional wedding photographers based in Vadoara.With an industry experience of 8 years, they have attained proficiency in capturing the perfect moments. They believe that bonds are beautiful and it is more beautiful to capture them in real- life settings.Bonds are more celebrated at weddings.To capture this celebration in the autocracy of beauty is the aim of The Wedding Scenario. Well - equipped with tools of photography, they provide services in an excellent manner.They are a good option to hire for wedding photography at reasonable prices",
//     email: "xyz@ad.com",
//     contact: "378472847",
//     services: "videos,photos",
//     since: "2 years",
//     paymentTerms: "50% advance",
//     travelCost: "Outstation travel charges borne on client",
//     mostBooked: "10000",
//     deliveryTime: "2 weeks",
//     photo: "35000",
//     photoVideo: "40000",
//     candid: "10000",
//     cinematography: "20000",
//     studio: "10000",
//     preWedding: "30000",
//     albums: "26000",
//     videography: "20000",
//     smallFunction: "10000",
//     profilePhoto: "kabir-farm-venue.jpg",
//     rating: "4.9"
// }
// ]

// Photographer.insertMany(data);

// async function addDummydata(){
//   try{
//     await Decorator.insertMany([

//     ]);
//   }catch(error)
//   {
//     console.log(error);
//   }
// }



// invitedata=[
//   {
//     "iname":"Pale Pink Studio",
//     "ilocation":"Surat",
//     "iratings":3.9,
//     "istart":"200-400 (Printed) ",
//     "iprofilepic":"ic1.png",
//     "irange":"200-2000",
//     "iabout":"Pale Pink Studio is a design studio based out of Surat, owned by Suruchi Gulati. She is a watercolour and digital artist, illustrator, and designer. She is inspired by the natural world around her and everything from the changing colours of the season, to the intricacy of a flower, inspire her. She lives between India, Ireland and the Netherlands but works on projects worldwide. She is passionate about creating lasting and beloved pieces of artwork and illustrations. Every invite that she designs has hand-painted illustrations using watercolours or mixed digital media.",
//     "isince":"2021",
//     "iyearop":"2017",
//     "iservicetype":"All types of card invites available",
//     "ishipping":"Both domestic and International shipping available",
//     "ispeciality":"Boxed,Funky,Modern,Traditional",
//     "iminorder":"20"
//   },
//   {
//     "iname":"Temple Design",
//     "ilocation":"Surat",
//     "iratings":4.7,
//     "istart":"400-600 (Printed) ",
//     "iprofilepic":"ic2.png",
//     "irange":"400-20000",
//     "iabout":"Temple Design is a design studio based out of Surat, owned by Suruchi Gulati. She is a watercolour and digital artist, illustrator, and designer. She is inspired by the natural world around her and everything from the changing colours of the season, to the intricacy of a flower, inspire her. She lives between India, Ireland and the Netherlands but works on projects worldwide. She is passionate about creating lasting and beloved pieces of artwork and illustrations. Every invite that she designs has hand-painted illustrations using watercolours or mixed digital media.",
//     "isince":"2018",
//     "iyearop":"2014",
//     "iservicetype":"All types of card invites available",
//     "ishipping":"Both domestic and International shipping available",
//     "ispeciality":"Boxed,Funky,Modern,Traditional",
//     "iminorder":"30"
//   }
// ]

// Invitation.insertMany(invitedata);


