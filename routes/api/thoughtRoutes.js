const router = require('express').Router();
const {
  getAllThoughts,
  getOneThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughtsController');

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoguhts/:id
router
  .route('/:id')
  .get(getOneThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
