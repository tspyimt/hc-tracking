/**
 * Created by tungtouch on 2/5/15.
 */

/*
* Listen UDP from Device: 128.199.126.250
* */

var dgram = require("dgram");
var colors = require('colors');
var FIFO = require('dequeue');
var async = require('async');
var redis = require("redis");
var rClient = redis.createClient();

//var ports = [4000, 4001, 4002, 3333, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011];
var ports = [4444];
var r = 0;

var client = dgram.createSocket('udp4');


rClient.on("error", function (err) {
    console.log("Error " + err);
});



for(var i=0; i < ports.length; i++){
    fetcher();

    console.log("Start listen port ",i,":", ports[i]);

    client.on("error", function (err) {
        console.log("Server error:\n".red + err.stack);
        client.close();
    });


    client.on("message", function (msg, rinfo) {
        //console.log("Message:", msg);
        FIFO.push(msg);

    });

    client.bind(ports[i]);

    function fetcher() {
        console.log("Fetcher Rung", FIFO);
        while (FIFO.length > 0)
        {
            var msg = FIFO.shift();
            console.log("Message: ", msg);
            process.nextTick(fetcher);
        }
        //setImmediate(fetcher); //make this function continuously run
    }
}
