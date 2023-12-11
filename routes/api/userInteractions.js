const router = require('express').Router();
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
      body: { sender, receiver, status },
    } = req;

    // Update or insert the new connection
    const result = await UserInteraction.updateOne(
      {
        user: sender,
        'connections.user': receiver,
      },
      {
        $set: {
          'connections.$.status': status,
          'connections.$.timestamp': new Date(),
        },
      }
    );

    // if interaction wasn't found, then we create new one
    if (result.modifiedCount === 0) {
      await UserInteraction.updateOne(
        { user: sender },
        {
          $push: {
            connections: {
              user: receiver,
              status,
              timestamp: new Date(),
            },
          },
        },
        { upsert: true }
      );
    }

    return res.status(201).send({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

module.exports = router;
