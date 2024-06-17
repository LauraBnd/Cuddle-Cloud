const fs = require('fs');
const { sessions, getCookies, isSessionExpired } = require('../utils');


function handleAdmin(req, res) {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;
    let isLoggedIn = false;

    if (sessionId && sessions[sessionId] && !isSessionExpired(sessions[sessionId])) {
        isLoggedIn = true;
        userId = sessions[sessionId].userId;
    }

    if (!isLoggedIn) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }
    fs.readFile('views/admin.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    handleAdmin
};
