const router = require('express').Router();
const UserInteraction = require('../../models/UserInteraction');
const auth = require('../../config/auth');

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
    return !userInteraction ? res.sendStatus(404) : res.send(user);
  } catch (e) {
    return res.sendStatus(400);
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
    if (!userInteractions) return res.sendStatus(404);

    return res.send({ message: 'UserInteraction Deleted' });
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
});

/**
 * @route   POST /user-interactions/interact
 * @desc    Connect users
 * @access  Private
 */
router.post('/interact', async (req, res) => {
  console.log('here');
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
      const newInteraction = await UserInteraction.updateOne(
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
