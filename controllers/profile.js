const fs = require('fs');
const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const multer = require('multer');
const path = require('path');
const { db } = require('../models/db');
const bcrypt = require('bcrypt');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

function manageProfileRoute(req, res) {
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
    
    const profileQuery = 'SELECT name, birthday, age, description, profile_photo FROM user_profiles WHERE user_id = ?';
    const imagesQuery = 'SELECT id, filename, title, description, upload_date FROM images WHERE user_id = ? ORDER BY upload_date DESC';

    db.query(profileQuery, [userId], (err, profileResults) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database Error');
            return;
        }

        const profileInfo = profileResults.length > 0 ? profileResults[0] : null;

        db.query(imagesQuery, [userId], (err, imageResults) => {
            if (err) {
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

            fs.readFile('views/profile.html', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                if (profileInfo) {
                    data = data.replace('<!-- PROFILE_INFO -->', `
                        <img src="/images/${profileInfo.profile_photo}">
                        <div class="user-info">
                        <p>Name: ${profileInfo.name}</p>
                        <p>Birthday: ${profileInfo.birthday}</p>
                        <p>Age: ${profileInfo.age}</p>
                        <p>Description: ${profileInfo.description}</p>
                        </div>
                    `);
                } else {
                    data = data.replace('<!-- PROFILE_INFO -->', '<p>No profile information available.</p>');
                }

                data = data.replace('<!-- IMAGE_GALLERY -->', imageGallery);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        });
    });
}

function manageUploadPost(req, res) {
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
    upload.single('photo')(req, res, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const title = req.body.title;
        const description = req.body.description;
        const photo = req.file;
        const todayDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (photo) {
            const query = 'INSERT INTO images (user_id, filename, title, description, upload_date) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [userId, photo.filename, title, description, todayDate], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                    return;
                }

                res.writeHead(302, { 'Location': '/profile' });
                res.end();
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No file uploaded.');
        }
    });
}

function manageProfileUpdate(req, res) {
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

    upload.single('profile_photo')(req, res, function (err) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const { name, birthday, age, description, myuser, password } = req.body;
        const profilePhoto = req.file ? req.file.filename : null;

        // Fetch current profile info
        const fetchProfileQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
        db.query(fetchProfileQuery, [userId], (err, currentProfile) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            const currentProfileInfo = currentProfile[0];

            // Prepare update profile query dynamically
            let updateProfileQuery = 'UPDATE user_profiles SET ';
            let profileParams = [];

            if (name) {
                updateProfileQuery += 'name = ?, ';
                profileParams.push(name);
            }
            if (birthday) {
                updateProfileQuery += 'birthday = ?, ';
                profileParams.push(birthday);
            }
            if (age) {
                updateProfileQuery += 'age = ?, ';
                profileParams.push(age);
            }
            if (description) {
                updateProfileQuery += 'description = ?, ';
                profileParams.push(description);
            }
            if (profilePhoto) {
                updateProfileQuery += 'profile_photo = ?, ';
                profileParams.push(profilePhoto);
            }

            // Remove the last comma and space
            updateProfileQuery = updateProfileQuery.slice(0, -2);
            updateProfileQuery += ' WHERE user_id = ?';
            profileParams.push(userId);

            const updateCredentialsQuery = `
                UPDATE credentials SET username = ?${password ? ', password = ?' : ''}
                WHERE id = ?`;
            
            const updateProfile = (hashedPassword) => {
                if (profileParams.length > 1) { // Ensure there's something to update
                    db.query(updateProfileQuery, profileParams, (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Database Error');
                            return;
                        }

                        const credentialsParams = password ? [myuser, hashedPassword, userId] : [myuser, userId];
                        
                        db.query(updateCredentialsQuery, credentialsParams, (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Database Error');
                                return;
                            }
                            res.writeHead(302, { 'Location': '/profile' });
                            res.end();
                        });
                    });
                } else {
                    // If no profile data to update, only update credentials if necessary
                    if (myuser || password) {
                        const credentialsParams = password ? [myuser, hashedPassword, userId] : [myuser, userId];
                        
                        db.query(updateCredentialsQuery, credentialsParams, (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Database Error');
                                return;
                            }
                            res.writeHead(302, { 'Location': '/profile' });
                            res.end();
                        });
                    } else {
                        res.writeHead(302, { 'Location': '/profile' });
                        res.end();
                    }
                }
            };

            if (password) {
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    updateProfile(hashedPassword);
                });
            } else {
                updateProfile();
            }
        });
    });
}

// Function to handle image deletion
function manageDeleteImage(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;

    if (sessionId && storeSessions[sessionId] && !checkSession(storeSessions[sessionId])) {
        userLogged = true;
        userId = storeSessions[sessionId].userId;
    }

    if (!userLogged) {
        console.log('User not logged in or session expired');
        res.writeHead(302, { 'Location': '/login' });
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { imageId } = JSON.parse(body);
        console.log(`Received request to delete image with ID: ${imageId}`);

        const fetchImageQuery = 'SELECT filename FROM images WHERE id = ? AND user_id = ?';
        db.query(fetchImageQuery, [imageId, userId], (err, result) => {
            if (err) {
                console.error('Database error fetching image filename:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            if (result.length === 0) {
                console.log('Image not found or does not belong to the user');
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }

            const filename = result[0].filename;
            console.log(`Image filename to delete: ${filename}`);

            const deleteImageQuery = 'DELETE FROM images WHERE id = ? AND user_id = ?';
            db.query(deleteImageQuery, [imageId, userId], (err) => {
                if (err) {
                    console.error('Database error deleting image record:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Database Error');
                    return;
                }

                // Delete the file from the file system
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


module.exports = {
    manageProfileRoute,
    manageProfileUpdate,
    manageUploadPost,
    manageDeleteImage,
};
