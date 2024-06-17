const { getCookies, sessions } = require('../utils');

function handleLogout(req, res) {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
    }

    res.writeHead(302, {
        'Location': '/',
        'Set-Cookie': 'sessionId=; Max-Age=0; Path=/'
    });
    res.end();
}

module.exports = handleLogout;
