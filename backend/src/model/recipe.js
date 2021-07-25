const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Cookhub');

const Recipe = mongoose.model('Recipe', {
    UserID : String,
    title: {
        type: String,
        required: true
    },


    // content: {
    //     type: String,
    //     required: true
    // },
    // imagePath: { 
    //     type: String,
    //      required: true 
    //     },
    
    // recipeDate: {
    //         type: String,
    //         required: true
    //     },

    //     creator: { type: mongoose.Schema.Types.ObjectId,
    //          ref: "User", 
    //          required: true }
});


module.exports = Recipe;










