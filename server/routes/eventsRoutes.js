const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

/**
 * App Routes 
*/
router.get('/', eventsController.homepage);
router.get('/photographers', eventsController.explorePhotographers );
router.get('/photographers/:id', eventsController.explorePhotographer );
router.get('/packages', eventsController.explorePackages );
router.get('/packages/:id',eventsController.packageName);
router.get('/submit-package', eventsController.submitPackage );
router.post('/submit-package', eventsController.updateonsubmitPackage );

module.exports = router;