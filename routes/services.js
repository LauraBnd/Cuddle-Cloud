const fs = require('fs');


function manageServicesRoute (req, res) {

    fs.readFile('public/services.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Services page cant be found!');
            return;
        }


        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    manageServicesRoute
};
