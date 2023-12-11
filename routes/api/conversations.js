const router = require('express').Router();
const Conversation = require('../../models/Conversation');
const auth = require('../../config/auth');

/**
 * @route   POST /conversations
 * @desc    Register new conversation
 * @access  Public
 */
router.post('/', async (req, res) => {
  const conversation = new Conversation(req.body);
  try {
    await conversation.save();
    res.status(201).send({ conversation });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /conversations
 * @desc    Get all conversations
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find({});
    res.send(conversations);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

/**
 * @route   GET /conversations/:id
 * @desc    Get conversation by id
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    return res.send(conversation);
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

/**
 * @route   PUT /conversations/:id
 * @desc    Update conversation by id
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);

  try {
    const _id = req.params.id;
    const conversation = await Conversation.findById(_id);
    if (!conversation)
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    updates.forEach((update) => {
      conversation[update] = req.body[update];
    });
    await conversation.save();

    return res.send(conversation);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
});

/**
 * @route   DELETE /conversations/:id
 * @desc    Delete conversation by id
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const conversation = await Conversation.findByIdAndDelete(_id);
    if (!conversation)
      return res.status(404).json({ success: false, message: 'Conversation not found' });

    return res.send({ message: 'Conversation Deleted' });
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
});

module.exports = router;
