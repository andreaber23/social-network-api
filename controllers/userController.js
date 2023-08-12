const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUsers) => res.json(dbUsers))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getOneUserById(req, res) {
    User.findById(req.params.id)
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(dbUser);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  },

  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(dbUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  },

  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        return Thought.deleteMany({ userId: req.params.id });
      })
      .then(() => {
        res.json({ message: 'User and associated thoughts deleted' });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  },

  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(dbUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  },

  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(dbUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
