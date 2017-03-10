console.log('==========task2===========');

function Observer(data){
	this.data=data;
	this.walk(data);
	this.event=new Event();
	//console.log(this);
}

let p=Observer.prototype;

p.walk=function(obj){
	let val;
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			val=obj[key];
			//如果还是一个对象，那么可以调用
			if(typeof val === 'object'){
				new Observer(val);
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
				new Observer(value);
			}
			self.event.emit(key,newValue);
			
		
		}
	})
};
	//绑定监听
p.$watch=function(key,callback){
	this.event.on(key,callback);
}
let data={
	user:{
		name:'shelia',
		age:'18'
	},
	address:{
		city:'beijing'
	}
};

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
			this.events[attr]&&this.events[attr].forEach(function(item){
				item(...arg)
			})
	}


/*测试用例*/
let app1=new Observer({
	name:'youngwid',
	age:25
});
app1.$watch('age',function(newValue){
	console.log(`我的年纪变了，现在已经是:${newValue}岁了`)
});
app1.data.age=100;
app1.$watch('name',function(newValue){
	console.log(`我的名字变了，现在已经是:${newValue}了`)
});
app1.data.name={firstname:'li',lastName:'bai'};

app1.data.name;
app1.data.name.firstname;

app1.data.name='dupu'