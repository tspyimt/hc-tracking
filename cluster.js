/**
 * Created by tungtouch on 2/9/15.
 */
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Keep track of http requests
    var numReqs = 0;

    setInterval(function() {
        console.log("numReqs =", numReqs);
    }, 1000);

    // Count requestes
    function messageHandler(msg) {
        if (msg.cmd && msg.cmd == 'notifyRequest') {
            numReqs += 1;
        }
    }

    // Start workers and listen for messages containing notifyRequest
    //var numCPUs = require('os').cpus().length;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', messageHandler);
    });

} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}
