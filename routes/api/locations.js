const router = require('express').Router();
const Location = require('../../models/Location');
const UserInteraction = require('../../models/UserInteraction');
const auth = require('../../config/auth');
const mongoose = require('mongoose');

/**
 * @route   POST /locations
 * @desc    Register new location
 * @access  Public
 */
router.post('/', async (req, res) => {
  const location = new Location(req.body);
  try {
    await location.save();
    res.status(201).send({ location });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /locations
 * @desc    Get all locations
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.send(locations);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /locations/:id
 * @desc    Get location by id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    return res.send(location);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   PUT /locations/:id
 * @desc    Update location by id
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);

  try {
    const _id = req.params.id;
    const location = await Location.findById(_id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
    updates.forEach((update) => {
      location[update] = req.body[update];
    });
    await location.save();

    return res.send(location);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

/**
 * @route   DELETE /locations/:id
 * @desc    Delete location by id
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const location = await Location.findByIdAndDelete(_id);
    if (!location) return res.status(404).json({ success: false, message: 'Location not found' });

    return res.send({ message: 'Location Deleted' });
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   GET /locations/nearby/:id
 * @desc    Get near by users of id
 * @access  Private
 */
router.get('/nearby/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const userLocation = await Location.findOne({
      user: id,
      createdAt: { $gte: fifteenMinutesAgo },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!userLocation) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const userInteraction = await UserInteraction.findOne({ user: id });

    let ignoredUserIds = [];

    if (userInteraction?.ignoredUsers?.length) {
      ignoredUserIds = userInteraction.ignoredUsers.map(({ user }) => user.toString());
    }

    const nearbyUsers = await Location.find({
      user: {
        $nin: [...ignoredUserIds, id],
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userLocation.location,
          },
          $maxDistance: 2 * 1000, // Convert radius in km to meters
        },
      },
    }).populate('user');

    return res.status(200).send(nearbyUsers);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

module.exports = router;
