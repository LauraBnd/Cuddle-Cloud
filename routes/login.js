const fs = require('fs');
const { storeSessions, sessionIdGenerator } = require('../manageCookies');
const querystring = require('querystring');
const bcrypt = require('bcrypt');
const { db } = require('../db');
function manageLoginRoute(req, res) {
    fs.readFile('public/login.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Login page cant be found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
})
}



function manageLoginPosts(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = querystring.parse(body);
        const username = parsedBody.username;
        const password = parsedBody.password;
        // console.log(username);
        // console.log(password);

        const query = 'SELECT * FROM credentials WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error!!');
                return;
            }

            if (results.length === 0) {
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Invalid username or password');
                return;
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                if (isMatch) {
                    const sessionId = sessionIdGenerator();
                    storeSessions[sessionId] = {
                        userId: user.id,
                        username: user.username,
                        timestamp: Date.now()
                    };

                    res.writeHead(302, {
                        'Content-Type': 'text/plain',
                        'Set-Cookie': `sessionId=${sessionId}; HttpOnly`,
                        'Location': '/profile'
                        
                    });
                    res.end('Login successful');
                } else {
                    res.writeHead(401, { 'Content-Type': 'text/plain' });
                    res.end('Invalid username or password');
                }
            });
        });
    });
}



module.exports = {
    manageLoginRoute,
    manageLoginPosts,
};
