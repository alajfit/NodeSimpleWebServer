console.log('Loading Modules');
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs'); // file system

// Array of Mime Types
var mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css"
}

// Create Server
http.createServer(function(req, res){
    // We must gather the path name from the URL (we pass the req url)
    var uri = url.parse(req.url).pathname;
    // process.cwd gets the current working directory, here we join with the path
    var fileName = path.join(process.cwd(),unescape(uri));
    console.log('Loading ' + uri);
    var stats;

    // We now attempt to gather the file or show a 404 and log the error message
    try {
        stats = fs.lstatSync(fileName);
    } catch(e) {
        res.writeHead(302, {
            'Location' : '404.html'
        });
        // res.writeHead(404, { 'Content-type' : 'text/plain' });
        //res.write('404 Not Found\n');
        res.end();
        console.log(e.message);
        return;
    }

    // Check if file/ directory
    if(stats.isFile()) {
        // We must get the file extension passed the split the URL by the dot and rever
        // so the file extension is the first element
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-type' : mimeType});
        console.log('200 - ' + fileName +' found and displayed');

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location' : 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {'Content-type' : 'text/plain'});
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(3000); console.log("Loading and Listening on http://127.0.0.1:3000/index.html");
