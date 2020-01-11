const http = require('http');
const fs = require('fs');
const url = require('url');

const UPLOAD = `./public/uploads`;

http.createServer(handler).listen(3333);
console.log('File server running at port 3333');

function handler (req, res) {
    const {pathname} = url.parse(req.url, true);
    const filename = url.parse(req.url, true).query.name;
    const file = `${UPLOAD}/${filename}`;

    switch (req.method) {
        case 'GET':
            if (pathname === '/getUploaded') {
                sendUploaded();
            } else {
                showError404();
            }
            break;
        case 'POST':
            saveFile(file);
            break;
        default:
            showError404();
    }

    function sendUploaded() {
        fs.readdir(UPLOAD, (err, files) => {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.end();
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
            res.end(JSON.stringify({files}));
        });
    }

    function saveFile(filename) {
        const file = new fs.WriteStream(filename, {flags: 'wx'});
        let size = 0;

        req
            .on('data', (chunk) => {
                if (chunk !== null) {
                    size += chunk;
                }
            })
            .on('close', () => {
                file.destroy();
            })
            .pipe(file);

        file
            .on('error', err => {
                console.error(err);
                if (err.code === 'EEXIST') {
                    res.statusCode = 409;
                    res.end('File exists');
                } else {
                    if (!res.headersSent) {
                        res.writeHead(500, {'Connection': 'close'});
                        res.write('Internal error');
                    }
                    fs.unlink(filename, err => {
                        console.log('It happened!');
                        res.end();
                    });
                }

            });

        res.on('finish', () => console.log(`${filename} was saved`));
    }

    function showError404() {
        res.statusCode = 404;
        res.end("Page not found");
    }
}
