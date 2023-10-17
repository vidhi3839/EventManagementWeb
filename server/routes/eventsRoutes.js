const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const isAuth = require('../middleware/user');
const multer = require('multer');
const mongoose = require('mongoose');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../../public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  const Image = mongoose.model('Image', {
    filename: String,
  });
/**
 * App Routes 
*/

router.get('/', eventsController.homepage );
router.get('/signup', eventsController.signup);
router.post('/signup', eventsController.registerUserOnPost);


// Register venue
router.get('/register-venue', eventsController.registerVenue);
router.post('/register-venue',eventsController.registerVenueOnPost);
// explore venue
router.get('/venues', eventsController.exploreVenues );
router.get('/venues/:id', eventsController.exploreVenue);
router.post('/venues/:id', eventsController.rateVenue);
// Update venue
router.get('/venues/edit/:id', eventsController.venuesEdit);
router.post('/venues/edit/:id', eventsController.venuesEditPost);
// Add and delete venue halls
router.get('/venues/add-hall/:id', eventsController.addVenueHall);
router.post('/venues/add-hall/:id', eventsController.addVenueHallOnPost);
router.get('/venues/del-hall/:id/:pid', eventsController.delVenueHall);
// Add and delete venue rooms
router.get('/venues/add-room/:id', eventsController.addVenueRoom);
router.post('/venues/add-room/:id', eventsController.addVenueRoomOnPost);
router.get('/venues/del-room/:id/:pid', eventsController.delVenueRoom);
// Add and delete venue decor
router.get('/venues/add-decor/:id', eventsController.addVenueDecor);
router.post('/venues/add-decor/:id', eventsController.addVenueDecorOnPost);
router.get('/venues/del-decor/:id/:pid', eventsController.delVenueDecor);
// Delete venue
router.get('/delete-venue/:id', eventsController.deleteVenue);


// Register photographer
router.get('/register-photographer', eventsController.registerPhotographer);
router.post('/register-photographer',eventsController.registerPhotographerOnPost);
// Explore photographer
router.get('/photographers', eventsController.explorePhotographers );
router.get('/photographers/:id', eventsController.explorePhotographer );
router.post('/photographers/:id', eventsController.ratePhotographer);
// Update photographer
router.get('/photographers/edit/:id', eventsController.photographersEdit);
router.post('/photographers/edit/:id', eventsController.photographersEditPost);
// Add and delete packages
router.get('/photographers/add-package/:id', eventsController.addPhotographersPackages);
router.post('/photographers/add-package/:id', eventsController.addPhotographersPackagesOnPost);
router.get('/photographers/del-package/:id/:pid', eventsController.delPhotographersPackage);
// Delete photographer
router.get('/delete-photographer/:id', eventsController.deletePhotographer);


// Register entertainer
router.get('/register-entertainer', eventsController.registerEntertainer);
router.post('/register-entertainer',eventsController.registerEntertainerOnPost);
// Explore entertainer
router.get('/entertainers', eventsController.exploreEntertainers );
router.get('/entertainers/:id', eventsController.exploreEntertainer);
router.post('/entertainers/:id', eventsController.rateEntertainer);
// Update entertainer
router.get('/entertainers/edit/:id', eventsController.entertainersEdit);
router.post('/entertainers/edit/:id', eventsController.entertainersEditPost);
// Add and delete prices for events
router.get('/entertainers/add-price/:id', eventsController.addEntertainerPrice);
router.post('/entertainers/add-price/:id', eventsController.addEntertainerPriceOnPost);
router.get('/entertainers/del-price/:id/:pid', eventsController.delEntertainerPrice);
// Delete entertainer
router.get('/delete-entertainer/:id', eventsController.deleteEntertainer);



router.get('/packages', eventsController.explorePackages );
router.get('/packages/:id',eventsController.packageName);
// router.get('/decorators',eventsController.exploreDecorators);
router.get('/decorators/:id', eventsController.exploreDecorator );
router.get('/caterers' ,isAuth, eventsController.exploreCaterers);
router.get('/caterers/:id', eventsController.exploreCaterer );
router.get('/invitations' , eventsController.exploreInvites);
router.get('/invitations/:id', eventsController.exploreInvite );
router.post('/updateRating/:id', eventsController.updateRating);
router.post('/decorupdateRating/:id', eventsController.decorupdateRating);
router.post('/catererupdateRating/:id', eventsController.catererupdateRating);
router.get('/searchinvite', eventsController.searchInvite);
router.get('/searchdecor', eventsController.searchDecor);
router.get('/searchcaterer', eventsController.searchCaterer);
router.get('/filterinvite',eventsController.filterInvite);
router.get('/filterdecor',eventsController.filterDecor);
router.get('/filtercaterer',eventsController.filterCaterer);

// router.get('/signup', eventsController.signupPage);
router.post('/signup', eventsController.signup);

// router.get('/login', eventsController.loginPage);
router.post('/login',eventsController.login);

// router.get('/dashboard', eventsController.dashboard);
// router.get('/logout', eventsController.logout);


// router.get('/submit-package', eventsController.submitPackage );
// // router.post('/submit-package', eventsController.updateonsubmitPackage );

module.exports = router;

// https://chat.openai.com/share/4376ac94-f9a4-4413-93b8-1e8f8dbfb029