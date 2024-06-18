const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const { db } = require('../models/db');

function saveSchedule(req, res) {
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

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { date, day, hour, endTime, program, details } = JSON.parse(body);

        db.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [userId], (err, results) => {
            if (err || results.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid user profile ID' }));
                return;
            }

            db.query('INSERT INTO schedules (profile_id, date, day, hour, end_time, program, details) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, date, day, hour, endTime, program, details], (err, results) => {
                if (err) {
                    console.error('Error saving schedule:', err);  
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        });
    });
}

function getSchedule(req, res) {
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

    db.query('SELECT id, date, day, hour, end_time, program, details FROM schedules WHERE profile_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving schedule:', err);  
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, schedule: [] }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, schedule: results }));
    });
}

function deleteSchedule(req, res) {
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

    const id = req.url.split('/').pop();

    db.query('DELETE FROM schedules WHERE id = ? AND profile_id = ?', [id, userId], (err, results) => {
        if (err) {
            console.error('Error deleting schedule:', err);  
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
    });
}

module.exports = {
    saveSchedule,
    getSchedule,
    deleteSchedule,
};
