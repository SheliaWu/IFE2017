//bug:evaluate只能选择标签不能选择选择器,why!!
var page = require('webpage').create(),
  system = require('system'),
  devices = require("./configure.json");
var output = {
    device:'',
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
if(system.args.length<3){
	console.log('请依次输入查询关键词，设备参数！');
	phantom.exit();
}else{

	output.word=system.args[1];
  var device=system.args[2],userAgent,width,height;
  output.device=device;
  userAgent=devices[device].ua;
  width=devices[device].width;
  height=devices[device].height;

  page.viewportSize = {width: width,height: height};
  page.settings.userAgent=userAgent;

	page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(system.args[1]), function (status) {
    output.msg = status;
    if (status !== 'success') {
      output.code = 0;
    } else {
      page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function () {
        output.dataList = page.evaluate(function () {
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
          //return $('body').text();
          //return document.querySelector('#content_left').innerText;
          //return document.querySelector('body').innerText
        });
        output.time = Date.now() - t;
        page.render("task2.jpeg", {format: 'jpeg', quality: '100'})
        console.log(JSON.stringify(output));
        phantom.exit();
      });
    }
  });	
}

