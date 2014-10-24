// randstring creator
exports.randstring = function randstring(len) {
  var letters = 'abcdefghijklmnopqrstuvwxyz1234567890'
  var ll = letters.length
  var str = ''
  len = len||16
  for(var i=0;i<len;i++){
    str = str + letters[~~(Math.random()*ll)]
  }
  return str
}

// 获取function内部代码字符串
exports.getFunctionInner = function getFunctionInner(func) {
  return func.toString().replace(/^.*{\s*/, '').replace(/\s*}$/, '')
}

// 执行一段js代码
exports.execScript = function execScript(str) {
  var script = document.createElement('script')
  script.innerHTML = str
  document.body.appendChild(script)
  document.body.removeChild(script)
}