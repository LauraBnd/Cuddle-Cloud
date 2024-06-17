const crypto = require('crypto');

const sessions = {}; // Object to store session data
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const generateSessionId = () => {
    const sessionId = crypto.randomBytes(16).toString('hex');
    // console.log(`Session key "${sessionId}" created.`);
    return sessionId;
};

const getCookies = (req) => {
    const cookies = {};
    const cookieHeader = req.headers?.cookie;
    // console.log(cookieHeader);
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    // console.log(cookies) // Check for cookie
    return cookies;
};


const isSessionExpired = (session) => {
    return (Date.now() - session.timestamp) > SESSION_TIMEOUT;
};

// Cleanup function to delete expired session keys
const cleanupExpiredSessions = () => {
    for (const sessionId in sessions) {
        if (isSessionExpired(sessions[sessionId])) {
            console.log(`Session key "${sessionId}" deleted.`);
            delete sessions[sessionId];
        }
    }
};

// Schedule cleanup function to run every 10 seconds
setInterval(cleanupExpiredSessions, 10 * 30 * 1000);

module.exports = {
    generateSessionId,
    getCookies,
    isSessionExpired,
    sessions
};
