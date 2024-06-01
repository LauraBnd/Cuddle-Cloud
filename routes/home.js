const fs = require('fs');

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
    manageHomeRoute

};
