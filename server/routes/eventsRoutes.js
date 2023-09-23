const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

/**
 * App Routes 
*/
router.get('/', eventsController.homepage);
router.get('/photographers', eventsController.explorePhotographers );
router.get('/photographers/:id', eventsController.explorePhotographer );

module.exports = router;