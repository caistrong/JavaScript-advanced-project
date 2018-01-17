//数组去重的话就是去掉数组中重复的项
var array1 = [2,3,5,4,5,2,2]
//expect [2,3,5,4]
var array2 = [1,1,2,4,5,5,'5','5','5']
//expect [1,'1']

//原始双层循环

function unique1(array){
    var res = []
    for(var i=0, arrayLen = array.length;i<arrayLen;i++){
        //array的每一项都遍历下res数组看看是不是已经存在了
        for(var j=0,resLen = res.length ; j<resLen; j++){
            if(array[i]===res[j]){
                break
            }
        }
        //如果j是最后一项了那就说明array当前遍历的，这一项res里没有
        if(j===resLen){
            res.push(array[i])
        }
    }
    return res
}

console.log("nested for loop:")
console.log(unique1(array1))
console.log(unique1(array2))

//indexOf

function unique2(array){
    var res = []
    for(var i = 0, len = array.length; i<len; i++){
        var current = array[i]
        if(res.indexOf(current) === -1){
            res.push(current)
        }
    }
    return res
}
console.log("indexOf(): ")
console.log(unique2(array1))
console.log(unique2(array2))

//排序后去重

function unique3(array){
    var res=[]
    var sortedArray = array.concat().sort()
    //这里的concat()是很hack的方式，目的是复制一个数组，不在原数组上做排序
    var seen 
    for(let i = 0, len = sortedArray.length; i<len; i++){
        //!i 如果是第一个元素的话直接加入并且在后面把seen改成第一个元素
        //seen !== sortedArray[i] 相邻的元素不相同
        if(!i || seen !== sortedArray[i]){
            res.push(sortedArray[i])
        }
        seen = sortedArray[i]
    }
    return res
}

console.log("sort(): ")
console.log(unique3(array1))
console.log(unique3(array2))


//unique Api
//isSorted传入是否已经排好序
function unique4(array,isSorted){
    var res = []
    var seen
    for(let i = 0, len = array.length; i<len; i++){
        if(isSorted){
            if(!i || seen!== array[i]){
                res.push(array[i])
                seen = array[i]
            }
        }else{
            if(res.indexOf(array[i])===-1){
                res.push(array[i])
            }
        }
    }
    return res
}

console.log("uniqueAPI v1 : ")
console.log(unique4(array1))
console.log(unique4(array2,true))

//es5 filter方法

//filter 的 callback 里面 return true 表示在filter的返回数组里保留该项 return false表示去掉该项

function unique5(array,isSorted){
    // 排好序了的话
    if(isSorted){
        return array.concat().sort().filter(function(item, index, array){
            return !index || item !== array[index - 1]
        })
    }
    var res = array.filter(function(item,index,array){
        return array.indexOf(item) === index
        //因为indexOf显示的是第一次出现时的位置
    })
    return res
}

console.log('filter :')
console.log(unique5(array1))
console.log(unique5(array2,true))




//在ES6引入了set数据结构的情况下
//可以使用
console.log('ES6:')
console.log([...new Set(array1)])
console.log([...new Set(array2)])