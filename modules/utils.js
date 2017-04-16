export const uuid = () => (
  Date.now() % 1000 + Math.random()
).toString(36).replace('.', '')

export const injectScript = src => {
  const script = document.createElement('script')
  script.innerHTML = src
  document.head.appendChild(script)
  document.head.removeChild(script)
}
