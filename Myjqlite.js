function $(selector){	
	return new Base(selector);
}
//静态方法封装ajax
$.ajax = function(json){
	//创建xhr对象
	function createXHR(){
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();//支持ie7+，非ie
		}
		return new ActiveXObject("Microsoft.XMLHTTP");//支持ie6
	}
	function formatJson(data){
		var str='';
		for(var attr in data){
			
			str+=attr+'='+data[attr]+'&'
			
		}	
		return str.slice(0,-1);		
	}
	
	
	var type=json.type?json.type:'get';
	
	var async=json.async?json.async:true;
	
	var data=formatJson(json.data);  /*把对象转换成  url数据*/
	
	if(!json.url){		
		json.error('传入参数错误，必须传入url')
		return false;		
	}
	//1.创建XMLHttpRequest
	var xhr= createXHR();	
	
	
	if(type.toLowerCase()=='get'){		
		if(json.url.indexOf('?')!=-1){
			var api=json.url+'&'+data;
			
		}else{
			var api=json.url+'?'+data;
		}				
		xhr.open(type,api,async);
		xhr.send(); 
		
	}else{  /*post*/		
		
				
		xhr.open(type,json.url,async);
		
		//设置请求头		
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		
		xhr.send(data);   // name=张三&age=20
				
	}
	
	if(async){ /*异步*/
		
		xhr.onreadystatechange=function(){
			
			if(xhr.readyState==4&&xhr.status==200){
				
				var result=JSON.parse(xhr.responseText);
			
				json.success(result);
				
			}
			
		}		
		
	}else{ //同步		
		
		if(xhr.status==200){
			
			//调用成功的回调函数
			
			var result=JSON.parse(xhr.responseText);
			
			json.success(result);
			
		}
		
		
	}
}

$.get=function(api,success,err){
		$.ajax({						
			type:'get',			
			url:api,		
			success:function(data){
				success(data)
			},
			error:function(errdata){				
				err(errdata);
			}
		})
	
	
}
/*
jqLite的实例
 */
function Base(selector){	
	//获取所有的dom节点
	
	this.elements=[];	
	
	if(typeof(selector)=='object'){
		this.elements[0]=selector;      //this.elements[0]=this
	}else{ 		
		this.query(selector); //this.query(this)
	}
	
	
}

//封装方法获取 elements
Base.prototype.query=function(selector){
	
	this.elements=document.querySelectorAll(selector);	
}

/*获取dom节点的方法*/

Base.prototype.get=function(index){	
	return this.elements[index]; 
	
}

//封装一个find方法，找到当前节点下面的子节点

//$('.list').find('li')

Base.prototype.find=function(el){
	var allChildElements=[];	/*放所有找到的子元素*/
	
	for(var i=0;i<this.elements.length;i++){		
		var childElements=this.elements[i].querySelectorAll(el);	  /*获取每个满足条件dom下面的子节点*/	
		for(var j=0;j<childElements.length;j++){
			allChildElements.push(childElements[j]);			
		}
	}
		
	this.elements=allChildElements;  /*改变dom节点的指向*/
	
	return this;
	
	/*
	 list
	 
	 	li
	 	li
	 	
	 list
	 	li
	 	li
	 	
	 list 
	 
	 	li
	 * */
			
}



/*
 获取和设置css
 */
Base.prototype.css=function(attr,value){	 /*改变当前dom节点的css*/
	
	if(typeof(attr)=='object'){/*设置*/				
		
			for(var i=0;i<this.elements.length;i++){
				for(key in attr){
					this.elements[i].style[key]=attr[key];	
				}	
			}
	}else{
	
		if(arguments.length==1){
			//获取css
			return getMyComputedStyle(this.elements[0],attr);
			
		}else{ /*设置css*/
			
			for(var i=0;i<this.elements.length;i++){				
				this.elements[i].style[attr]=value;			
			}
		}
	}	
	//返回当前实例，可以让我们连缀操作
	return this;
}


//设置和获取innerHTML的方法

Base.prototype.html=function(value){
	
	if(arguments.length==0){
				
		return this.elements[0].innerHTML;
			
	}else{
		
		for(var i=0;i<this.elements.length;i++){				
			this.elements[i].innerHTML=value;
		}
	}
	
}
//封装点击的事件


Base.prototype.click=function(cb){		
	for(var i=0;i<this.elements.length;i++){				
		this.elements[i].onclick=cb;
	}
}


//封装一个hover的方法



Base.prototype.hover=function(cb1,cb2){		
	for(var i=0;i<this.elements.length;i++){		
		
		this.elements[i].onmouseover=cb1;		
		this.elements[i].onmouseleave=cb2;
		
	}
}


//first  获取满足条件的第一个节点

Base.prototype.first=function(){	
//	改变elements的时候一定要保证this.elements 是个数组		
	var firstElements=[];	
	firstElements.push(this.elements[0]);	
	this.elements=firstElements;	
	return this;
}
//last  获取满足条件的最后一个节点
Base.prototype.last=function(){
		
//	改变elements的时候一定要保证this.elements 是个数组		
	var lastElements=[];	
	lastElements.push(this.elements[this.elements.length-1]);	
	this.elements=lastElements;
	return this;
}
//eq   获取满足条件索引值的节点 
Base.prototype.eq=function(index){
	var eqElements=[];		
	eqElements.push(this.elements[index]);   /*获取满足索引值的dom节点*/	
	this.elements=eqElements;
	return this;
}


//显示
Base.prototype.show=function(){		
	for(var i=0;i<this.elements.length;i++){		
		this.elements[i].style.display='block';
		
	}
	return this;
}
//隐藏
Base.prototype.hide=function(){		
	for(var i=0;i<this.elements.length;i++){		
		this.elements[i].style.display='none';
		
	}
	return this;
}



//index
/*
 	$('.cate li')  返回所有的li节点    11111   2222   3333
 
 	alert($(this).index())
 * */

Base.prototype.index=function(){
	
	//获取父节点下面的所有子节点
	
	//调用$(this) 表示把当前的dom节点给this.elements[0]  	
	var childElements=this.elements[0].parentNode.children;
	
	for(var i=0;i<childElements.length;i++){
		
		if(this.elements[0]==childElements[i]){			
			return i;
		}		
	}
	
	return -1;
	
	
}





//
//获取设置 滚动条距离顶部的高度     document      box

/*
 $(document).scrollTop()
 
 $('#box').scrollTop()

*/

Base.prototype.scrollTop=function(position){
	
	if(this.elements[0]==document){   /*获取和设置document的scrolltop*/	
		if(arguments.length==1){ /*设置*/			
			document.documentElement.scrollTop=position;			
			document.body.scrollTop=position;
		}else{ //获取			
			return document.documentElement.scrollTop || document.body.scrollTop;
		}
	}else{		  /*获取和设置当前dom节点的scrollTop*/
		
		if(arguments.length==1){ /*设置*/			
			this.elements[0].scrollTop=position;	
		}else{ //获取			
			return this.elements[0].scrollTop;
			
		}
	}
}
//封装滚动条滚动事件

//$('#box')

//$(window)

//$('.box')
Base.prototype.scroll=function(cb){	
	for(var i=0;i<this.elements.length;i++){		
		this.elements[i].onscroll=cb;		
	}
}
//判断有没有一个class
Base.prototype.hasClass=function(attr1,attr2){
	/*如果传入2个参数	 第一个参数是DOM节点	  第二个参数 className
	 * 
	 *   如果出入1个参数  element就是当前的className
	 */
	if(arguments.length==1){
		var className = attr1;
		var reg = new RegExp("(\\s+|^)"+className+"(\\s+|$)");
		return reg.test(this.elements[0].className);
		
	}
	else if(arguments.length==2){
		var elements = attr1;
		var className = attr2;
		var reg = new RegExp("(\\s+|^)"+className+"(\\s+|$)");
		return reg.test(elements.className);
	}
}

//添加Class
Base.prototype.addClass=function(className){
	//判断是否存在
	for(var i=0;i<this.elements.length;i++){
		if(!this.hasClass(this.elements[i],className)){
			this.elements[i].className = this.elements[i].className+" "+className;
			
		}
	}
}

//移除Class
Base.prototype.removeClass = function(className){
	//判断是否存在
	for(var i = 0;i<this.elements.length;i++){
		if(this.hasClass(this.elements[i],className)){
			var reg = new RegExp("(\\s+|^)"+className+"(\\s+|$)");
			//替换存在的className,重新赋值
			this.elements[i].className = this.elements[i].className.replace(reg," ");
			
		}
	}
}

//封装一个任意元素居中
Base.prototype.center=function(){
	
	this.css({		
		"position":"absolute",
		"top":'50%',
		"left":"50%",
		"transform":"translate(-50%,-50%)",
		'zIndex':1000
	})
	
	return this;
}

//遮罩层
Base.prototype.showMask = function(){
	var oDiv = document.createElement("div");
	
	oDiv.setAttribute("id","mask");
	oDiv.style.position = "absolute";
	
	oDiv.style.top = "0";
	oDiv.style.left = "0";
	oDiv.style.width = "100%";
	oDiv.style.height = "100%";
	oDiv.style.zIndex = 100;
	oDiv.style.background = "rgba(0,0,0,0.5)";
	document.body.appendChild(oDiv);
	document.body.style.overflow = "hidden";
	
}
Base.prototype.hideMask  = function(){
	var oDiv =document.getElementById("mask");
	document.body.removeChild(oDiv);
	document.body.style.overflowY = "auto";
}
//封装一个兄弟节点
Base.prototype.siblings=function(element){
	var siblingsElements = [];
	if(arguments.length==1){//if为了判断传入一个参数还是不传
		var childElements = this.elements[0].parentNode.querySelectorAll(element);
	}
	else{
		var childElements = this.elements[0].parentNode.children;
	}
	
	for(var j=0;j<childElements.length;j++){
		if(this.elements[0]!=childElements[j]){
			siblingsElements.push(childElements[j]);
		}
	}
	this.elements = siblingsElements;
	return this;
	
}

function preDefault(e){
		if(e.preDefault){
			e.preDefault();
		}
		else{
			e.returnValue =false;
		}
	}
	function stopPropagation(e){
		if(e.stopPropagation){
			e.stopPropagation();
		}
		else{
			e.cancelBubble=true;
		}
	}
//拖拽
Base.prototype.drag = function(el){
	if(arguments.length==1){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].querySelector(el).onmousedown=function(e){
				var _that=this;   /*.header*/
				var e=e||event;			
				var offsetX=e.offsetX;
				var offsetY=e.offsetY;		
				
				document.onmousemove=function(e){
					preDefault(e);  /*阻止默认行为*/			
					stopPropagation(e);  /*阻止冒泡*/			
					var e=e||event;								
					var clientX=e.clientX;				
					var clientY=e.clientY;				
					var left=clientX-offsetX;				
					var top=clientY-offsetY;				
					_that.parentNode.style.left=left+'px';				
					_that.parentNode.style.top=top+'px';
					_that.parentNode.style.margin="0px";				
					_that.parentNode.style.padding="0px"				
					_that.parentNode.style.transform="translate(0,0)";
					
				}
				
				document.onmouseup=function(e){
					
					document.onmousemove=null;				
					document.onmouseup=null;
				}
			}
		}
	}
	else{
		for(var i=0;i<this.elements.length;i++){					
			this.elements[i].onmousedown=function(e){			
				var _that=this;   /*this.elements[i]*/
				var e=e||event;			
				var offsetX=e.offsetX;
				var offsetY=e.offsetY;		
				
				document.onmousemove=function(e){
					preDefault(e);  /*阻止默认行为*/			
					stopPropagation(e);  /*阻止冒泡*/			
					var e=e||event;								
					var clientX=e.clientX;				
					var clientY=e.clientY;				
					var left=clientX-offsetX;				
					var top=clientY-offsetY;				
					_that.style.left=left+'px';				
					_that.style.top=top+'px';
					_that.style.margin="0px";				
					_that.style.padding="0px"				
					_that.style.transform="translate(0,0)";
					
				}
				
				document.onmouseup=function(e){
					
					document.onmousemove=null;				
					document.onmouseup=null;
				}
				
			}
			
		}
	}
}
//缓冲运动
Base.prototype.animate = function(json,time,fn){
	time = time || 30;
	var _that = this;
	for(var i=0;i<this.elements.length;i++){
		clearInterval(_that.elements[i].timer);
		(function(i){
			_that.elements[i].timer = setInterval(function(){
				var bStop = true;//外面定义一个开关，表示全部到达目标值
				
				//遍历json对象中的每个css样式的属性键值对
				for(var attr in json){
					var iTarget = json[attr];
					//1,current  查找当前值
					var current;
					if(attr == "opacity"){//透明度
						current = Math.round(getComputedStyle(_that.elements[i],attr)*100);
					}
					else { //left,top,width,height
						current = parseFloat(getMyComputedStyle(_that.elements[i], attr)); 
						current = Math.round(current);
					}
					
					//2, speed
					var speed = (iTarget-current) / 8;
					speed = speed>0 ? Math.ceil(speed) : Math.floor(speed); 
					
					//3, 判断临界值
					if (current != iTarget){
						bStop = false; //说明有至少一个样式属性没有到达目标值
					}
					
					//4, 运动
					if (attr == "opacity") {
						_that.elements[i].style[attr] = (current + speed) / 100;
						_that.elements[i].style.filter = "alpha(opacity="+ (current+speed) +")";
					}
					else {
						_that.elements[i].style[attr] = current + speed + "px";
					}
				}
				
				if (bStop) {
					clearInterval(obj.timer); //停止运动了
										
					//回调
					if (fn) {
						fn();
					}			
				}	
			},30);
		})(i)
	}
	return this;
}

//获取和设置属性


Base.prototype.attr=function(attr,value){
	
	if(arguments.length==1){
		
		return this.elements[0].getAttribute(attr);
		
	}else{
		
		for(var i=0;i<this.elements.length;i++){
		
			this.elements[i].setAttribute(attr,value)
			
		}
		
	}
}

//获取表单的value
Base.prototype.value = function(value){
	if(arguments.length==1){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].value = value;
		}
	}
	else{
		return this.elements[0].value;
	}
}
