const { getCookies, sessions, isSessionExpired } = require('../utils');

function handleDashboard(req, res) {
    const cookies = getCookies(req.headers.cookie);
    const sessionId = cookies.sessionId;

    if (sessionId && sessions[sessionId]) {
        if (isSessionExpired(sessions[sessionId])) {
            delete sessions[sessionId];
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Session expired. Please log in again.');
        } else {
            sessions[sessionId].timestamp = Date.now(); // Update timestamp on activity
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Welcome, ${sessions[sessionId].username}!`);
        }
    } else {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Please log in first');
    }
}

module.exports = {
    handleDashboard
};
