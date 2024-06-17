const fs = require('fs');
const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');



function adminPanel(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;

    if (sessionId && storeSessions[sessionId] && !checkSession(storeSessions[sessionId])) {
        userLogged = true;
        userId = storeSessions[sessionId].userId;
    }

    if (!userLogged) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }


    fs.readFile('views/admin.html', (err, data) => {
        if (err){
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Admin page is not found!');
            return;}
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
});
}

module.exports = {
    adminPanel
};
