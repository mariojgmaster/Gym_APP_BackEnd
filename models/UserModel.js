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
    status: {
        type: Boolean,
        require: true,
        default: true,
    },
    level: {
        // Level 0 = Owner
        // Level 1 = Admin 1
        // Level 2 = Admin 2
        // Level 3 = Coaches
        // Level 4 = Other Employees
        // Level 5 = Students
        type: Number,
        require: true,
        default: 5,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: false,
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    get: value => value.toDateString()
})

module.exports = mongoose.model('Users', UserSchema)