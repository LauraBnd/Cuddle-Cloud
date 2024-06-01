const fs = require('fs');
const path = require('path');

// Manage the css to be used in .html files
function manageStyleCSS(req, res) {
    const cssLocation = path.join(__dirname, '../public/css', path.basename(req.url));
    fs.readFile(cssLocation, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Cant find the css flise');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
    });
}
// Manage the .html files to work with nodejs
function manageHomeRoute (req, res) {
    fs.readFile('public/index.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('There is a server error!!!');
            return;
        }
    
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    manageHomeRoute,
    manageStyleCSS
};
