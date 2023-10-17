const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const isAuth = require('../middleware/user');

/**
 * App Routes 
*/
router.get('/', eventsController.homepage );
router.get('/photographers', eventsController.explorePhotographers );
router.get('/photographers/:id', eventsController.explorePhotographer );
router.get('/packages', eventsController.explorePackages );
router.get('/packages/:id',eventsController.packageName);
router.get('/decorators',eventsController.exploreDecorators);
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
// router.post('/submit-package', eventsController.updateonsubmitPackage );

module.exports = router;

// https://chat.openai.com/share/4376ac94-f9a4-4413-93b8-1e8f8dbfb029