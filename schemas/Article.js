const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var ArticlesSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = ArticlesSchema