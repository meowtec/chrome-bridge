window.__CHROME_BRIDGE__ = (function () {
  function errorMessage(error) {
    if (error) {
      if (error.message) return error.message
      if (error.toString) return error.toString()
    }

    return 'Unknown Error'
  }

  function call(id, func, args) {
    Promise.resolve().then(function () {
      return func.apply(null, args)
    }).then(function (result) {
      feedback(id, result, true)
    }).catch(function (error) {
      feedback(id, error, false)
    })
  }

  function feedback(id, result, success) {
    try {
      window.postMessage({
        id: id,
        success: success,
        result: success ? result : errorMessage(result),
        type: 'CHROME_BRIDGE'
      }, '*')
    } catch (e) {
      window.postMessage({
        id: id,
        success: false,
        result: errorMessage(e),
        type: 'CHROME_BRIDGE'
      }, '*')
    }
  }

  return {
    call: call
  }
})()
