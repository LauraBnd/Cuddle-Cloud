const fs = require('fs');

function manageProfileRoute (req, res) {

            fs.readFile('public/profile.html', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Profile page cant be found!');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        };

module.exports = {
    manageProfileRoute,
};