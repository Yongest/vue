
// Observer 用于给data中所有的数据添加getter ,setter 方法
// 方便我们在获取，或者设置data中的数据的时候，实现我们的逻辑。
class Observer {
    constructor(data){
        this.data = data
        this.walk(this.data)
    }

    // 遍历data中所有的数据，都添加上getter,setter方法。
    walk(data){
        if(!data || typeof data !=='object'){
            return 
        }
        Object.keys(data).forEach(key=>{
            // 给data中的key值设置getter,setter
            this.defineReactive(data,key,data[key])
// 如果key是一个复杂的数据类型。需要递归一下。
            this.walk(data[key])
        })
    }
    defineReactive(obj,key,value){
        let that = this;
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                return value
            },
            set(newValue){
                if(value!==newValue){
                    value = newValue

                    // 如果newValue也是一个对象的话，也需要对其进行数据劫持
                    that.walk(newValue)
                }
            }

        })
    }
}