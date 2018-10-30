/** * * Created by Andy on 2018/10/29,email:1046788379@qq.com。*/
//定义一个类，创建vue是咧
class Vue {
    //给vue实例添加属性
constructor(options={}) {
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods

    // 如果指定了el参数，对el进行解析
    if(this.$el){
        // compile负责解析模板的内容
        //需要：模板跟数据
        let c=  new Compile(this.$el,this)

    }
}
}