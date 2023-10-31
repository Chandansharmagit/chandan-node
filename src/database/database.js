const mongoose = require('mongoose');
//this the method to connect with cloud database
mongoose.connect( 'mongodb+srv://chandansharma575757:HYt3VxJHB8jsPf51@cluster0.hied47d.mongodb.net/chandan_user_database?retryWrites=true&w=majority')
//to connet with the mongodb app
//mongoose.connect('mongodb.connect://127.0.0.1/27017/chandan_user_database')

.then(() => {
    console.log("database has connected successful")
}).catch((error) => {
    console.log(error + "failed to connect database")
})