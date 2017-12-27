var count = 1
var container = document.getElementById('container')

function getUserAction(e){
    console.log(e)
    container.innerHTML = count++
    console.log(this)
    return "返回值成功return"
}

// 第零版  未进行防抖的版本
// container.onmousemove = getUserAction

//------------------------------------------------------------------------------------------------
//第一版  防抖

//鼠标移动,如果在wait时间内没有再次移动就会触发事件处理函数func
//鼠标不断移动,从不停止超过一个wait时间,会反复触发debounce,反复clearTimeout(),事件处理函数func一次都不触发
function debounce1(func,wait){
     var timeoutId
     return function(){
         clearTimeout(timeoutId)
         timeoutId = setTimeout(func,wait)
     }
}

// container.onmousemove = debounce1(getUserAction,1000)

//------------------------------------------------------------------------------------------------
//第二版  防抖

//改善要点: this指向 ：在事件处理函数中如果使用了this,那么把事件处理函数放在debounce中会导致this的指向发生改变

//在本例中,对于getUserAction函数,第0版控制台打印的是<div id="container"></div>,而第1版的防抖打印的则是window

function debounce2(func,wait){
    var timeoutId;
    return function(){
        clearTimeout(timeoutId)
        timeoutId = setTimeout(()=>{
            func.apply(this);
        },wait)
    }
}

// container.onmousemove = debounce2(getUserAction,1000)

//关于这里的this指向有点复杂，我现在做一些分析
// **箭头函数总是指向所在函数运行时的this**
// 我们的
// container.onmousemove = debounce2(getUserAction,1000)
// 这一句当中,如果写成对象字面量的形式,会类似
// var container = {
//     onmousemove:debounce2(getUserAction,1000)
// }
// 这个时候我们调用debouce2的结果实际上是返回一个匿名函数,debounce2执行完后等价于以下
// var container = {
//     onmousemove:function(){
//         clearTimeout(timeoutId)
//         timeoutId = setTimeout(()=>{
//             getUserAction.apply(this);
//         },1000)
//     }
// }
// 鼠标移动触发了onmousemove事件处理函数
// 在setTimeout时间到了之后,它会在与所在函数完全分离的执行环境(可视为全局作用域)调用
// ()=>{
//     getUserAction.apply(this);
// }()
// 而箭头函数本身没有this,所以他会像使用普通变量一样在scope chain 中寻找this,
// 此时在onmousemove中找到了this,因此this就是container

//------------------------------------------------------------------------------------------------//
//第三版  防抖

//改善要点: event对象 ：JavaScript在事件处理函数中会提供事件对象,默认是event,也可以作为函数的第一个参数传出来

//在本例中,我们如果使用第0版防抖,event会正确打印,但是如果使用了第2版防抖,event会打印undefined!

function debounce3(func,wait){
    var timeoutId;
    return function(){
        var args =arguments
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>{
            func.apply(this,args)
        },wait)
    }
}

// container.onmousemove = debounce3(getUserAction,1000)

//我略作分析,onmousemove事件处理函数被触发时，event这个对象被注入到了 return 闭包的那个匿名函数的arguments中去了
//我们可以通过将arguments保存到args中，让setTimeout的箭头函数在执行时去搜索scope chain 来找args，也就找到了arguments中的event对象

//------------------------------------------------------------------------------------------------//
//第四版  防抖

//改善要点1: 立即执行 ：我们目前的防抖函数虽然很好地起到了防抖的作用,但是却要在事件触发后，等待wait时间才第一次触发事件处理函数
//         我们希望他立即执行然后等到停止触发wait时间后，才可以重新触发执行
//改善要点2:  返回值，如果事件处理函数是有返回值的，那么我们在debounce里也要返回相应的结果，
//            在本例中，如果immediate设为false，那么由于func始终是在全局作用域中异步执行的，返回值将永远是undefiend
//            而true中，func同步执行，返回值会被赋值给result经由debounce返回
function debounce4(func,wait,immediate){
    var immediate = immediate!=undefined?immediate:true;

    var timeoutId,result;
    return function(){
        var args = arguments;
        if(timeoutId) clearTimeout(timeoutId);
        if(immediate){
            //immediate为true时的逻辑
            var callNow = !timeoutId;
            timeoutId = setTimeout(function(){
                //如果过了wait时间了，那么timeoutId就会被重设置为null
                //与此同时callNow又会重新变为true那么下面的func事件处理函数得以再次触发
                timeoutId=null;
            },wait)
            //如果没有上面这段代码的话，在immediate为true时，防抖会失效
            if(callNow) result = func.apply(this,args);
        }else{
            //immediate为false的话那处理逻辑第3版一样
            timeoutId = setTimeout(()=>{
                func.apply(this,args)
            },wait)
        }
        return result
    }
}

// container.onmousemove = debounce4(getUserAction,1000)
//--------------------------------------------------------------------------------------------------//
//第五版  防抖

//改善要点: 取消防抖
//我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦
function debounce5(func,wait,immediate){
    var immediate = immediate!=undefined?immediate:true;

    var timeoutId,result;

    var debounced = function(){
        var args = arguments;
        if(timeoutId) clearTimeout(timeoutId);
        if(immediate){
            //immediate为true时的逻辑
            var callNow = !timeoutId;
            timeoutId = setTimeout(function(){
                //如果过了wait时间了，那么timeoutId就会被重设置为null
                //与此同时callNow又会重新变为true那么下面的func事件处理函数得以再次触发
                timeoutId=null;
            },wait)
            //如果没有上面这段代码的话，在immediate为true时，防抖会失效
            if(callNow) result = func.apply(this,args);
        }else{
            //immediate为false的话那处理逻辑第3版一样
            timeoutId = setTimeout(()=>{
                func.apply(this,args)
            },wait)
        }
        return result
    }

    debounced.cancel = function(){
        //先清下计数器
        clearTimeout(timeoutId)
        //timeoutId为Null的话，callNow就为true就可以立即触发了
        timeoutId = null;
    }

    return debounced
}

var setUserAction = debounce5(getUserAction,10000)
container.onmousemove = setUserAction;

document.getElementById("cancel_btn").addEventListener('click',setUserAction.cancel);