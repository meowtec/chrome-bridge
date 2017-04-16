(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ChromeBridge = global.ChromeBridge || {})));
}(this, (function (exports) { 'use strict';

const uuid = () => (
  Date.now() % 1000 + Math.random()
).toString(36).replace('.', '');

const injectScript = src => {
  const script = document.createElement('script');
  script.innerHTML = src;
  document.head.appendChild(script);
  document.head.removeChild(script);
};

var runtime = "window.__CHROME_BRIDGE__ = (function () {\n  function errorMessage(error) {\n    if (error) {\n      if (error.message) return error.message\n      if (error.toString) return error.toString()\n    }\n\n    return 'Unknown Error'\n  }\n\n  function call(id, func, args) {\n    Promise.resolve().then(function () {\n      return func.apply(null, args)\n    }).then(function (result) {\n      feedback(id, result, true)\n    }).catch(function (error) {\n      feedback(id, error, false)\n    })\n  }\n\n  function feedback(id, result, success) {\n    try {\n      window.postMessage({\n        id: id,\n        success: success,\n        result: success ? result : errorMessage(result),\n        type: 'CHROME_BRIDGE'\n      }, '*')\n    } catch (e) {\n      window.postMessage({\n        id: id,\n        success: false,\n        result: errorMessage(e),\n        type: 'CHROME_BRIDGE'\n      }, '*')\n    }\n  }\n\n  return {\n    call: call\n  }\n})()\n";

// raw text of runtime.js
const CHROME_BRIDGE = 'CHROME_BRIDGE_' + uuid();

const registerRuntime = () => {
  injectScript(runtime.replace(/CHROME_BRIDGE/g, CHROME_BRIDGE));
};

const createMessageListener = () => {
  const handlers = {};

  window.addEventListener('message', ({data}) => {
    if (data.type === CHROME_BRIDGE) {
      const handler = handlers[data.id];
      if (handler) {
        handler(data.success, data.result);
        delete handlers[data.id];
      }
    }
  });

  return (id, handler) => {
    handlers[id] = handler;
  }
};

const onmessage = createMessageListener();

const call = (func, args = []) => {
  return new Promise((resolve, reject) => {
    const id = 'callid_' + uuid();
    injectScript(`
      __${CHROME_BRIDGE}__.call(
        ${JSON.stringify(id)},
        ${func.toString()},
        ${JSON.stringify(args)}
      )
    `);

    onmessage(id, (success, result) => {
      if (success) {
        resolve(result);
      } else {
        reject(new Error(result));
      }
    });
  })
};

registerRuntime();

exports.call = call;

Object.defineProperty(exports, '__esModule', { value: true });

})));
