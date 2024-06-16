const fs = require('fs');
const { storeSessions, getCookiesSession, checkSession } = require('../manageCookies');
const multer = require('multer');
const path = require('path');
const { db } = require('../db');
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




// ###################### This manages the /profile page ######################
function manageProfileRoute (req, res) {
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
    const imagesQuery = 'SELECT filename, title, description, upload_date FROM images WHERE user_id = ?';

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
                    <div class="content">
                        <img src="/images/${image.filename}" alt="${image.title}">
                        <h3>${image.title}</h3>
                        <p>${image.description}</p>
                        <p>${image.upload_date}</p>
                    </div>`;
            });

            fs.readFile('public/profile.html', 'utf8', (err, data) => {
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




// ###################### This manages the /upload POST type when user uploads a file ######################
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

        if (photo) {
            const query = 'INSERT INTO images (user_id, filename, title, description) VALUES (?, ?, ?, ?)';
            db.query(query, [userId, photo.filename, title, description], (err, result) => {
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


// ###################### This manages the profile update functions ######################
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
        console.log(profilePhoto)
        const updateProfileQuery = `
            UPDATE user_profiles SET name = ?, birthday = ?, age = ?, description = ?${profilePhoto ? ', profile_photo = ?' : ''}
            WHERE user_id = ?`;
        const updateCredentialsQuery = `
            UPDATE credentials SET username = ?${password ? ', password = ?' : ''}
            WHERE id = ?`;
        const profileParams = profilePhoto ? [name, birthday, age, description, profilePhoto, userId] : [name, birthday, age, description, userId];

        const updateProfile = (hashedPassword) => {
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
}




module.exports = {
    manageProfileRoute,
    manageProfileUpdate,
    manageUploadPost,
};