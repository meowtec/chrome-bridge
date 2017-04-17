/**
 * random id
 */
export const uid = () => (
  Date.now() % 1000 + Math.random()
).toString(36).replace('.', '')

/**
 * inject embedded srcipt
 * @param {string} src script code
 */
export const injectScript = src => {
  const script = document.createElement('script')
  script.innerHTML = src
  document.head.appendChild(script)
  document.head.removeChild(script)
}

/**
 * make function called only one time
 * @param {Function} fun
 */
export const once = fun => {
  let done = false

  return () => {
    if (!done) {
      fun()
      done = true
    }
  }
}
