(function() {
    /* randstring creator */
    var randstring = function(len){
        var letters = 'abcdefghijklmnopqrstuvwxyz1234567890'
        var ll = letters.length
        var str = ''
        var len = len||16
        for(var i=0;i<len;i++){
            str = str + letters[~~(Math.random()*ll)]
        }
        return str
    }

    var datasetName = 'elodia' + randstring()
    var callbacksDict = {};
    var rtScript = getScriptStr(function() {
        var postDataBack = function(text, callbackName) {
            document.body.dataset['{{datasetName}}'] = JSON.stringify({
                'rid': '{{rid}}',
                'name': callbackName,
                'data': text
            })
        };
    })

    //获取function内部代码字符串
    function getScriptStr(func) {
        return func.toString().replace(/^.*{\s*/, '').replace(/\s*}$/, '')
    }
    // 执行js代码
    function execScriptStr(str) {
        var script = document.createElement('script')
        script.innerHTML = str
        document.body.appendChild(script)
        //document.body.removeChild(script)
    }
    //
    function defineVars(object){
        var obj = object||{}
        var code = ''
        for(var key in obj){
            var value = obj[key]
            if(value instanceof HTMLElement){
                var randAttr = randstring()
                value.setAttribute('elodia-elem-' + randAttr, '')
                code = code + 'var ' + key + ' = document.querySelector(\'[elodia-elem-' + randAttr + ']\');'
            }else{
                var quot = typeof value == 'string'?'\'':''
                code = code + 'var ' + key + ' = ' + quot + value + quot + ';'
            }
        }
        return code
    }
    // 监听属性变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var attrname = mutation.attributeName
            var attrValue = document.body.getAttribute(attrname)
            if (attrname == 'data-'+datasetName && attrValue != '') {
                var data = JSON.parse(attrValue)
                var rid = data.rid
                var name = data.name
                var text = data.data
                var callbacks = callbacksDict[rid]
                var callback
                if(typeof callbacks == 'function'){
                    callback = callbacks
                }else{
                    callback = callbacks[name]
                }
                callback&&callback(text, name)
                document.body.setAttribute(attrname, '')
            }
        });
    });
    var config = {
        attributes: true
    }
    observer.observe(document.body, config);

    window.pageScriptExec = function(func, callbacks, vars) {
        var id = 'id' + parseInt(Math.random() * 10000000000000)
        var scriptText = getScriptStr(func)
        var script = document.createElement('script')
        script.innerHTML = '(function(){' +
            rtScript.replace('{{rid}}', id).replace('{{datasetName}}', datasetName) +
            defineVars(vars) +
            scriptText +
            '})()';
        document.body.appendChild(script)
        callbacksDict[id] = callbacks
    }
})()
