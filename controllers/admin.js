const fs = require('fs');
const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const path = require('path');
const { db } = require('../models/db');

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
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Admin page is not found!');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

function adminGetUserImages(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { username } = JSON.parse(body);
        console.log(`Received request to get images for username: ${username}`);
        
        const userQuery = 'SELECT id FROM credentials WHERE username = ?';
        
        db.query(userQuery, [username], (err, userResult) => {
            if (err) {
                console.error('Database error fetching user ID:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }
            
            if (userResult.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
                return;
            }
            
            const userId = userResult[0].id;
            const imagesQuery = 'SELECT id, filename, title, description, upload_date FROM images WHERE user_id = ? ORDER BY upload_date DESC';
            
            db.query(imagesQuery, [userId], (err, imageResults) => {
                if (err) {
                    console.error('Database error fetching images:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                    return;
                }
                
                let imageGallery = '';
                imageResults.forEach(image => {
                    imageGallery += `
                        <div class="posted-image" id="image-${image.id}">
                            <img src="/images/${image.filename}" alt="${image.title}">
                            <div class="posted-image-description">
                                <div class="upload-info">
                                    <h3>${image.title}</h3>
                                    <p>${image.description}</p>
                                </div>
                                <p class="upload-date"><span>Uploaded at: </span>${image.upload_date}</p>
                                <button class="delete-button" onclick="deleteImage(${image.id})">Delete</button>
                            </div>
                        </div>`;
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ imageGallery }));
            });
        });
    });
}

function adminDeleteImage(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { imageId } = JSON.parse(body);
        console.log(`Received request to delete image with ID: ${imageId}`);
        
        const fetchImageQuery = 'SELECT filename FROM images WHERE id = ?';
        
        db.query(fetchImageQuery, [imageId], (err, result) => {
            if (err) {
                console.error('Database error fetching image filename:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }
            
            if (result.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }
            
            const filename = result[0].filename;
            
            const deleteImageQuery = 'DELETE FROM images WHERE id = ?';
            
            db.query(deleteImageQuery, [imageId], (err) => {
                if (err) {
                    console.error('Database error deleting image record:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                    return;
                }

                fs.unlink(path.join(__dirname, '../public/images', filename), (err) => {
                    if (err) {
                        console.error('File system error deleting image file:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    console.log('Image successfully deleted');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            });
        });
    });
}

function adminDeleteAccount(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { username } = JSON.parse(body);
        console.log(`Received request to delete account for username: ${username}`);
        
        const userQuery = 'SELECT id FROM credentials WHERE username = ?';
        
        db.query(userQuery, [username], (err, userResult) => {
            if (err) {
                console.error('Database error fetching user ID:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }
            
            if (userResult.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
                return;
            }
            
            const userId = userResult[0].id;
            
            const deleteQueries = [
                'DELETE FROM credentials WHERE id = ?',
                'DELETE FROM friendships WHERE user_id1 = ? OR user_id2 = ?',
                'DELETE FROM images WHERE user_id = ?',
                'DELETE FROM schedules WHERE profile_id = ?',
                'DELETE FROM user_profiles WHERE user_id = ?'
            ];
            
            const deleteTasks = deleteQueries.map(query => {
                return new Promise((resolve, reject) => {
                    db.query(query, [userId, userId], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            });
            
            Promise.all(deleteTasks)
                .then(() => {
                    console.log(`Account and related data for user ID ${userId} successfully deleted`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                })
                .catch(err => {
                    console.error('Database error deleting user data:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                });
        });
    });
}

module.exports = {
    adminPanel,
    adminGetUserImages,
    adminDeleteImage,
    adminDeleteAccount
};
