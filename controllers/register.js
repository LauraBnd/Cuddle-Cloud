const fs = require('fs');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const { db } = require('../models/db');

const saltRounds = 10;

function handleRegistrationPage(req, res) {
    fs.readFile('views/register.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

function handleRegistration(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = querystring.parse(body);
        const username = parsedBody.username;
        const password = parsedBody.password;
        const email = parsedBody.email;

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            const query = 'INSERT INTO credentials (username, password, email) VALUES (?, ?, ?)';
            db.query(query, [username, hash, email], (err, result) => {
                if (err) {
                    console.error('Error inserting into credentials:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                const userId = result.insertId;
                const profileQuery = 'INSERT INTO user_profiles (user_id) VALUES (?)';
                db.query(profileQuery, [userId], (err) => {
                    if (err) {
                        console.error('Error inserting into user_profiles:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

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
    handleRegistrationPage,
    handleRegistration
};