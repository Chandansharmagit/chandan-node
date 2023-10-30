const express = require('express');
const path = require("path");
const app = express();

const cors = require('cors');
// const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//const user_id = querystring.parse(req.url).user_id;
//req.res.locals.user_id = user_id;
const bodyParser = require('body-parser');
// const otpGenerator = require('otp-generator');
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')


const hbs = require('hbs');


require("./database/database")
var Chandan_user = require("./database/models/model");
const { checkPrime, secureHeapUsed } = require('crypto');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3001;



//middlewear for the uploading file in the github

app.use(cors({
    origin: ["http://localhost:3001/index"]
}))

//creating the middleawaer for the photo uploading

// const multer = require('multer');
// const grids = require('gridfs-stream');

// const upload = multer({
//     storage: multer.memoryStorage()
// });
// const uploadmiddlewear  = upload.single('file');









//accesing the public folder

var staticPath = path.join(__dirname, "../public");
var partilas_path = path.join(__dirname, "../templates/views")

//using middleware
app.set("view engine", "hbs");
app.set("views", partilas_path);


app.use(express.static(staticPath))

app.get('/index', (req, res) => {
    res.render('index');
})

//update the password
//app.get('/update-password',Chandan_user.update_password)
//app.post('/reset-password',Chandan_user.reset_password);

// app.post('/forgot_password',(req,res)=>{
//     res.send(Chandan_user.forgot_password)
// });


app.get('/sign', (req, res) => {
    res.render('sign')
})

//for sending email for the verification of the user

var email_sender = async (firstname, lastname, email) => {
    try {
        var email_transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'utamsharma57@gmail.com',
                pass: 'mpmr osmp sdba joyv',
            }
        })
        var details = {
            to: 'utamsharma57@gmail.com',
            from: email,
            subject: 'please verify your email',
            html: `<h3><i>firstname:-${firstname}</h3><hr><i><h3> :-${lastname}</h3><hr><br><h3>please click here to your mail</h3>`,

        }

        email_transporter.sendMail(details, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email has been sent succesfull...")
            }
        })

    } catch (error) {
        console.log(error)
    }
}





//send verification email to the user


// Create a random OTP


// Initialize Nodemailer with your email service details


// Send the OTP to the user's email


// Set up a simple API endpoint to send the OTP to the user's email



//verify email 





app.post('/sign', async (req, res) => {
    //to the users who already have an account

    try {
        var email = req.body.email
        var password = req.body.password

        //checkign the email matched with database or not

        var email_checking = await Chandan_user.findOne({ email: email });
        //checking password with database
        var password_checking = await bcrypt.compare(password, email_checking.password);


        if (email_checking.password === password) {
            res.status(200).render('index')
        } else {
            res.send('please check your password')
        }





    } catch (error) {
        res.status(400).send("please check your email and try again")
        console.log(error)
    }
})

app.get('/login', (req, res) => {
    res.render('login');
})


//user database and validation for cloud database
app.post('/login', async (req, res) => {








    try {

        var password = req.body.password;
        var confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            var lamborghini = new Chandan_user({
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                email: req.body.email,
                address: req.body.address,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                phone: req.body.phone

            })
            var saving_data = await lamborghini.save();
            res.status(200).render('index');
            console.log(lamborghini)
            //sendResetpassword(req.body.firstname, req.body.lastname, req.body.email)
            if (saving_data) {
                email_sender(req.body.firstname, req.body.lastname, req.body.email);

                // res.send("your email has been sent succesfull")
            }
        } else {
            res.send("please check you password")
        }

        //for verification of the email





    } catch (error) {
        console.log(error)
        res.render('login_error_page')
    }
})

//forgot password token and sending the email to the user
app.get('/forgot-password', async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Chandan_user.findOne({ token: token })
        if (tokenData) {
            res.render('forgot-password', { user_id: tokenData._id })

        } else {
            res.send("<h1>this link has been used</h1>")
        }

    } catch (error) {
        console.log(error)
    }
   
})

//sending forgot password to the user
const sendResetpassword = async (firstname, lastname, email, token) => {
    try {

        const transporters = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "utamsharma57@gmail.com",
                pass: "mppe uspm dfnl nekk"
            }
        })
        let details_of_ressetpassword = {
            from: 'utamsharma57@gmail.com',
            to: email,
            subject: 'for reset password',
            html: '<h1><i>hii' + " " + firstname + ' ' + lastname + ' please copy the link <a href="http://127.0.0.1:3001/forgot-password?token=' + token + '">click here </a>and reset your password</i></h1>'
        }

        transporters.sendMail(details_of_ressetpassword, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("mail has been send", info.response)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

//forgot password 
app.post('/forgot_password', async (req, res) => {
    // const forgot_password = async (req, res) => {

    try {

        const email = req.body.email;
        const forgot = await Chandan_user.findOne({ email: email });
        // const message_email = {
        //     message: "please check your inbox of mail and reset your password",
        // }

        if (forgot) {
            const randomString = randomstring.generate();
            sendResetpassword(forgot.firstname, forgot.lastname, forgot.email, randomString)
            const data_form = await Chandan_user.updateOne({ email: email }, { $set: { token: randomString } });
            res.status(200).send("<h1><i>Please Check your Inbox of Mail And Reset Your Password</i></h1>");

        } else {
            res.status(200).send("<h1><i>this email does not exist</i></h1>")
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
    //}

})

app.get('/forgot_password', (req, res) => {
    res.render("forgot_password")
})
app.post('/forgot-password', async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) {
            const user_data = await Chandan_user.findByIdAndUpdate({ _id: user_id }, { $set: { confirmpassword: confirmpassword, password: password, token: '' } }, { new: true })
            res.send("<h1><i>your password has been reset</i></h1>");
        }else{
            res.send("your confirmpassword doesnot match to password")
        }


    } catch (error) {
        console.log(error)
    }
   
})





app.get('/login_error_page', (req, res) => {
    res.render('login_error_page')
})




app.listen(port, '127.0.0.1', () => {
    try {
        console.log(`your port has been listened on ${port}`)
    } catch (err) {
        console.log(err)
    }
})



