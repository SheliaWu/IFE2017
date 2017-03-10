console.log('==========task4===========');

function Vue(options){
	this.element=options.el;
	this.data=options.data;
	this.walk(this.data);
}

Vue.prototype={

	walk:function(obj){
		let value;
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				value=obj[key];
				if(typeof value === 'object'){
					let newVue=new Vue(value);
					newVue.data=value;
				 }
				this.convert(key,value)
			}
		}
	},

	convert:function(key,value){
		let self=this;
		Object.defineProperty(this.data,key,{
			enumerable:true,
			configurable:true,
			get:function(){
				return value;
			},
			set:function(newValue){
				if(newValue===value) return;
				value=newValue;
			}
		})
	}
}

let app = new Vue({
  el:'#app',
  data: {
    user: {
      name: 'youngwind',
      age: 25
    }
  }
});

let ele=document.getElementById(app.element.slice(1,app.element.length));
let list=ele.children;
//console.log(list[0]);
for(let i=0;i<list.length;i++){
	let text=list[i].innerHTML;
	//console.log(text)
	let reg=/{{\w+.?\w*}}/g;
	if(reg.test(text)){
		let arr=text.match(reg);
		//每个子标签的插值数
		for(let j=0;j<arr.length;j++){
			//console.log(arr[j])
			let value=app.data;
			let keys=arr[j].slice(2,-2).split('.')
			for(let k=0;k<keys.length;k++){
				 value=value[keys[k]];
			}
			//console.log(value);
			//一次只替换一个，所以去掉全局匹配
			text=text.replace(/{{\w+.?\w*}}/,value);
		}
		list[i].innerHTML=text;
	}
}
