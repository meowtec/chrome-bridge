chrome-bridge
========

Bridge between Chrome extension [content scripts](https://developer.chrome.com/extensions/content_scripts#execution-environment) and the page.

### Usage
```javascript
import { call } from 'chrome-bridge'

call(() => window.appData)
  .then(data => console.log(data))

const url = '/'
call((url) => window.jQuery.get(url), [url])
  .then(html => console.log(html))
```
