pagevars
========

在chrome extension中，content scripts被注入到文档中运行，但是由于它运行在一个特殊的环境中，可以访问DOM，但是无法访问页面中定义的变量。而页面中往往定义了好多有用的接口，我们在扩展中直接调用这些接口是最常见的需求了，不能直接访问实在恼人。
这是一个用于content scripts的工具，使用这个工具可以方便你在content scripts中访问和调用页面变量。

### 使用方法
1. 在manifest中加载pagevars.js
2. 在需要调用页面变量（方法）的地方使用 exec 方法。

```
// exec
var execall = exec(function(arg1, arg2, arg3){
  console.log(arg3)
  callbackData(arg1 + 1, arg2 + 1, 'success', document.body)
}, 0, 1, document.getElementById('ee'))

// listen
execall(function(a1, a2, a3, result, element){
  console.log(a1, a2, a3, result, element)
})

```

