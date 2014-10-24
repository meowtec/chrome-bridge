function equal(name, a, b){
  if(a === b){
    console.log(name, true )
  }else{
    console.error(name, false, a, b)
  }
}

// 最复杂的情况
var execfunc = function () {
  postDataBack(pageVar1, 'reciever1')
  equal('传入参数', strrrrr, 'content var 1')
  equal('传入dom', body, document.body)
}
var execCallbacks = {
  'reciever1': function (str) {
    equal('返回值', str, 'abc')
  }
}
var execVars = {
  'strrrrr': 'content var 1',
  'body': document.body
}
exec(execfunc, execCallbacks, execVars)