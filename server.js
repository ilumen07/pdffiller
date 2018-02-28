const http = require('http');
const fs = require('fs'); 
const accesslog = require('access-log');

if (process.argv.length != 4) {
    console.log("Usage: " + __filename + " <host> <port>");
    process.exit(-1);
}

const hostname = process.argv[2];
const port = process.argv[3];

var counter = {};

fs.readFile('counter.txt', function read(err, data) {
    if (err) {
	  counter = 0;
	  return;
    }
	counter = parseInt(data);
});

const server = http.createServer((req, res) => {
  counter++;
  fs.writeFile('counter.txt', counter, function (err) {
    if (err) throw err;
  });
  var format = 'date=":startDate" url=":url" method=":method" ip=":ip" \n';  
  accesslog(req, res, format, function(s) {
    fs.appendFile('access-log.txt', s, function (err) {
      if (err) throw err;
    });
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Accessed " + counter + " times\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
