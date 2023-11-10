const mysql = require('mysql');

const connec = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chandanfamily"
})

connec.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connec;




// })

