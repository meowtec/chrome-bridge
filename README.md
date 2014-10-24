pagevars
========

在chrome extension中，content scripts被注入到文档中运行，但是由于它运行在一个特殊的环境中，可以访问DOM，但是无法访问页面中定义的变量。而页面中往往定义了好多有用的接口，我们在扩展中直接调用这些接口是最常见的需求了，不能直接访问实在恼人。
这是一个用于content scripts的工具，使用这个工具可以方便你在content scripts中访问和调用页面变量。

### 使用方法
1. 在manifest中加载pagevars.js
2. 在需要调用页面变量（方法）的地方使用pageScriptExec方法。

#### 最简单的例子

> 这个例子的作用是在content scripts中访问页面定义的变量var1。`page inline script`这段代码被插入到页面中执行，因此可以访问页面定义的变量。

```javascript
pageScriptExec(function() {
  // var1是页面变量
  /* page inline script start */
  postDataBack(window.var1, 'reciever1')
  /* page inline script end*/
}, {
  'reciever1': function(str) {
    console.log(str)
  }
})
```

#### 复杂例子

> 页面中引用了jQuery，我们希望在扩展中使用它封装的ajax方法，又不想在扩展中重复引用。于是可以使用这种方式来访问。

```javascript
pageScriptExec(function() {
  /* page inline script start */
  jQuery.ajax({
    type: "POST",
    url: 'someurl',
    success: function(str){
      postDataBack(str, 'success')
    },
    error: function(xhr){
      postDataBack(xhr.status, 'error')
    },
    dataType: 'text'
  });
  /* page inline script end */
}, {
    'success': function(str) {
      console.log('success get html:' + str)
    },
    'error': function(str) {
      console.log('get html error, status is:' + str)
    }
})
```

#### 最简单的例子
如果只有一个回调函数，就有点臃肿了。
```javascript
pageScriptExec(function() {
  postDataBack('x', 'y')
}, function(str, str2) {
    console.log(str, str2)
  }
)
```

#### 使用 content scripts 中的变量

> page inline script部分的代码执行于页面环境，可以访问页面环境中的变量，但是不能访问content scripts中的变量。**如下的代码是有问题的**:

```javascript
var str1 = 'some'
pageScriptExec(function() {
  /* page inline script start */
  var str = str1 + 'aaa' // 错误！str1是访问不到的！
  postDataBack(str)
  /* page inline script end */
}, function(str) {
    console.log(str)
  }
)
```
如果page inline script要访问str1，可以传入第三个参数
第三个参数是一个对象，key值对应你要访问的变量名
你也可以传入节点，该节点必须在DOM树中

```javascript
var str1 = 'some string'
pageScriptExec(function() {
  /* page inline script start */
  var str = strrrrr + 'aaa'
  postDataBack(str)
  /* 假如页面中存在一个addClass方法，你就可以调用它来为你传入的DOM节点添加Class */
  addClass(body, 'body-class')
  /* page inline script end */
}, function(str) {
    console.log(str)
  }, {
    'strrrrr': str1,
    'body': document.body
  }
)
```

### NOTICE
 - 由于设计原理限制，postDataBack只能接受字符串作为参数，如果需要传递有结构的数据，请先JSON.stringify为JSON字符串。

### 结尾
祝大家用的愉快。
