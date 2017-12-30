var count = 1
var container = document.getElementById('container')

function getUserAction(e){
    console.log(e)
    container.innerHTML = count++
    console.log(this)
    return "返回值成功return"
}

// 第零版  未进行节流的版本
// container.onmousemove = getUserAction

//与debounce的区别就是，在debounce中如果你不断地触发事件的话，那处理函数一次也不会执行（debounce的作用是防抖）



//第一版   使用时间戳的节流版本

//思想:当触发事件时，我们取出当前的时间戳，然后减去之前的时间戳
//如果大于设置的时间周期，就执行函数，并且更改之前的时间戳，如果小于就不执行

//第一次触发完之后，时间被记录在previous，之后不断移动鼠标，now不断生成，在时间差小于wait时始终不触发，直到超过wait才触发
function throttle1(func,wait){
    var previous = 0
    return function(){
        var now = +new Date()//将date对象隐式转化为number类型再赋值给now
        if(now - previous >wait){
            func.apply(this,arguments)
            previous = now
        }
    }
}


// container.onmousemove = throttle1(getUserAction,1000)



//第二版，使用定时器的节流版本

//思想:第一次触发后，timeoutId立马被设置，直到wait时间后回调函数触发后timeoutId被置为null,此时你才能接着添加下个定时器
function throttle2(func,wait){
    var timeoutId

    return function(){
        var args = arguments
        if(!timeoutId){
            timeoutId = setTimeout(()=>{
                timeoutId = null;
                func.apply(this,args)
            },wait)
        }
    }
}

// container.onmousemove = throttle2(getUserAction,1000)


//第三版   综合二与三

//目标：鼠标移入时立刻执行。鼠标移出时还能再执行一次



//过程


function throttle3(func,wait){
    var timeoutId,args,context
    var previous = 0 

    var later = function(){
        previous = +new Date()
        timeoutId = null
        func.apply(context,args)
    };

    //这是将要返回的事件处理函数
    var throttled = function(){
        //先存储事件触发的时间戳
        var now = +new Date()
        //下次触发func剩余的时间，第一次触发时previous是0，所以remaining肯定是负的
        var remaining = wait - (now - previous);
        //先用context把事件处理函数绑定的div存下来
        context = this
        args = arguments
        //时间到了，可以触发下一次事件了
        if(remaining <=0 || remaining>wait){
            //第一次timeoutId肯定不存在,跳过
            if(timeoutId){
                clearTimeout(timeoutId)
                timeoutId=null
            }
            //直接执行
            previous = now
            func.apply(context,args)
        }else if(!timeoutId){
            //时间还没到，并且timeoutId不存在
            timeoutId = setTimeout(later,remaining)
            //设置一个新的定时器
        }
    };
    return throttled
}

// container.onmousemove = throttle3(getUserAction,1000)



//第四版  
//目的  对第三版进行完善为用户提供选择

//测试正常
function throttle4(func,wait,options){
    var timeoutId,args,context
    var previous = 0 
    if(!options) options = {}

    var later = function(){
        previous = options.leading === false?0:new Date().getTime()
        timeoutId = null
        func.apply(context,args)
        if(!timeoutId) context = args = null
    };

    //这是将要返回的事件处理函数
    var throttled = function(){
        //先存储事件触发的时间戳
        var now = new Date().getTime()
        if(!previous&&options.leading === false) previous = now
        //下次触发func剩余的时间，第一次触发时previous是0，所以remaining肯定是负的
        var remaining = wait - (now - previous);
        //先用context把事件处理函数绑定的div存下来
        context = this
        args = arguments
        //时间到了，可以触发下一次事件了
        if(remaining <=0 || remaining>wait){
            //第一次timeoutId肯定不存在,跳过
            if(timeoutId){
                clearTimeout(timeoutId)
                timeoutId=null
            }
            //直接执行
            previous = now
            func.apply(context,args)
            if(!timeoutId) context = args =null
        }else if(!timeoutId && options.trailing !==false){
            //时间还没到，并且timeoutId不存在
            timeoutId = setTimeout(later,remaining)
            //设置一个新的定时器
        }
    };
    return throttled
}

//leading:false 禁用第一次执行
//trailing:false 禁用停止触发的回调

container.onmousemove = throttle4(getUserAction,3000,{trailing:false})