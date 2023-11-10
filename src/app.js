require('dotenv').config();

const express = require('express');
const path = require("path");
const app = express();

const jwt = require('jsonwebtoken');
const cors = require('cors');

const nodemailer = require("nodemailer");

const cookieParser = require('cookie-parser');

const randomstring = require('randomstring')
const bcrypt = require('bcrypt')

const auth = require('../src/middlewear/auth');


const hbs = require('hbs');


//connecting with the mysql 

const mysql = require('mysql');
//exporting the mqsql databases
var connec = require('./database/models/mysql')




require("./database/database")
var Chandan_user = require("./database/models/model");
const { checkPrime, secureHeapUsed } = require('crypto');
const { error } = require('console');
const { AsyncLocalStorage } = require('async_hooks');
const { link } = require('fs');
const { userInfo } = require('os');
const { connections, trusted } = require('mongoose');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))



//showing the looges in username navigation bar


const port = process.env.PORT || 3000;



//middlewear for the uploading file in the github

app.use(cors({
    origin: ["http://localhost:3000/index"]
}))




//accesing the public folder

var staticPath = path.join(__dirname, "../public");
var partilas_path = path.join(__dirname, "../templates/views")

app.use(cookieParser());



//using middleware
app.set("view engine", "hbs");
app.set("views", partilas_path);


app.use(express.static(staticPath))

app.get('/index', (req, res) => {
    res.render('index');
})


app.get('/mysql', (req, res) => {
    res.render('mysql')
})

app.post('/mysql', async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;



    const insertUserQuery = 'INSERT INTO chandanfamilydetails(name,email,phone) VALUES("' + name + '","' + email + '","' + phone + '")'

    connec.query(insertUserQuery, [name, email, phone], (err, results) => {
        if (err) {
            console.error('Error inserting user: ', err);
        } else {
            res.send(" registerd succesfull...");
        }

        // Close the database connection
        connec.end();
    });


})

app.get('/naming', function (req, res) {
    var sqll = "select * from chandan_userss";

    connec.query(sqll, function (error, result) {
        if (error) {
            console.error('Error executing SQL query: ' + error.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render("naming", { naming: result });
    });
});



app.get('/secret', auth, (req, res) => {
    // console.log(`this is the awsome part ${req.cookies.jwt}`)
    res.render('secret')
})

app.get('/log_out', auth, async (req, res) => {
    try {
        console.log(req.user);

        //for single logout from single devices
        // req.user.tokens = req.user.tokens.filter((currElemet) => {
        //     return currElemet.token !== req.token;
        // })

        //logout from all devices
        req.user.tokens = [];



        res.clearCookie("jwt");
        console.log("logout succesfull...")
        await req.user.save();
        res.render("index");

    } catch (error) {
        res.status(500).send(error)
    }
})



app.get('/sign', (req, res) => {
    res.render('sign')
})


//for whowng the name of the user who has login succesfully in the website of chadnan





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



        const token = await email_checking.generateAuthToken();
        console.log("the token part is : " + token);


        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (email_checking.password === password) {
            res.status(200).render('index')


        } else {
            res.send('please check your password')
        }





    } catch (error) {
        res.status(400).send("please check your email and try again")
        console.log(error)
    }

    var login_user = async (firstname, lastname) => {

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
            const token = await lamborghini.generateAuthToken();
            console.log("the token part is : " + token)

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });

            console.log(`this is the token part ${req.cookies.jwt}`)


            const registration = await lamborghini.save();
            console.log("the token part " + registration)









            var saving_data = await lamborghini.save();
            res.status(200).render('index');
            console.log(lamborghini)
            login_user(req.body.firstname, req.body.lastname)
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
            html: '<h1><i>hii' + " " + firstname + ' ' + lastname + ' please copy the link <a href="http://127.0.0.1:3000/forgot-password?token=' + token + '">click here </a>and reset your password</i></h1>'
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
        } else {
            res.send("your confirmpassword doesnot match to password")
        }



    } catch (error) {
        console.log(error)
    }

})


// send us massage form
app.get('/send_us_massage', (req, res) => {
    res.render('send_us_massage')
})

//creating the post method to send the email to the user

app.post('/send_us_massage', async (req, res) => {
    try {

        firstname = req.body.firstname,
            email = req.body.email,
            phone = req.body.phone,
            linkss = req.body.linkss,
            massage = req.body.massage

        sendingemail(req.body.firstname, req.body.email, req.body.phone, req.body.linkss, req.body.massage)

        res.send("<h1><i>massage has been succesfully sent </i></h1>")
    } catch (error) {
        console.log(error)
    }
})



//sending the realtime email by the user to the owner

const sendingemail = async (firstname, email, phone, linkss, massage) => {
    const sending_email_transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'utamsharma57@gmail.com',
            pass: 'mppe uspm dfnl nekk',
        }
    })
    const details_of_the_user = {
        from: email,
        to: "utamsharma57@gmail.com",
        subject: "Chandan sharma",
        html: `<h3><i> name : ${firstname} <br><hr> email : ${email} <br><hr> phone : ${phone} <hr><br> links of the website : ${linkss} <br><hr> massage : ${massage} `
    }

    sending_email_transporter.sendMail(details_of_the_user, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log(`massage has been succesfully sent...to : ${email}`)
        }
    })
}




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



