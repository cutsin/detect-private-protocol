// Detect private protocol

const UA = navigator.userAgent
const WIN = window
let Installed = false
let Pending = false
let Conf = null

const createIfr = (_win) => {
  let _doc = _win.document
  let _ifr = _doc.createElement('iframe')
  _ifr.style.display = 'none'
  _doc.body.appendChild(_ifr)
  return _ifr
}

const init = () => {
  if (Conf) return
  Conf = {
    ifr: createIfr(WIN),
    key: 'uri',
    plan: 'A'
  }
  // fallback platform key
  // android
  if (~UA.indexOf('Android')) Conf.key = 'android'
  // ios
  if (/like Mac OS X/i.test(UA)) Conf.key = 'ios'
  if (/iPad/i.test(UA)) Conf.key = 'ipad'
  // languages
  if (Conf.key === 'uri' && /^zh/i.test(navigator.language)) Conf.key = 'uri_zh'
  // detect plan
  if (/MSIE [6-9]/i.test(UA)) Conf.plan = 'B'
  if (/OS [4-7]_[0-9_]+ like Mac OS X/i.test(UA)) Conf.playSpec = 'ios7-'
  if (~UA.indexOf('Android')) Conf.playSpec = 'android'
}

const redirectTo = (p) => WIN.confirm(p.msg) && WIN.open(p.fallbacks[Conf.key])

const plan = {
  A (param, cb) {
    Installed = false
    Pending = true
    let evt = 'blur'
    let delay = 3000
    let makeInstalled = () => {
      Installed = true
    }
    switch (Conf.playSpec) {
      case 'ios7-':
        evt = 'pagehide'
        break
      case 'android':
        evt = 'visibilitychange'
        makeInstalled = () => {
          Installed = document.hidden
        }
        delay = 6000
        break
    }
    WIN.addEventListener(evt, makeInstalled)
    Conf.ifr.src = param.uri
    setTimeout(() => {
      Pending = false
      WIN.removeEventListener(evt, makeInstalled)
      if (!Installed) redirectTo(param)
      cb && cb()
    }, delay)
  },
  B (param, cb) {
    Installed = false
    Pending = true
    let newWin = window.open('', '_blank', 'width=100, height=100')
    let newIfr = createIfr(newWin)
    newIfr.src = param.uri
    setTimeout(() => {
      Pending = false
      if (newWin.location && newWin.location.href) Installed = true
      if (Installed) {
        newWin.setTimeout('window.close()', 10)
      } else {
        newWin.close()
        redirectTo(param)
      }
      cb && cb()
    }, 100)
  }
}

export default {
  trigger () {
    if (Pending) return
    init()
    return plan[Conf.plan].apply(null, arguments)
  }
}
