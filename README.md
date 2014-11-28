pagevars
========

在chrome extension中，content scripts被注入到文档中运行，但是由于它运行在一个特殊的环境中，可以访问DOM，但是无法访问页面中定义的变量。而页面中往往定义了好多有用的接口，我们在扩展中直接调用这些接口是最常见的需求了，不能直接访问实在恼人。
这是一个用于content scripts的工具，使用这个工具可以方便你在content scripts中访问和调用页面变量。

### 使用方法
1. 在manifest中加载pagevars.js
2. 在需要调用页面变量（方法）的地方使用 exec 方法。


实例：
假设 content script 中有一个动态的参数 `url`, 我希望使用 `jQuery.ajax()` 方法来加载这个 `url`。
页面自带 jQuery，扩展不带。但是 content script 中是无法访问页面自带的 jQuery。
可以这样使用：
```
// exec
var theUrl = 'http://domain/path/'
exec(function(url){
  // 页面注入内容
  jQuery.ajax({
    url: url
  })
}, theUrl)
```

调用 页面中的 `jQuery.ajax()`，肯定是需要获取 `ajax` 返回值的，然后使用返回值进行后面的操作，比如从返回值中获取有用信息传给 `background` 页面。
那么，首先我们需要把返回值从页面运行环境传给 content script：

```
var theUrl = 'http://domain/path/'
exec(function(url){
  // 页面注入内容
  jQuery.ajax({
    url: url,
    success: function(data){
      callbackData(data)
    }
  })
}, theUrl)(function(data){
  // content script 取得返回值
  console.log(data)
})
```
