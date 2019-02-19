/** * * Created by Andy on 2018/10/29,email:1046788379@qq.com。*/

class Compile {
    constructor(el, vm) {
        //el: new Vue传递的选择器
        this.el = typeof el === 'string' ? document.querySelector(el) : el
        // vm:new的vue实例
        this.vm = vm

        //    编译模板,把插值表达式用数据替换。
        if (this.el) { // 防止乱传一个选择器
            //1.把el中所有的子节点都放入到内存中，fragment
            let fragment = this.nodeToFragment(this.el)
            // 2.在内存中编译fragment
            this.compile(fragment)
            //3.把fragment一次性添加到页面
            this.el.appendChild(fragment)
        }
    }

    /*核心方法,把节点转换成文档碎片*/
    nodeToFragment(node) {
        let fragment = document.createDocumentFragment()
        //    把el中所有的节点挨个添加到文档碎片中

        let chidNodes = node.childNodes
        this.toArray(chidNodes).forEach(node => {
            // console.log(node);
            //把所有的子节点都添加到fragment中
            fragment.appendChild(node)
        })
        return fragment
    }
    /*工具方法*/
    toArray(likeArr) {
        return [].slice.call(likeArr)
    }
    /**
     * 编译文档碎片（内存中）
     * @param fragment
     */
    compile(fragment) {
        let childNodes = fragment.childNodes

        this.toArray(childNodes).forEach(node => {
            //    编译子节点

            //如果是元素，需要解析指令
            if (this.isElementNode(node)) {
                this.compileElement(node)
            }
            // 如果是文本节点，需要解析插值表达式
            if (this.isTextNode(node)) {
                this.compileText(node)
            }

            //    若果当前节点还有子节点，需要递归解析
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node)
                this.compileText(node)
            }
        })
    }


    //解析HTML标签
    compileElement(node) {
        // console.log('解析HTML标签');
        //1.获取当前节点下所有的属性
        let attributes = node.attributes
        this.toArray(attributes).forEach(attr => {
            //2.解析vue的指令(所有已v-开头的属性）
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                let type = attrName.slice(2)
                let attrValue = attr.value

                if (this.isEventDirective(type)) {
                    CompileUtil['eventHandler'](node, type, this.vm, attrValue)
                } else { // 非指令
                    CompileUtil[type] && CompileUtil[type](node, this.vm, attrValue)
                }
            }
        })
    }

    // 解析文本节点
    compileText(node) {

        CompileUtil.mustache(node,this.vm)

    }



    isElementNode(node) {
        // nodeType:节点类型1：元素节点，3：文本节点
        return node.nodeType === 1
    }

    isTextNode(node) {
        return node.nodeType === 3
    }

    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    isEventDirective(type) {
        return type.split(':')[0] === 'on'
    }

}

let CompileUtil = {
    mustache(node,vm) {
        // console.log('解析文本节点');
        let txt = node.textContent
        let reg = /\{\{(.+)\}\}/ //匹配换括号及里面的任意字符

        if (reg.test(txt)) {
            let expr = RegExp.$1 //组元
            node.textContent = txt.replace(reg,this.getVMvalue(vm,expr) )
        }
    },
    text(node, vm, attrValue) {
        node.textContent = this.getVMvalue(vm, attrValue)
    },
    html(node, vm, attrValue) {
        node.innerHTML = this.getVMvalue(vm, attrValue)
    },
    model(node, vm, attrValue) {
        node.value = this.getVMvalue(vm, attrValue)
    },
    eventHandler(node, type, vm, attrValue) {
        let eventType = type.split(':')[1]
        let fn = vm.$methods && vm.$methods[attrValue]
        //如果有事件跟事件函数
        if (eventType && fn) {
            vm.$methods[attrValue] && node.addEventListener(eventType, fn.bind(vm))
        }

    },
    // 这个方法用户获取VM里面的数据
    getVMvalue(vm, expr) {
        let data = vm.$data;
        debugger
        expr.split('.').forEach(key => {
            data = data[key]
        })
        return data;
    }
}