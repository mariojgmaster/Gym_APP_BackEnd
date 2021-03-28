const mongoose = require('mongoose')
const { Schema } = mongoose
const crypto = require('crypto')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        set: value => crypto.createHash('md5').update(value).digest('hex')
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    get: value => value.toDateString()
})

module.exports = mongoose.model('Users', UserSchema)