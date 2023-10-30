const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/chandan_user_database")

.then(() => {
    console.log("database has connected successful")
}).catch((error) => {
    console.log(error + "failed to connect database")
})