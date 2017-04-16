(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ChromeBridge = global.ChromeBridge || {})));
}(this, (function (exports) { 'use strict';

var uuid = function uuid() {
  return (Date.now() % 1000 + Math.random()).toString(36).replace('.', '');
};

var injectScript = function injectScript(src) {
  var script = document.createElement('script');
  script.innerHTML = src;
  document.head.appendChild(script);
  document.head.removeChild(script);
};

var runtime = "window.__CHROME_BRIDGE__ = (function () {\n  function errorMessage(error) {\n    if (error) {\n      if (error.message) return error.message\n      if (error.toString) return error.toString()\n    }\n\n    return 'Unknown Error'\n  }\n\n  function call(id, func, args) {\n    Promise.resolve().then(function () {\n      return func.apply(null, args)\n    }).then(function (result) {\n      feedback(id, result, true)\n    }).catch(function (error) {\n      feedback(id, error, false)\n    })\n  }\n\n  function feedback(id, result, success) {\n    try {\n      window.postMessage({\n        id: id,\n        success: success,\n        result: success ? result : errorMessage(result),\n        type: 'CHROME_BRIDGE'\n      }, '*')\n    } catch (e) {\n      window.postMessage({\n        id: id,\n        success: false,\n        result: errorMessage(e),\n        type: 'CHROME_BRIDGE'\n      }, '*')\n    }\n  }\n\n  return {\n    call: call\n  }\n})()\n";

// raw text of runtime.js
var CHROME_BRIDGE = 'CHROME_BRIDGE_' + uuid();

var registerRuntime = function registerRuntime() {
  injectScript(runtime.replace(/CHROME_BRIDGE/g, CHROME_BRIDGE));
};

var createMessageListener = function createMessageListener() {
  var handlers = {};

  window.addEventListener('message', function (_ref) {
    var data = _ref.data;

    if (data.type === CHROME_BRIDGE) {
      var handler = handlers[data.id];
      if (handler) {
        handler(data.success, data.result);
        delete handlers[data.id];
      }
    }
  });

  return function (id, handler) {
    handlers[id] = handler;
  };
};

var onmessage = createMessageListener();

var call = function call(func) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return new Promise(function (resolve, reject) {
    var id = 'callid_' + uuid();
    injectScript('\n      __' + CHROME_BRIDGE + '__.call(\n        ' + JSON.stringify(id) + ',\n        ' + func.toString() + ',\n        ' + JSON.stringify(args) + '\n      )\n    ');

    onmessage(id, function (success, result) {
      if (success) {
        resolve(result);
      } else {
        reject(new Error(result));
      }
    });
  });
};

registerRuntime();

exports.call = call;

Object.defineProperty(exports, '__esModule', { value: true });

})));
