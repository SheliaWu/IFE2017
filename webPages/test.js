var page=require('webpage').create();
page.open('http://m.bing.com', function(status){
	if(page.injectJs('jquery.min.js')){
	var title=page.evaluate(function(){
      return $('title').text();
    });
   console.log(title);
}
   phantom.exit();
 });