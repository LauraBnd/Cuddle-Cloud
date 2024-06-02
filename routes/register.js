const fs = require('fs');


function manageRegistertRoute (req, res) {
    fs.readFile('public/register.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Register page not found!!!');
            return;}
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
})}


module.exports = {
    manageRegistertRoute,
};