var elem = document.body
exec(function(arg){
  console.log(arg)
  callbackData(pageVar1, 'success', theLink)

}, elem)(function(x, result, element){
  console.log(x, result, element)
})
