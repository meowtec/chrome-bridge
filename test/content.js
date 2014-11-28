exec(function(arg1, arg2, arg3){
  console.log(arg3)
  callbackData(arg1 + 1, arg2 + 1, 'success', document.body)

}, 0, 1, document.getElementById('ee'))(function(a1, a2, a3, result, element){
  console.log(a1, a2, a3, result, element)
})
