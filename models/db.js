const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '80.96.123.167',
    user: 'usvacces', // replace with your MySQL username
    password: 'Thr33#DaisofthyC@nd@r@$', // replace with your MySQL password
    database: 'web'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = { db };
