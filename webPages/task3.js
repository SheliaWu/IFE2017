var http = require("http");
var url = require("url");
var exec = require("child_process").exec;
var mongoose = require("mongoose");

http.createServer(function(request, response) {
	console.log('request received');
	var queryObj = url.parse(request.url,true).query;
	console.log(queryObj);
	var cmdStr = "phamtomjs task1.js ";
	exec(cmdStr + queryObj.word + " " + queryObj.device, function(err, stdout,stderr){
		if(err) {
			console.error(`exec error: ${error}`);
		} else {
			//todo
		}
	});

	mongoose.connect("mongodb://localhost/pservice");
	var db = mongoose.connection;
	db.on('error', console.err.bind(console, 'connection error'));
	db.once("open", function(callback) {
		console,log("mongoose connected!");
	});
	var resultSchema = new mongoose.Schema({
		code: Number,
		msg: String,
		word: String,
		device: String,
		time: Number,
		dataList:[{
			info: String,
			link: String,
			pic: String,
			title: String
		}]
	});
	var Result = mongoose.mode('Result', resultSchema);
	var result = new Result(JSON.parse(stdout));
	result.save(function(err, result) {
		if(err){
			console.error(err);
		} else {
			console.log(result);
		}
	})
	response.writeHead(200, {"Content-Type":"text/plain"});
	response.write("Hello world");
	response.end();
}).listen(8888);
console.log('sever started');