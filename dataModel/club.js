const mongoose = require('mongoose')
const clubSchema = mongoose.Schema({
    clubName: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    },
    members: [
        {
            email: {
                type: String,
            },
            member: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
        }
    ],
    logo: {
        type: String,
    },
    location: {
        place: {
            type: String,
            required: true,
            trim: true,
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    createdAt: {
        type: Date
    }
})

module.exports = mongoose.model('club', clubSchema)