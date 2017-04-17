import { uid, injectScript, once } from './utils'
// raw text of runtime.js
import runtime from './runtime'

const CHROME_BRIDGE = 'CHROME_BRIDGE_' + uid()

const registerRuntime = once(() => {
  injectScript(runtime.replace(/CHROME_BRIDGE/g, CHROME_BRIDGE))
})

const createMessageListener = () => {
  const handlers = {}

  window.addEventListener('message', ({data}) => {
    if (data && data.type === CHROME_BRIDGE) {
      const handler = handlers[data.id]
      if (handler) {
        handler(data.success, data.result)
        delete handlers[data.id]
      }
    }
  })

  return (id, handler) => {
    handlers[id] = handler
  }
}

const onmessage = createMessageListener()

const call = (func, args = []) => {
  return new Promise((resolve, reject) => {
    registerRuntime()

    const id = 'callid_' + uid()
    injectScript(`
      __${CHROME_BRIDGE}__.call(
        ${JSON.stringify(id)},
        ${func.toString()},
        ${JSON.stringify(args)}
      )
    `)

    onmessage(id, (success, result) => {
      if (success) {
        resolve(result)
      } else {
        reject(new Error(result))
      }
    })
  })
}

export {
  call,
}