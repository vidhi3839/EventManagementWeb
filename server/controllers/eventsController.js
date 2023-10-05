require('../models/database');
const Photographer = require('../models/Photographer');

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
    res.satus(500).send({message: error.message || "Error Occured" });
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
  res.satus(500).send({message: error.message || "Error Occured" });  
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
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 




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