# Detect private protocol in Browser

## Usage

```javascript
import detect from 'detect-private-protocol'
let pending = false
const params = {
  uri: 'skype:' + this.dest + '?chat',
  msg: __`Please install Skype application in order to send a message.`,
  fallbacks: {
    uri: 'http://www.skype.com/download-skype/skype-for-computer',
    uri_zh: 'http://skype.gmw.cn/down/skype-for-computers.html',
    android: 'market://details?id=com.skype.raider',
    ios: 'https://appstore.com/skypeforiphone',
    ipad: 'https://appstore.com/skypeforipad'
  }
}
pending = true
detect.trigger(params, () => {
  pending = false
})

```