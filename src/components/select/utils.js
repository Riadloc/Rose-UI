const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

function camelCase (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export function getStyle (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

function firstUpperCase (str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}

// Warn
export function warnProp (prop, correctType, wrongType) {
  correctType = firstUpperCase(correctType)
  wrongType = firstUpperCase(wrongType)
  console.error(`[more-select warn]: Invalid prop: type check failed for prop ${prop}. Expected ${correctType}, got ${wrongType}.`)
}

export function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

export function throttle (callback, timeout) {
  let timer; let last = 0

  return function () {
    const now = +new Date()
    const remaining = timeout - (now - last)
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      callback()
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        timer = null
        callback()
      }, remaining)
    }
  }
}
