const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../../config/auth');

/**
 * @route   POST /users
 * @desc    Register new user
 * @access  Public
 */
router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /users/:id
 * @desc    Get user by id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return !user ? res.sendStatus(404) : res.send(user);
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
});

/**
 * @route   POST /users/:id
 * @desc    Update user by id
 * @access  Private
 */
router.post('/:id', async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);

  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();

    return res.send(user);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

/**
 * @route   DELETE /users/:id
 * @desc    Delete user by id
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.sendStatus(404);

    return res.send({ message: 'User Deleted' });
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
});

module.exports = router;
