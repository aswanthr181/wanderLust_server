const mongoose=require('mongoose')
const chatSchema=mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'club'
    },
    messages:[
        {
            type:{
                type:String,
                required:true
            },
            text:{
                type:String,
                required:true
            },
            sender:{
                type:String,
                requied:true
            },
            picture:{
                type:String,
                required:true
            }
        }
    ]
})

module.exports=mongoose.model('chat',chatSchema)