const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Cookhub');

const User = mongoose.model('User', {
    
    username: String
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },

    // password: {
    //     type: String,
    //     required: true
    // },
});


module.exports = User;