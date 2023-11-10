const jwt = require("jsonwebtoken");

const Chandan_user = require("../database/models/model");

const auth = async (req,res,next) => {
    try{
        
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token,"mynameischandansharmaclassnepalsecondaryschool");
        console.log(verifyuser);

        const username = await Chandan_user.findOne({_id:verifyuser._id});


        console.log(username);
        req.token = token;
        req.user = username;
        next();


    }catch(error){
        
        res.status(404).send("please login at first to get the secret page")
        
    }
}

module.exports = auth;