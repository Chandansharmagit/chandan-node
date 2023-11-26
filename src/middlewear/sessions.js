const islogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {

        } else {
            res.redirect('/welcome')
        }


    } catch (error) {
        console.log(error)
    }
    next();
}


const islogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/welcome')
        }
        next();


    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    islogin,
    islogout,
}
