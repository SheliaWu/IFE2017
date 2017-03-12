
//bug:韩国变成了??,貌似返回不了数据，以后再修改吧
var page=require('webpage').create();
var system=require('system')
var keyword=system.args[1];
console.log('keyword:'+keyword);
var states={
	success:{
		code:1,
		msg:'抓取成功'
	},
	fail:{
		code:0,
		msg:'抓取失败'
	}
}
var output={},t,data;
t=Date.now();
page.open('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd='+keyword,function(status){
	if(status!=='success'){
		output['code']=states.fail.code;
		output['msg']=states.fail.msg;
		data=[];
		console.log('error');
	}else{
		output['code']=states.success.code;
		output['msg']=states.success.msg;
		//不知道为什么总是运行不了,已经放弃治疗了
		//page.includeJs('http://code.jquery.com/jquery-latest.js',function(){
		if(page.injectJs('jquery.min.js')){
			data=page.evaluate(function(){
			var contentBox=$('#content_left').find('.c-container');
			var datas=[],obj;
				for(var i=0;i<contentBox.length;i++){
					obj={};
					obj['title']=contentBox.eq(i)find('.t').find('a').text(); 
					obj['info']=contentBox.eq(i).text()；
					obj['link']=contentBoxe.eq(i).find('.t').find('a').attr('href');
					obj['pic']=contentBox.eq(i).find('img').eq(0).attr('src');
					datas.push(obj);
				}
				return datas;
			});
		//});
			console.log(data);
		}
	}

	output['word']=keyword;
	t=Date.now()-t;
	output['time']=t;
	output['dataList']=data;
	
	phantom.exit();
	
});
