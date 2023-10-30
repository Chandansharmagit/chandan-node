const validator = require('validator');
const mongoose = require('mongoose');

var sign_up = new mongoose.Schema({
    firstname: {
        type: String,
        minlength: 3,
        required: true
    },
    lastname: {
        type: String,
        minlength: 3,
        required: true

    },

    email: {
        type: String,
        unique: true,
        validate(value) {
            if (!validator.isEmail) {
                throw new error("the email you entered is already exists please another email");
            }

        }
    },
    phone: {
        type: String,
        minlength: 10,
        unique: true,
        required: true
    },

    address: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: ''
    }

})



//now the creating the playlist 

var Chandan_user = new mongoose.model("Chandan_user", sign_up);
module.exports = Chandan_user;
