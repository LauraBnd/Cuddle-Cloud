const fs = require('fs');
const { db } = require('../models/db');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
const { storeSessions, sessionIdGenerator, getCookiesSession, checkSession } = require('../manageCookies');

function manageRegistertRoute (req, res) {
    fs.readFile('views/register.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Register page not found!!!');
            return;}
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
})}







const saltRounds = 10;


function manageRegisterPost(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const retrievedInputs = querystring.parse(body);
        const username = retrievedInputs.username;
        const password = retrievedInputs.password;
        const email = retrievedInputs.email;



        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                // console.error('Password was not hashed:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('!!!ERROR!!!');
                return;
            }

                
            const insertQuery = 'INSERT INTO credentials (username, password, email) VALUES (?, ?, ?)';
            db.query(insertQuery, [username, hash, email], (err, result) => {
                if (err) {
                    // console.error('Error inserting data into credentials:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error inserting data into database! -- credentials');
                    return;
                }

                const userId = result.insertId;
                const profileQuery = 'INSERT INTO user_profiles (user_id) VALUES (?)';
                db.query(profileQuery, [userId], (err) => {
                    if (err) {
                        // console.error('Error inserting data into user_profiles:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Iror inserting data into database! -- user_profiles');
                        return;
                    }
                    // const retrieveQuery = 'SELECT * FROM credentials WHERE username = ?'
                    // db.query(retrieveQuery, [username], (err, results) => {
                    //     console.log(username)

                    //     if (err) {
                    //         res.writeHead(500, { 'Content-Type': 'text/plain' });
                    //         res.end('This is an Error!!');
                    //         return;
                    //     }
            
                    //     if (results.username === username) {
                    //         console.log(username)
                    //         console.log(results.username)
                    //         res.writeHead(401, { 'Content-Type': 'text/plain' });
                    //         res.end('Username is taken -- try another one!!');
                    //         return;
                    //     }
                    res.writeHead(302, { 'Content-Type': 'text/plain',
                                         'Location': '/login'
                     });
                    res.end('Registration successful');
                });
            });
        });
    });
}




module.exports = {
    manageRegistertRoute,
    manageRegisterPost,
};