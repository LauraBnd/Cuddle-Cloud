const crypto = require('crypto');

const storeSessions = {};
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const sessionIdGenerator = () => {
    const sessionId = crypto.randomBytes(16).toString('hex');
    // console.log(`Session key "${sessionId}" created.`);
    return sessionId;
};

const getCookiesSession = (req) => {
    const cookies = {};
    const findCookie = req.headers?.cookie;
    // console.log(cookieHeader);
    if (findCookie) {
        findCookie.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    // console.log(cookies) // Check for cookie
    return cookies;
};


const checkSession = (session) => {
    return (Date.now() - session.timestamp) > SESSION_TIMEOUT;
};

// Cleanup function to delete expired session keys
const deleteSession = () => {
    for (const sessionId in storeSessions) {
        if (checkSession(storeSessions[sessionId])) {
            console.log(`Session key "${sessionId}" deleted.`);
            delete storeSessions[sessionId];
        }
    }
};

// Schedule cleanup function to run every 10 seconds
setInterval(deleteSession, 10 * 30 * 1000);

module.exports = {
    sessionIdGenerator,
    getCookiesSession,
    checkSession,
    storeSessions
};
