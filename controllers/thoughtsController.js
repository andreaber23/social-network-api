const { User, Thought } = require('../models');

const thoughtsController = {
    getAllThoughts (req,res) {
        Thought.find({})
        .populate({
            path: 'reactions', 
            select: '-__v'})
        .select('-__v')
        .then(dbThought => res.json(dbThought))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });    
 },
    getOneThoughtById(req,res) {
        Thought.findById(req.params.id)
        .populate({
            path: 'reactions',
            select: '-__v'})
        .select('-__v')
        .then(dbThought => {
            if(!dbThought) {
            res.status(404).json({message: 'No thoughts with this ID!'});
            return;
        }
        res.json(dbThought)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    createThought(req, res) {
        Thought.create(req.body)
          .then((dbThought) => {
            return User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: dbThought._id } },
                { new: true }
            )
          })
          .then((dbUser) => {
            if (!dbUser) {
              return res.status(404).json({ message: "No user with this id!" });
            }
            res.json({ message: "Thought successfully created!" });
          })
          .catch((err) => {
            console.error(err);
            res.status(400).json(err);
          });
      },

    updateThought(req, res) {
        Thought.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
          .then((dbThought) => {
            if (!dbThought) {
              return res.status(404).json({ message: 'Thought not found with this id' });
            }
            res.json(dbThought);
          })
          .catch((err) => {
            console.error(err);
            res.status(400).json(err);
          });
      },

      deleteThought(req, res) {
        Thought.findByIdAndDelete(req.params.id)
          .then((dbThought) => {
            if (!dbThought) {
              return res.status(404).json({ message: 'Thought not found with this id' });
            }
            console.log('Deleted Thought:', dbThought);
      
            return User.findByIdAndUpdate(
              dbThought.userId,
              { $pull: { thoughts: req.params.id } },
              { new: true }
            );
          })
          .then((dbUser) => {
            if (!dbUser) {
              return res.status(404).json({ message: 'Thought deleted' });
            }
            console.log('Updated User:', dbUser);
      
            res.json({ message: 'Thought deleted' });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json(err);
          });
      },
      
    addReaction(req, res) {
        Thought.findByIdAndUpdate(
          req.params.thoughtId,
          { $push: { reactions: req.body } },
          { new: true,runValidators: true }
        )
          .then((dbThought) => {
            if (!dbThought) {
              return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(dbThought);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json(err);
          });
      },

    deleteReaction(req, res) {
        Thought.findByIdAndUpdate(
          req.params.thoughtId,
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { new: true }
        )
          .then((dbThought) => {
            if (!dbThought) {
              return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(dbThought);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json(err);
          });
      },
    };
    
    module.exports = thoughtsController;

