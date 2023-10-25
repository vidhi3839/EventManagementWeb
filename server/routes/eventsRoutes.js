const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const isAuth = require('../middleware/user');
const mongoose = require('mongoose');

/**
 * App Routes 
*/

router.get('/', eventsController.homepage );

/* Signup Form and Function*/
router.get('/signup', eventsController.signup);
router.post('/signupnew', eventsController.signupnew);

/**User Profile Form and Working */
router.get('/profile',isAuth , eventsController.openProfile);
router.post('/editprofile/:id',eventsController.editProfile);

/* Login Form and Function*/
router.get('/login', eventsController.login);
router.post('/loginnew',eventsController.loginnew);

/* Logout Function*/
router.get('/logout',eventsController.logout);

/**Home to Vendor Dashboard */
router.get('/homevendor',isAuth,eventsController.homeToVendor);


// Register venue
router.get('/register-venue/:id', eventsController.registerVenue);
router.post('/register-venue/:id',eventsController.registerVenueOnPost);
// explore venue
router.get('/venues',isAuth, eventsController.exploreVenues );
router.get('/venues/search/:searchInput' ,isAuth, eventsController.searchVenue);
router.get('/venues/service-events/:events' ,isAuth, eventsController.eventVenue);
router.get('/venues/:id',isAuth, eventsController.exploreVenue);
router.post('/venues/:id',isAuth,  eventsController.rateVenue);
router.post('/venues/:id/enquire',isAuth,  eventsController.enquireVenue);
// Update venue
router.get('/venues/edit/:id', eventsController.venuesEdit);
router.post('/venues/edit/:id', eventsController.venuesEditPost);
// Add and delete services offered
router.get('/venues/add-services/:id', eventsController.addVenueServices);
router.post('/venues/add-services/:id', eventsController.addVenueServicesOnPost);
router.get('/venues/del-service/:id/:service', eventsController.delVenueService);
// Add and delete food
 router.get('/venues/add-food/:id', eventsController.addVenueFood);
 router.post('/venues/add-food/:id', eventsController.addVenueFoodOnPost);
 router.get('/venues/del-food/:id/:pid', eventsController.delVenueFood);
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
router.get('/register-photographer/:id', eventsController.registerPhotographer);
router.post('/register-photographer/:id',eventsController.registerPhotographerOnPost);
// Explore photographer
router.get('/photographers',isAuth, eventsController.explorePhotographers );
router.get('/photographers/search/:searchInput',isAuth,  eventsController.searchPhotographer);
router.get('/photographers/:id',isAuth,  eventsController.explorePhotographer );
router.post('/photographers/:id' ,isAuth, eventsController.ratePhotographer);
router.post('/photographers/:id/enquire',isAuth,  eventsController.enquirePhotographer);
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
router.get('/register-entertainer/:id', eventsController.registerEntertainer);
router.post('/register-entertainer/:id',eventsController.registerEntertainerOnPost);
// Explore entertainer
router.get('/entertainers',isAuth, eventsController.exploreEntertainers );
router.get('/entertainers/search/:searchInput',isAuth,  eventsController.searchEntertainer);
router.get('/entertainers/type/:type',isAuth,  eventsController.eventEntertainer);
router.get('/entertainers/:id',isAuth,  eventsController.exploreEntertainer);
router.post('/entertainers/:id',isAuth,  eventsController.rateEntertainer);
router.post('/entertainers/:id/enquire',isAuth,  eventsController.enquireEntertainer);
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

router.get('/back/:id',eventsController.back);

router.get('/packages/edit/:id', eventsController.packagesEdit);
router.post('/packages/edit/:id', eventsController.packagesEditPost);
router.get('/packages',isAuth, eventsController.explorePackages );
router.get('/packages/:id',isAuth,eventsController.packageName);

router.get('/packages-form/:id', eventsController.submitPackages );
router.post('/packages-form/:id', eventsController.updateonsubmitPackage );

router.get('/delete-packages/:id', eventsController.deletePackages);
router.get('/packages/add-list/:id', eventsController.addPackagesList);
router.post('/packages/add-list/:id', eventsController.addPackagesListOnPost);
router.get('/packages/del-list/:id/:pid', eventsController.delPackagesList);




/** Add Decorator Form */
router.get('/adddecorform/:id',eventsController.openDecorform);

/** Add Decorator on Post */
router.post('/addcaterer/:id', eventsController.addCaterer);

/** Update Decorator Form */
router.get('/upddecorform/:id',eventsController.openDecorupdform);

/** Update Decorator on Post */
router.post('/updcaterer/:id', eventsController.updCaterer);

/** Delete Decorator on Post */
router.get('/deletecaterer/:id',eventsController.delCaterer);

/** Explore Decorators */
router.get('/decorators',isAuth,eventsController.exploreDecorators);

/** Explore Particular Decorator*/
router.get('/decorators/:id',isAuth, eventsController.exploreDecorator );

/** Search Decorator */
router.get('/searchdecor',isAuth, eventsController.searchDecor);

/** Filter Decorator */
router.get('/filterdecor',isAuth,eventsController.filterDecor);

/** Rate Decorator */
router.post('/decorupdateRating/:id',isAuth, eventsController.decorupdateRating);


/** Add Caterer Form */
router.get('/addcatererform/:id',eventsController.openCatererform);

/** Add Caterer on Post */
router.post('/adddecor/:id', eventsController.addDecor);

/** Update Caterer Form */
router.get('/updcatererform/:id',eventsController.openCatererupdform);

/** Update Caterer on Post */
router.post('/upddecor/:id', eventsController.updDecor);

/** Delete Caterer on Post */
router.get('/deletedecor/:id',eventsController.delDecor);

/** Explore Caterer */
router.get('/caterers' ,isAuth, eventsController.exploreCaterers);

/** Explore Particular Caterer*/
router.get('/caterers/:id',isAuth, eventsController.exploreCaterer );

/** Search Caterer */
router.get('/searchcaterer',isAuth, eventsController.searchCaterer);

/** Filter Caterer */
router.get('/filtercaterer',isAuth,eventsController.filterCaterer);

/** Rate Caterer */
router.post('/catererupdateRating/:id',isAuth, eventsController.catererupdateRating);



/** Add Invite Form */
router.get('/addinviteform/:id',eventsController.openform);

/** Add Invite on Post */
router.post('/addinvite/:id', eventsController.addInvite);

/** Update Invite Form */
router.get('/updinviteform/:id',eventsController.openupdform);

/** Update Invite on Post */
router.post('/updinvite/:id', eventsController.updInvite);

/** Delete Invite on Post */
router.get('/deleteinvite/:id',eventsController.delInvite);

/** Explore Invitations */
router.get('/invitations' ,isAuth, eventsController.exploreInvites);
/** Explore Particular Invite*/
router.get('/invitations/:id',isAuth, eventsController.exploreInvite );

/** Search Invite */
router.get('/searchinvite',isAuth, eventsController.searchInvite);

/** Filter Invite */
router.get('/filterinvite',isAuth,eventsController.filterInvite);

/** Rate Invite */
router.post('/updateRating/:id',isAuth, eventsController.updateRating);


//reviews
router.get('/reviews', eventsController.exploreReviews);
router.get('/reviews/:id', eventsController.exploreReviewsById);
router.post('/index', eventsController.submitReviews );

module.exports = router;