const fs = require('fs');

function manageMedicalRoute(req, res) {
    fs.readFile('public/medical.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error. Medical page is not available');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = {
    manageMedicalRoute
};
