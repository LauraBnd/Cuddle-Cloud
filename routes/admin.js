const fs = require('fs');


function adminPanel(req, res) {
    fs.readFile('public/admin.html', (err, data) => {
        if (err){
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;}
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
});
}

module.exports = {
    adminPanel
};
