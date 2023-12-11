const router = require('express').Router();
const Message = require('../../models/Message');
const auth = require('../../config/auth');

/**
 * @route   POST /messages
 * @desc    Register new message
 * @access  Public
 */
router.post('/', async (req, res) => {
  const message = new Message(req.body);
  try {
    await message.save();
    res.status(201).send({ message });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /messages
 * @desc    Get all messages
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find({});
    res.send(messages);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /messages/:id
 * @desc    Get message by id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.send(message);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   PUT /messages/:id
 * @desc    Update message by id
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);

  try {
    const _id = req.params.id;
    const message = await Message.findById(_id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    updates.forEach((update) => {
      message[update] = req.body[update];
    });
    await message.save();

    return res.send(message);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

/**
 * @route   DELETE /messages/:id
 * @desc    Delete message by id
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const message = await Message.findByIdAndDelete(_id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    return res.send({ message: 'Message Deleted' });
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

module.exports = router;
