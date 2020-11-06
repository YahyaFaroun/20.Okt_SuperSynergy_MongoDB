const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: {
        type: String
    },
    comment: {
        type: String
    },
    author_url: {
        type: String
    }
}, {timestamps: true})

const requestModelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    author_url: {
        type: String,
        required: true
    },
    request: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    comments: {
        type: [commentSchema]
    }
}, { timestamps: true })

const requestModel = mongoose.model('request', requestModelSchema)
module.exports = requestModel