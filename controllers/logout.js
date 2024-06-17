const { storeSessions, getCookiesSession } = require('../manageCookies');


function manageLogoutRoute(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;

    if (sessionId && storeSessions[sessionId]) {
        delete storeSessions[sessionId];
    }

    res.writeHead(302, {
        'Location': '/',
        'Set-Cookie': 'sessionId=; Max-Age=0; Path=/'
    });
    res.end();
}

module.exports = manageLogoutRoute;
