function Observer(data){
	this.data=data;
	this.walk(data);
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
			if(newValue===value) return;
			value=newValue
		}
	})
};
let data={
	user:{
		name:'shelia',
		age:'18'
	},
	address:{
		city:'beijing'
	}
};

let app=new Observer(data);
//app.data.user;
app.data.address;
//app.data.user.name;
app.data.address.city;//依次输出address,city
app.data.address={province:'Hainan',city:'haikou'}
app.data.address.province;//没有显示province

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science