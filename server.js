const http = require('http');
const fs = require('fs');
const url = require('url');

const UPLOAD = `./public/uploads`;
const MAX_FILE_SIZE = 1048576;

http.createServer(handler).listen(3333);
console.log('File server running at port 3333');

function handler (req, res) {
    const {pathname} = url.parse(req.url, true);
    const filename = url.parse(req.url, true).query.name;
    const file = `${UPLOAD}/${filename}`;
    console.log(pathname, filename, req.method/*, req.headers*/);

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

    function sendFile(filename) {
        const file = new fs.ReadStream(filename);

        file
            .on('error', (err) => {
                console.log('Error on file send!', err);
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end(`File ${filename} not found.`);
                } else {
                    res.statusCode = 500;
                    res.end('System error.');
                }
            })
            .pipe(res);

        res.on('close', () => {
            file.destroy();
        })
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
            console.log(JSON.stringify({files}));
        });
    }

    function saveFile(filename) {
        /*if (req.headers['content-length'] > MAX_FILE_SIZE) {
            showErrorTooBigFile();
        }*/

        const file = new fs.WriteStream(filename, {flags: 'wx'});
        let size = 0;

        req
            .on('data', (chunk) => {
                if (chunk !== null) {
                    size += chunk;
                }

                /*if (size > MAX_FILE_SIZE) {
                    res.setHeader('Connection', 'close');
                    showErrorTooBigFile();
                    file.destroy();
                    fs.unlink(filename, err => {
                        console.log('It happened of MAX_FILE_SIZE', err);
                    })
                }*/
            })
            .on('close', () => {
                file.destroy();
            })
            .pipe(file)

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
                        console.log('It happened on file.error');
                        res.end();
                    });
                }

            })
            .on('finish', () => {
                res.statusCode = 200;
                res.end("Saved successful");
            });

        res.on('finish', () => console.log(`${filename} was saved`));

    }

    function showError404() {
        res.statusCode = 404;
        res.end("Page not found");
    }

    function showErrorTooBigFile() {
        res.statusCode = 413;
        res.end('Maximum file size is 1 MB');
    }
}
