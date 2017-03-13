//bug:evaluate只能选择标签不能选择选择器,why!!
var page = require('webpage').create(),
  system = require('system');
var devices = [
{device:'iPhone5',width:320,height:568,ua:"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"},
{device:'iPhone6',width:375,height:667,ua:"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"},
{device:'iPad',width:768,height:1024,ua:"Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"}
]
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
  for(i=0;i<devices.length;i++){
    if(devices[i].device===device){
      userAgent=devices[i].ua;
      width=devices[i].width;
      height=devices[i].height;
      break;
    }
  }
  page.viewportSize = {width: width,height: height};
  page.clipRect={top:0,left:0,width:width,height:height};
  page.settings={javascriptEnabled:true,loadImages: true,userAgent:userAgent};
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
          return dataList;
        });
        output.time = Date.now() - t;
        console.log(JSON.stringify(output));
        phantom.exit();
      });
    }
  });	
}

