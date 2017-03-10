/*
思路：我们使深层次事件往上传播，就要确定更改了某个key，能触发它的父对象事件
首先：在task2的基础上，我们在触发事件前打印一下console.log(key)，发现这里的key是'firstname'，并不是我们想象中的'name'
这是我们在新建一个ReObserver()对象时，this.event会重新生成，它里面压根没有'name'事件，即使我们如果在app1上直接绑定'firstname'事件
也是不行的，因为触发事件的this并不是app1,而是新建的ReObserver对象

我们第一步要做的就是在最外层绑定的监听函数能传播给里层的对象，因此有如下代码:
let newReObserver=new ReObserver(value);
newReObserver.event=self.event

我们第二步是确定触发事件的key在监听的事件对象中，也就是确定触发key也就是触发它上一级，例：我们在测试中实际触发了firstname，
但是浏览器内部实际触发的是'name',即key应该取值为它的上一级
解决办法是:当我们在给一个属性赋值为对象时，将它的父对象保存下来，因此我在ReObserver对象中添加了一个祖先属性:ancestor用来存储它，
当我们触发firstname时，把它的祖先赋值给key,即self.ancestor=key
运行，我发现了一个bug，当我再次改变firstname的值时，依次输出你访问了name,你设置了name....正确的运行应该是你设置了firstname
检查发现原来是这一行代码：(self.ancestor){key=newValue}r,不应该赋值的，这是错误的做法，因为这会改变原有对象的属性，我们不应该影响原有的对象
优化后的方案为：
if(self.ancestor){
				self.event.emit(self.ancestor,newValue);
			}else{
				self.event.emit(key,newValue);		
			}	

第三步是深层次数据变化时同样也能监听到,即
app1.data.name.firstname={f:'L',m:'ee'}
app1.data.name.firstname.f='Lee';

运行一下，发现我的代码只能运行到第二层，查看代码发现了关键在于：我们要始终将触发的事件绑定为顶级父对象，在之前的代码:
self.ancestor=key 就会把firstname传给新创建的{f:'L',m:'ee'}对象，正确的ancestor应该是'name'，因此：

//始终保持将祖先绑定在第一层属性
				if(!self.ancestor){
					newReObserver.ancestor=key;
				}else{
					newReObserver.ancestor=self.ancestor;
				}

最后运行，正确！
应该还有更好地办法，因为我的这些改善是直接更改在ReObserver对象上的，我认为最标准的做法是从事件模型入手，但是想不出来


 */
console.log('=======task3=========')
function ReObserver(data){
	this.data=data;
	this.walk(data);
	this.event=new Event();
	this.ancestor=null;
}

let p=ReObserver.prototype;

p.walk=function(obj){
	let val;
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			val=obj[key];
			//如果还是一个对象，那么可以调用
			if(typeof val === 'object'){
				new ReObserver(val)
			}
			this.convert(key,val);
		}
	}
}

p.convert=function(key,value){
	let self=this; 
	Object.defineProperty(this.data,key,{
		enumerable:true,
		configurable:true,
		get:function(){
			console.log('你访问了'+key);
			return value
		},
		set:function(newValue){
			console.log('你设置了'+key);
			console.log('新的'+key+' = '+newValue);
			//设置了值就会触发事件
			if(newValue===value) return;
			value=newValue;
			if(typeof value === 'object'){
				let newReObserver=new ReObserver(value);
				newReObserver.event=self.event;
				/*始终保持将祖先绑定在第一层属性*/
				if(!self.ancestor){
					newReObserver.ancestor=key;
				}else{
					newReObserver.ancestor=self.ancestor;
				}
			}
			/*当写成if(self.ancestor){key=newValue}会出现bug，这样会把最后设置的属性改成包裹它的对象*/
			if(self.ancestor){
				self.event.emit(self.ancestor,newValue);
			}else{
				self.event.emit(key,newValue);		
			}	
		
		}
	})
};
	//绑定监听
p.$watch=function(key,callback){
	this.event.on(key,callback);
}

/*
是一个事件模型，并不是真正地自定义事件
 */
function Event(){
	this.events={};
}

Event.prototype.on=function(attr,callback){
		if(this.events[attr]){
			this.events[attr].push(callback);
		}else{
			this.events[attr]=[callback];
		}
	}
Event.prototype.off=function(attr){
		for(let key in this.events){
			if(this.events.hasClass(key)&&key===attr){
				delete this.events[key];
			}
		}
	}
Event.prototype.emit=function(attr,...arg){ 
			//console.log(this.events);
			this.events[attr]&&this.events[attr].forEach(function(item){
				item(...arg);
			})
	}


/*测试用例*/
let app1=new ReObserver({
	name:'youngwid',
	age:25
});
app1.$watch('age',function(newValue){
	console.log(`我的年纪变了，现在已经是:${newValue}岁了`)
});
app1.data.age=100;
app1.$watch('name',function(newValue){
	console.log(`我的姓名发生了变化，可能是姓氏变了，也可能是名字变了`)
});
app1.data.name={firstname:'li',lastName:'bai'};
app1.data.name.firstname='du';
/*出现了bug,错误的原因在于在50行,已修正*/
app1.data.name.firstname={f:'L',m:'ee'}
app1.data.name.firstname.f='Lee';



