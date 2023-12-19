const router = require('express').Router();
const mongoose = require('mongoose');
const UserInteraction = require('../../models/UserInteraction');
const auth = require('../../config/auth');

/**
 * @route   GET /user-interactions/count
 * @desc    Count unique user Interactions
 * @access  Public
 */
router.get('/count', async (req, res) => {
  try {
    const result = await UserInteraction.aggregate([
      { $unwind: '$connections' },
      { $match: { 'connections.status': 'accepted' } },
      {
        $group: {
          _id: '$connections.user',
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const count = result.length > 0 ? result[0].count : 0;

    return res.status(200).json({ success: true, count });
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @route   POST /user-interactions
 * @desc    Register new userInteractions
 * @access  Public
 */
router.post('/', async (req, res) => {
  const userInteraction = new UserInteraction(req.body);
  try {
    await userInteraction.save();
    res.status(201).send({ userInteraction });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /user-interactions
 * @desc    Get all userInteractions
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const userInteractions = await UserInteraction.find({});
    res.send(userInteractions);
  } catch (e) {
    console.error(e);
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /user-interactions/:id
 * @desc    Get userInteractions by id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userInteraction = await UserInteraction.findById(id);
    if (!userInteraction) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.send(userInteraction);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   DELETE /user-interactions/:id
 * @desc    Delete user-interactions by id
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const userInteractions = await UserInteraction.findByIdAndDelete(_id);
    if (!userInteractions)
      return res.status(404).json({ success: false, message: 'Message not found' });

    return res.send({ message: 'UserInteraction Deleted' });
  } catch (e) {
    console.error(e);
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   POST /user-interactions/interact
 * @desc    Connect users
 * @access  Private
 */
router.post('/interact', async (req, res) => {
  try {
    const {
      body: { sender, receiver },
    } = req;

    const existingRequest = await UserInteraction.findOne({
      user: receiver,
      'connections.user': sender,
      'connections.status': 'pending',
    });

    if (existingRequest) {
      existingRequest.connections[0].status = 'accepted';
      await existingRequest.save();

      // Add reciprocal connection to both users
      await UserInteraction.findOneAndUpdate(
        { user: sender },
        {
          $push: {
            connections: {
              user: receiver,
              timestamp: Date.now(),
              status: 'accepted',
            },
          },
        },
        {
          upsert: true,
        }
      );

      return res.status(200).json({ success: true, status: 'accepted' });
    }

    // No pending request, send a new connection request
    await UserInteraction.updateOne(
      { user: sender },
      {
        $push: {
          connections: {
            user: receiver,
            timestamp: Date.now(),
            status: 'pending',
          },
        },
      },
      { upsert: true }
    );

    return res.status(201).json({ success: true, status: 'pending' });
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

/**
 * @route   POST /user-interactions/ignore
 * @desc    Ignore users
 * @access  Private
 */
router.post('/ignore', async (req, res) => {
  try {
    const {
      body: { sender, receiver },
    } = req;

    let userInteraction = await UserInteraction.findOne({ user: sender });

    if (!userInteraction) {
      userInteraction = await UserInteraction.create({ user: sender, connections: [] });
    }

    const existingConnection = userInteraction.connections.find(
      (connection) => connection.user.toString() === receiver
    );

    if (existingConnection) {
      existingConnection.status = 'rejected';
    } else {
      userInteraction.connections.push({
        user: new mongoose.mongo.ObjectId(receiver.trim()),
        status: 'rejected',
        timestamp: Date.now()
      });
    }

    await userInteraction.save();

    return res.status(201).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

module.exports = router;
