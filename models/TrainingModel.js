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
    muscleGroup: {
        type: Array,
        required: true,
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    get: value => value.toDateString()
})

module.exports = mongoose.model('Training', TrainingSchema)