const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")

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
        default: '',
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
//generating
sign_up.methods.generateAuthToken = async function() {
    try {
        //consoling with id to get user id information
        // console.log(this._id);
        //converting the given token into the string foe cancatination
        const token = jwt.sign({ _id: this._id.toString() }, "thenameischanansharmaclassnepalsecondaryschoolthename");
        //concating the tokens with token
        this.tokens = this.tokens.concat({ token })
        //saving the concatded token
        await this.save();
        //reternin the tokens with token
        return token;

    } catch (error) {

       
        console.log("the error part " + error);
    }
}

//now the creating the playlist 

var Chandan_user = new mongoose.model("Chandan_user", sign_up);
module.exports = Chandan_user;
