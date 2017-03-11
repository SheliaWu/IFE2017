console.log('============task5=========')
/**
 * 使用的方法太简单粗暴了，如果nodeValue的文本中有何旧值相同的也会被改变
 * 优化的方法：我在想应该在findAllNode的时候为每个有表达式的值新建一个DOM节点并存储起来
 * 修改值时，首先看存储的DOM节点中是否有这个key(绝对路径)，有则取出相应的DOM修改nodeValue
 */
function Vue(options){
	this.data=options.data;
	this.makeObserver(this.data);
	this.dom=document.querySelector(options.el)
	this.events=new Event();
	this.findAllNode(this.dom);
	this.directives={}

}

Vue.prototype={

	makeObserver:function(obj,paths){
		let val;
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				val=obj[key];
				//key的父路径，便于查找到属性
				let  path='';
				if(!paths){
					path=key;
				}else{
					path=paths+'.'+key
				}

				if(typeof val ==='object'){
					this.makeObserver(val,path);
				}
				//对每一个路径新建一个dom节点数组
				this.convert(obj,key,val,path);
			}
		}
	},

	convert:function(obj,key,value,paths){
		let self=this;
		Object.defineProperty(obj,key,{
			enumerable:true,
			configurable:true,
			get:function(){
				console.log('你访问了'+key);
				return value;
			},
			set:function(newValue){
				if(newValue===value) return;
							 //值被改变触发DOM渲染,不行，因为表达式已经被变量值给代替，渲染不了
				self.render(self.dom,value,newValue);
				value=newValue;
				//深层次动态数据绑定
				 if(typeof newValue === 'object'){
				 	self.makeObserver(newValue,paths);
				 }
				 console.log(`你设置了${key}，新的值为${newValue}`);
				 //触发$watch订阅
				 if(self.paths){
					self.events.emit(self.paths.split('.')[0],newValue);
				}else{
					self.events.emit(key,newValue);		
				}
			}
		})
	},

	findAllNode:function(node){
		console.time('nodeRender');
		for(let i=0;i<node.childNodes.length;i++){
			let item=node.childNodes[i];
			if(item.childNodes.length){
				this.findAllNode(item);
			}else{
				console.log(item.nodeValue)
				this.compile(item);
			}
		}
	},

	compile:function(node){
		let reg=/{{(.*?)}}/g;
		if(reg.test(node.nodeValue)){
			let arr=node.nodeValue.match(reg);
			arr.forEach((item,index) => {
				let viewData=item.replace(/(\{)|(\})/g,"");
				let val=this.$getValue(viewData);
				//let textNode=document.createTextNode(val);
				node.nodeValue=node.nodeValue.replace(item,val);
				//this.directives[viewData].push(textNode)
			})
		}
	},
	$getValue:function(path){
       path=path.split('.');
       let val=this.data;
       path.forEach(key => {
       		val=val[key];
       })
       return val;
	},

	$watch:function(key,callback){
		this.events.on(key,callback);
	},
	render:function(node,oldVal,newVal){
		for(let i=0;i<node.childNodes.length;i++){
			let item=node.childNodes[i];
			if(item.childNodes.length){
				this.render(item,oldVal,newVal);
			}else{
				item.nodeValue=item.nodeValue.replace(oldVal,newVal);
			}
		}
	}
	
}

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



