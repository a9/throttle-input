const map = new WeakMap()

function throttling(el) {
  const item = map.get(el)

  if (item.timer) {
    clearTimeout(item.timer)
  }

  item.timer = setTimeout(() => {
    if (item.timer) {
      item.timer = null
    }

    item.inputed = false
    item.listener.call(null, el)
  }, item.wait)
}

function handleKeyDown(e) {
  const item = map.get(e.target)

  item.keypressed = true
  if (item.timer) {
    clearTimeout(item.timer)
  }
}

function handleKeyUp(e) {
  const item = map.get(e.target)
  item.keypressed = false
  if (item.inputed) {
    throttling(e.target)
  }
}

function handleInput(e) {
  const item = map.get(e.target)

  item.inputed = true
  if (!item.keypressed) {
    throttling(e.target)
  }
}

export function on(el, listener) {
  let options =
    arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
  map.set(el, {
    keypressed: false,
    inputed: false,
    timer: void 0,
    listener,
    wait: null != options.wait ? options.wait : 100
  })
  el.addEventListener('keydown', handleKeyDown)
  el.addEventListener('keyup', handleKeyUp)
  el.addEventListener('input', handleInput)
}

export function off(el, listener) {
  el.removeEventListener('keydown', handleKeyDown)
  el.removeEventListener('keyup', handleKeyUp)
  el.removeEventListener('input', handleInput)

  const item = map.get(el)
  if (item) {
    if (item.timer && item.listener === listener) {
      clearTimeout(item.timer)
      map.delete(el)
    }
  }
}
