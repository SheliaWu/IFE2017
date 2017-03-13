/*var page=require('webpage').create();
page.open('http://m.bing.com', function(status){
	if(page.injectJs('jquery.min.js')){
	var title=page.evaluate(function(){
      return $('title').text();
    });
   console.log(title);
}
   phantom.exit();
 });*/
/* var page = require('webpage').create(),
  system = require('system'),
  fs=require('fs');

var arr=new Array(),filePath='configure.js';
if(fs.exists(filePath)&&fs.isFile(filePath)){
	var ins=fs.open(filePath,'r');
	while(!ins.atEnd()){
		arr.push(ins.readLine());
	}
}
console.log(arr[0].device);
phantom.exit();*/
