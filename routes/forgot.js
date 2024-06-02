const fs = require('fs');

function manageForgotRoute(req, res) {
    fs.readFile('public/forgot.html', (err, data) => {
        if(err){
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('!!!FORGOT Page not found!!!');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    manageForgotRoute
};
