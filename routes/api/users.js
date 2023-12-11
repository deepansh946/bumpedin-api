const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../../config/auth');
const { isEmailValid } = require('../../utils');

/**
 * @route   POST /users
 * @desc    Register new user
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!isEmailValid(email)) {
      return res.status(400).json({ success: false, message: 'User email not valid' });
    }

    const users = await User.find({});
    const existingUser = users.filter((user) => user.email === email);

    if (existingUser.length) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = new User(req.body);
    await user.save();
    return res.status(201).send({ user });
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.send(user);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   PUT /users/:id
 * @desc    Update user by id
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);

  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
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
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.send({ message: 'User Deleted' });
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

module.exports = router;
