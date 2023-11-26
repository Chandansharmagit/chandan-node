const jwt = require("jsonwebtoken");

const Chandan_user = require("../database/models/model");
const { changeUser } = require("../database/models/mysql");

const auth = async (req, res, next) => {
    try {
        //requesting token with cookies 
        const token = req.cookies.jwt;
        //varifying the token 
        const verification = jwt.verify(token, "thenameischanansharmaclassnepalsecondaryschoolthename");
        //consoling the verification
       // console.log(verification);

        //matching the user id with verification 
        const username = await Chandan_user.findOne({ _id: verification._id });
        //consoling the username in the console 
        //console.log(username);

        //now requesting token from the user
        req.token = token;
        req.user = username;
        next();

    } catch (error) {

        res.status(404).render('loginatfirst')

    }
}

module.exports = auth;