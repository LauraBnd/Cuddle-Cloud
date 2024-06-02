const fs = require('fs');

function manageContactRoute(req, res) {

    fs.readFile('public/contact.html', (err, data) => {
        if(err){
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Contact page cant be found!');
            return;}

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);});}

module.exports = {
    manageContactRoute
};
