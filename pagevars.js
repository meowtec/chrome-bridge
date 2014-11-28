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
    evaluate: function (str, target) {
      var elem = target || document.body
      var script = document.createElement('script')
      script.innerHTML = str
      elem.appendChild(script)
      elem.removeChild(script)
    },

    //获取function内部代码字符串
    getScriptInner: function (func) {
      return '\n' + func.toString().replace(/^.*\{\s*/, '').replace(/\s*\}$/, '') + '\n'
    },

    stringifyArr: function(arr){
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
  }
  // 绑定数据用的 element
  var elem = document.createElement('div')
  // id, 用来绑定 exec(script) 中返回的数据
  var datasetName = 'elodia' + utils.randstring()
  elem.setAttribute(datasetName, '')
  var callbacksDict = {};

  var contentPreScript = utils.getScriptInner(function () {
    var callbackData = (function(){
      var elem = document.querySelector('div[{{datasetName}}]')
      document.body.removeChild(elem)
      var utils = {}
      utils.randstring = function (){}
      utils.stringifyArr = function (){}
      return function(){
        elem.dataset.bind = JSON.stringify({
          rid: '{{rid}}',
          data: utils.stringifyArr(arguments)
        })
      }
    })()
  }).replace('randstring = function (){}', 'randstring = ' + utils.randstring.toString())
    .replace('stringifyArr = function (){}', 'stringifyArr = ' + utils.stringifyArr.toString())


  // 监听属性变化
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var attrname = mutation.attributeName
      var attrValue = elem.getAttribute(attrname)
      if (attrname === 'data-bind' && attrValue !== '') {
        console.log(attrValue)
        var value = JSON.parse(attrValue)
        var rid = value.rid
        var data = value.data
        var callbacks = callbacksDict[rid]
        callbacks.forEach(function (callback){
          callback.apply(null, (eval('('+data+')')))
        })
        elem.setAttribute(attrname, '')
      }
    });
  });

  var config = {
    attributes: true
  }
  observer.observe(elem, config);

  var exec = function (func) {
    var args = [].slice.call(arguments, 1)
    // 随机 rid
    var id = 'id' + parseInt(Math.random() * 10000000000000)
    // 去 function name
    var scriptText = func.toString().replace(/function.*?\(/, 'function(').replace(/\{/, '{'+contentPreScript+';')
    var script = '(' + scriptText + ').apply(null, ' + utils.stringifyArr(args) + ')'
    script = script.replace('{{rid}}', id).replace('{{datasetName}}', datasetName)
    document.body.appendChild(elem)
    utils.evaluate(script, elem)
    return function(callback){
      callbacksDict[id] = callbacksDict[id] || []
      callbacksDict[id].push(callback)
    }
  }
  return exec
})()
