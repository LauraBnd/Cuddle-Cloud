const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const { db } = require('../models/db');

function saveMedicalInfo(req, res) {
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
        const { start, end, symptoms, treatment, details } = JSON.parse(body);

        db.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [userId], (err, results) => {
            if (err || results.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid user profile ID' }));
                return;
            }

            db.query('INSERT INTO medical (user_id, start_date, end_date, symptoms, treatment, details) VALUES (?, ?, ?, ?, ?, ?)', [userId, start, end, symptoms, treatment, details], (err, results) => {
                if (err) {
                    console.error('Error saving medical info:', err);
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

function getMedicalInfo(req, res) {
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

    db.query('SELECT id, start_date, end_date, symptoms, treatment, details FROM medical WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving medical info:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, medical: [] }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, medical: results }));
    });
}

function deleteMedicalInfo(req, res) {
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

    db.query('DELETE FROM medical WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
        if (err) {
            console.error('Error deleting medical info:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
    });
}
function saveFamilyInfo(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;

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
        const { full_name, birthday, parents_name, blood_type } = JSON.parse(body);

        // Check if family info already exists for the user
        db.query('SELECT * FROM family_info WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error checking family info:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
                return;
            }

            if (results.length > 0) {
                // Update existing family info
                db.query('UPDATE family_info SET full_name = ?, birthday = ?, parents_name = ?, blood_type = ? WHERE user_id = ?', 
                [full_name, birthday, parents_name, blood_type, userId], 
                (err, results) => {
                    if (err) {
                        console.error('Error updating family info:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: err.message }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            } else {
                // Insert new family info
                db.query('INSERT INTO family_info (user_id, full_name, birthday, parents_name, blood_type) VALUES (?, ?, ?, ?, ?)', 
                [userId, full_name, birthday, parents_name, blood_type], 
                (err, results) => {
                    if (err) {
                        console.error('Error saving family info:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: err.message }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            }
        });
    });
}

function getFamilyInfo(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;

    if (sessionId && storeSessions[sessionId] && !checkSession(storeSessions[sessionId])) {
        userLogged = true;
        userId = storeSessions[sessionId].userId;
    }

    if (!userLogged) {
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }

    db.query('SELECT full_name, birthday, parents_name, blood_type FROM family_info WHERE user_id = ?', [userId], 
    (err, results) => {
        if (err) {
            console.error('Error retrieving family info:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, info: null }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, info: results[0] }));
    });
}


module.exports = {
    saveMedicalInfo,
    getMedicalInfo,
    deleteMedicalInfo,
    saveFamilyInfo,
    getFamilyInfo
};
