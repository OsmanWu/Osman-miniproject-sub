const mysql = require("mysql2");

const connection = mysql.createConnection({
   // host: 'localhost',
    //user: 'root',
    //password: 'Republic_C207',
    //database: 'travelweb'

    host: 'sql.freedb.tech',
    user: 'freedb_Osman',
    password: '&3C7jBZZ9sRfE9E',
    database: 'freedb_travelweb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;
