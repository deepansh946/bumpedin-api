const router = require('express').Router();

router.use('/api/users', require('./api/users'));
router.use('/api/locations', require('./api/locations'));
router.use('/api/user-interactions', require('./api/userInteractions'));

module.exports = router;
