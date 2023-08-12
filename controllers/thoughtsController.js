const { User, Thought } = require('../models');

const thoughtsController = {
    getAllThoughts (req,res) {
        Thought.find({})
        .populate({
            path: 'reactions', 
            select: '-__v'})
        .select
            
 }
}