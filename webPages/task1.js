//phantom.outputEncoding='gb2312';
//bug:韩国变成了??解决办法：encodeURI() 函数可把字符串作为 URI 进行编码
var page = require('webpage').create(),
  system = require('system');

var output = {
    code: 0, //返回状态码，1为成功，0为失败
    msg: '', //返回的信息
    word: '', //抓取的关键字
    time: 0, //任务的时间
    dataList:[   //抓取结果列表
      {
        title: 'xx',  //结果条目的标题
        info: '', //摘要
        link: '', //链接            
        pic: ''
      }
    ]
  },
  t = Date.now();
// 控制台
page.onConsoleMessage = function (msg) {
  console.log(msg);
};
if(system.args.length===1){
	console.log('请输入查询关键字！');
	phantom.exit();
}else{
	output.word=system.args[1];
	page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(system.args[1]), function (status) {
    output.msg = status;
    if (status !== 'success') {
      output.code = 0;
    } else {
      page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function () {
        output.dataList = page.evaluate(function (index) {
          var lists = [];
          $('#content_left .c-container').each(function () {
            var $this = $(this);
            lists.push({
              title: $this.find('h3 a').text(),
              //规范文本
              info: $this.find('div').eq(0).text().replace(/[\r\n\t\s]/g,'')|| '',
              link: $this.find('h3 a').attr('href'),
              pic: $this.find('.c-row .c-img').attr('src') || ''
            });
          });
          return lists;
        });
        output.time = Date.now() - t;
        console.log(JSON.stringify(output));
        phantom.exit();
      });
    }
  });	
}

