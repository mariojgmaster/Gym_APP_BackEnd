const { Decimal128 } = require('bson')
const mongoose = require('mongoose')
const { Schema } = mongoose

const TrainingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        require: true,
        default: true,
    },
    muscleGroup: {
        type: Array,
        required: true,
    },
    series: {
        type: Number,
        require: false,
    },
    repeatitions: {
        type: Number,
        require: false,
    },
    weight: {
        type: Decimal128,
        require: false,
    },
    imageUrl: {
        type: String,
        require: true,
    },
    videoUrl: {
        type: String,
        require: false,
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    get: value => value.toDateString()
})

module.exports = mongoose.model('Training', TrainingSchema)