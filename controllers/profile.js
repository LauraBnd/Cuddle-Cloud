const fs = require('fs');
const querystring = require('querystring');
const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const multer = require('multer');
const path = require('path');
const { db } = require('../models/db');
const bcrypt = require('bcrypt');
const url = require('url');

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
    const friendsQuery = `SELECT 
                            f.status, 
                            f.user_id1, 
                            f.user_id2, 
                            up.name,  -- Adjust this based on the actual column names in user_profiles
                            up.birthday,  -- Adjust this based on the actual column names in user_profiles
                            up.age,  -- Adjust this based on the actual column names in user_profiles
                            up.profile_photo -- Adjust this based on the actual column names in user_profiles
                        FROM 
                            friendship f
                        JOIN 
                            user_profiles up ON f.user_id2 = up.id
                        WHERE 
                            f.user_id1 = (SELECT id FROM user_profiles WHERE user_id = ?);
                        `;

    db.query(profileQuery, [userId], (err, profileResults) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database Error Profile');
            return;
        }

        const profileInfo = profileResults.length > 0 ? profileResults[0] : null;

        db.query(friendsQuery, [userId], (err, friendsResults) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error Friends');
                return;
            }

            let friendsRequests = '';
            friendsResults.forEach(friend => {
                friendsRequests += `
                    <div class="retrieved-friend">
                        <div class="req-photo">
                            <img src="/images/${friend.profile_photo}">
                        </div>
                        <div class="req-info">
                            <p><span>Name: </span>${friend.name}</p>
                            <p><span>Age: </span>${friend.age}</p>
                            <p><span>Status: </span>${friend.status}</p>
                        </div>

                        <div class="req-buttons">
                            <button class="accept-friend-request" data-friend-id="${friend.user_id2}">Accept</button>
                            <button class="decline-friend-request" data-friend-id="${friend.user_id2}">Decline</button>

                        </div>

                    </div>`;
            });





        db.query(imagesQuery, [userId], (err, imageResults) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error Gallery');
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
                data = data.replace('<!-- FRIEND_REQUESTS -->', friendsRequests);


                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
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


function manageFriends(req, res) {
    const urlParsed = url.parse(req.url, true);
    const querydb = urlParsed.query.query;

    if (querydb) {
        const sql = `SELECT * FROM user_profiles WHERE name LIKE ?`;
        db.query(sql, [`%${querydb}%`], (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            let response = '<div>';
            if (results.length > 0) {
                results.forEach(row => {
                    response += `
                        <div class="friend-profile">
                            <img src="/images/${row.profile_photo}">
                            <div class="friend-info">
                                <p><span>Name: </span>${row.name}</p>
                                <p><span>Birthday: </span>${row.birthday}</p>
                                <p><span>Age: </span>${row.age}</p>
                                <p><span>Description: </span>${row.description}</p>
                                <button class="send-friend-request" data-friend-id="${row.id}">Send Friend Request</button>
                            </div>
                        </div>`;
                });
            } else {
                response += '<p>No results found</p>';
            }
            response += '</div>';

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(response);
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('');
    }
}



function sendFriendRequest(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;

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
        const { friendId } = querystring.parse(body);

        if (!friendId) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing friendId');
            return;
        }

        console.log(`User ID: ${userId}, Friend ID: ${friendId}`);

        const sql = `INSERT INTO friendship (user_id1, user_id2, status) VALUES ((SELECT id from user_profiles WHERE user_id = ?), ?, 'pending')`;

        db.query(sql, [userId, friendId], (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            console.log('Friend request sent successfully');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Friend request sent successfully');
        });
    });
}

function acceptRequest(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;

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
        const { friendId } = querystring.parse(body);

        if (!friendId) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing friendId');
            return;
        }

        console.log(`User ID: ${userId}, Friend ID: ${friendId}`);

        const updateStatusQuery = 'UPDATE friendship SET status = "friends" WHERE user_id2 = ? AND user_id1 = (SELECT id from user_profiles WHERE user_id = ?)';

        db.query(updateStatusQuery, [friendId, userId], (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Friend request not found or already processed');
                return;
            }

            console.log('Friend request accepted successfully');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Friend request accepted successfully');
        });
    });
}



function declineRequest(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;
    console.log(userId)

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
        const { friendId } = querystring.parse(body);

        if (!friendId) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing friendId');
            return;
        }

        const deleteRequestQuery = 'DELETE FROM friendship WHERE user_id2 = ? AND user_id1 = (SELECT id from user_profiles WHERE user_id = ?)';

        db.query(deleteRequestQuery, [friendId, userId], (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Database Error');
                return;
            }

            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Friend request not found or already processed');
                return;
            }

            console.log('Friend request declined successfully');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Friend request declined successfully');
        });
    });
}


function getFriendRequests(req, res) {
    const cookies = getCookiesSession(req);
    const sessionId = cookies.sessionId;
    let userLogged = false;
    let userId;

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

    const query = `SELECT 
                            f.status, 
                            f.user_id1, 
                            f.user_id2, 
                            up.name,  -- Adjust this based on the actual column names in user_profiles
                            up.birthday,  -- Adjust this based on the actual column names in user_profiles
                            up.age,  -- Adjust this based on the actual column names in user_profiles
                            up.profile_photo -- Adjust this based on the actual column names in user_profiles
                        FROM 
                            friendship f
                        JOIN 
                            user_profiles up ON f.user_id2 = up.id
                        WHERE 
                            f.user_id1 = (SELECT id FROM user_profiles WHERE user_id = ?);
                        `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Database Error');
            return;
        }

        let response = '<div>';
        if (results.length > 0) {
            results.forEach(row => {
                response += `
                    <div class="friend-profile">
                        <img src="/images/${row.profile_photo}">
                        <div class="friend-info">
                            <p><span>Name: </span>${row.name}</p>
                            <p><span>Birthday: </span>${row.birthday}</p>
                            <p><span>Age: </span>${row.age}</p>
                            <p><span>Description: </span>${row.description}</p>
                            <button class="accept-friend-request" data-friend-id="${row.user_id2}">Accept Friend Request</button>
                            <button class="decline-friend-request" data-friend-id="${row.user_id2}">Decline Friend Request</button>
                        </div>
                    </div>`;
            });
        } else {
            response += '<p>No pending friend requests.</p>';
        }
        response += '</div>';

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(response);
    });
}



module.exports = {
    manageProfileRoute,
    manageProfileUpdate,
    manageUploadPost,
    manageDeleteImage,
    manageFriends,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    getFriendRequests,
};
