window.exec = (function () {

  var utils = {
    // 获取随机字符串
    randstring: function (len) {
      var letters = 'abcdefghijklmnopqrstuvwxyz1234567890'
      var ll = letters.length
      var str = ''
      len = len || 16
      for (var i = 0; i < len; i++) {
        str = str + letters[~~(Math.random() * ll)]
      }
      return str
    },

    // 在当前页面执行一段script
    evaluate: function (str) {
      var script = document.createElement('script')
      script.innerHTML = str
      document.body.appendChild(script)
      //document.body.removeChild(script)
    },

    //获取function内部代码字符串
    getScriptInner: function (func) {
      return '\n' + func.toString().replace(/^.*\{\s*/, '').replace(/\s*\}$/, '') + '\n'
    }
  }

  // id, 用来绑定 exec(script) 中返回的数据
  var datasetName = 'elodia' + utils.randstring()

  var callbacksDict = {};
  var contentPreScript = utils.getScriptInner(function () {
    var stringifyArr = function(arr){
      var str = '['
      for(var i = 0; i<arr.length; i++){
        var item = arr[i]
        if(item instanceof HTMLElement){
          var randAttr = utils.randstring()
          item.setAttribute('elodia-elem-' + randAttr, '')
          str = str + 'document.querySelector(\'[elodia-elem-' + randAttr + ']\'), '
        }else{
          str = str + JSON.stringify(item) + ', '
        }
      }
      str = str.replace(/,\s*$/, '') + ']'
      return str
    }
    var callbackData = function(){
      document.body.dataset['{{datasetName}}'] = JSON.stringify({
        rid: '{{rid}}',
        data: stringifyArr(arguments)
      })
    }
  })

  // defineVars
  function defineVars(object) {
    var obj = object || {}
    var code = ''
    for (var key in obj) {
      var value = obj[key]
      if (value instanceof HTMLElement) {
        var randAttr = utils.randstring()
        value.setAttribute('elodia-elem-' + randAttr, '')
        code = code + 'var ' + key + ' = document.querySelector(\'[elodia-elem-' + randAttr + ']\');'
      } else {
        code = code + 'var ' + key + ' = JSON.parse(' + JSON.stringify(value) + ');'
      }
    }
    return code
  }
  var stringifyArr = function(arr){
    var str = '['
    for(var i = 0; i<arr.length; i++){
      var item = arr[i]
      if(item instanceof HTMLElement){
        var randAttr = utils.randstring()
        item.setAttribute('elodia-elem-' + randAttr, '')
        str = str + 'document.querySelector(\'[elodia-elem-' + randAttr + ']\'), '
      }else{
        str = str + JSON.stringify(item) + ', '
      }
    }
    str = str.replace(/,\s*$/, '') + ']'
    return str
  }

  // 监听属性变化
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var attrname = mutation.attributeName
      var attrValue = document.body.getAttribute(attrname)
      if (attrname === 'data-' + datasetName && attrValue !== '') {
        console.log(attrValue)
        var value = JSON.parse(attrValue)
        var rid = value.rid
        var data = value.data
        var callbacks = callbacksDict[rid]
        callbacks.forEach(function (callback){
          callback.apply(null, (eval('('+data+')')))
        })
        document.body.setAttribute(attrname, '')
      }
    });
  });

  var config = {
    attributes: true
  }
  observer.observe(document.body, config);

  var exec = function (func) {
    var args = [].slice.call(arguments, 1)
    // 随机 rid
    var id = 'id' + parseInt(Math.random() * 10000000000000)
    // 去 function name
    var scriptText = func.toString().replace(/function.*?\(/, 'function(').replace(/\{/, '{'+contentPreScript+';')
    var script = '(' + scriptText + ').apply(null, ' + stringifyArr(args) + ')'
    script = script.replace('{{rid}}', id).replace('{{datasetName}}', datasetName)
    utils.evaluate(script)
    return function(callback){
      callbacksDict[id] = callbacksDict[id] || []
      callbacksDict[id].push(callback)
    }
  }
  return exec
})()
