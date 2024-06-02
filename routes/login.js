const fs = require('fs');
function manageLoginRoute(req, res) {
    fs.readFile('public/login.html', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Login page cant be found');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
})
}


module.exports = {
    manageLoginRoute,
};
