const mongoose = require('mongoose')

const tripSchema = mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club'
    },
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
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

    itenary: [
        {
            place: {
                type: String,
                required: true
            },
            latitude: {
                type: String,
                required: true
            },
            longitude: {
                type: String,
                required: true
            }
        }
    ]
})

module.exports = mongoose.model('trip', tripSchema)