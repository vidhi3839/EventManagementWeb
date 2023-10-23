const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
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

router.get('/', eventsController.homepage);
router.get('/signup', eventsController.signup);
router.post('/signup', eventsController.registerUserOnPost);


// Register venue
router.get('/register-venue', eventsController.registerVenue);
router.post('/register-venue',eventsController.registerVenueOnPost);
// explore venue
router.get('/venues', eventsController.exploreVenues );
router.get('/venues/search/:searchInput', eventsController.searchVenue);
router.get('/venues/service-events/:events', eventsController.eventVenue);
router.get('/venues/:id', eventsController.exploreVenue);
router.post('/venues/:id', eventsController.rateVenue);
router.post('/venues/:id/enquire', eventsController.enquireVenue);
// Update venue
router.get('/venues/edit/:id', eventsController.venuesEdit);
router.post('/venues/edit/:id', eventsController.venuesEditPost);
// Add and delete services offered
router.get('/venues/add-services/:id', eventsController.addVenueServices);
router.post('/venues/add-services/:id', eventsController.addVenueServicesOnPost);
router.get('/venues/del-service/:id/:service', eventsController.delVenueService);
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
router.get('/photographers/search/:searchInput', eventsController.searchPhotographer);
router.get('/photographers/:id', eventsController.explorePhotographer );
router.post('/photographers/:id', eventsController.ratePhotographer);
router.post('/photographers/:id/enquire', eventsController.enquirePhotographer);
// Update photographer
router.get('/photographers/edit/:id', eventsController.photographersEdit);
router.post('/photographers/edit/:id', eventsController.photographersEditPost);
// Add and delete services offered
router.get('/photographers/add-services/:id', eventsController.addPhotographersServices);
router.post('/photographers/add-services/:id', eventsController.addPhotographersServicesOnPost);
router.get('/photographers/del-service/:id/:service', eventsController.delPhotographersService);
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
router.get('/entertainers/search/:searchInput', eventsController.searchEntertainer);
router.get('/entertainers/type/:type', eventsController.eventEntertainer);
router.get('/entertainers/:id', eventsController.exploreEntertainer);
router.post('/entertainers/:id', eventsController.rateEntertainer);
router.post('/entertainers/:id/enquire', eventsController.enquireEntertainer);
// Update entertainer
router.get('/entertainers/edit/:id', eventsController.entertainersEdit);
router.post('/entertainers/edit/:id', eventsController.entertainersEditPost);
// Add and delete services offered
router.get('/entertainers/add-services/:id', eventsController.addEntertainersServices);
router.post('/entertainers/add-services/:id', eventsController.addEntertainersServicesOnPost);
router.get('/entertainers/del-service/:id/:service', eventsController.delEntertainersService);
// Add and delete prices for events
router.get('/entertainers/add-price/:id', eventsController.addEntertainerPrice);
router.post('/entertainers/add-price/:id', eventsController.addEntertainerPriceOnPost);
router.get('/entertainers/del-price/:id/:pid', eventsController.delEntertainerPrice);
// Delete entertainer
router.get('/delete-entertainer/:id', eventsController.deleteEntertainer);



router.get('/packages', eventsController.explorePackages );
router.get('/packages/:id',eventsController.packageName);
// router.get('/submit-package', eventsController.submitPackage );
// router.post('/submit-package', eventsController.updateonsubmitPackage );

module.exports = router;