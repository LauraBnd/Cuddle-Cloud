const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '80.96.123.167',
    user: 'usvacces',
    password: 'Thr33#DaisofthyC@nd@r@$',
    database: 'web'
});

db.connect((err) => {
    if (err) {
        console.error('Connection to database -- failed:', err.stack);
        return;
    }
    console.log('Connection to database -- success');
});

module.exports = { db };
