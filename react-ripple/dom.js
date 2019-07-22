export function addEventListener(element, type, callback, capture = false) {
  if (element.addEventListener) {
    element.addEventListener(type, callback, capture);
  } else if (element.attachEvent) {
    element.attachEvent(type, callback);
  }
}

export function removeEventListener(element, type, callback) {
  if (element.removeEventListener) {
    element.removeEventListener(type, callback);
  } else if (element.detachEvent) {
    element.detachEvent(type, callback);
  }
}

export function animationEnd(element, callback) {
  element.addEventListener('animationend', callback, false);
  element.addEventListener('webkitAnimationEnd', callback, false);
  element.addEventListener('mozAnimationEnd', callback, false);
  element.addEventListener('OAnimationEnd', callback, false);
}

export function setTransform(element, animation) {
  element.style.webkitTransform = animation;
  element.style.mozTransform = animation;
  element.style.oTransform = animation;
  element.style.msTransform = animation;
  element.style.transform = animation;
}

export function setTransitionDuration(element, times) {
  element.style.webkitTransitionDuration = `${times}ms`;
  element.style.mozTransitionDuration = `${times}ms`;
  element.style.oTransitionDuration = `${times}ms`;
  element.style.transitionDuration = `${times}ms`;
}

export function transitionStart(element, callback) {
  element.addEventListener('transitionstart', callback, false);
  element.addEventListener('webkitTransitionStart', callback, false);
  element.addEventListener('mozTransitionStart', callback, false);
  element.addEventListener('oTransitionStart', callback, false);
}

export function transitionEnd(element, callback) {
  element.addEventListener('transitionend', callback, false);
  element.addEventListener('webkitTransitionEnd', callback, false);
  element.addEventListener('mozTransitionEnd', callback, false);
  element.addEventListener('oTransitionEnd', callback, false);
}

export function deleteTransitionEnd(element, callback) {
  element.removeEventListener('transitionend', callback, false);
  element.removeEventListener('webkitTransitionEnd', callback, false);
  element.removeEventListener('mozTransitionEnd', callback, false);
  element.removeEventListener('oTransitionEnd', callback, false);
}

export function on(elem, type, callback, capture = false) {
  if (elem.addEventListener) {
    elem.addEventListener(type, callback, capture);
  } else if (elem.attachEvent) {
    elem.attachEvent(type, callback);
  }
}

export function off(elem, type, callback) {
  if (elem.removeEventListener) {
    elem.removeEventListener(type, callback);
  } else if (elem.detachEvent) {
    elem.detachEvent(type, callback);
  }
}

export function listen(elem, type, callback) {
  on(elem, type, callback);

  return () => {
    off(elem, type, callback);
  };
}

export function getTouchEvent() {
  const isMobile = 'ontouchstart' in document;
  let event;
  if (isMobile) {
    event = {
      touchstart: 'touchstart',
      touchmove: 'touchmove',
      touchend: 'touchend',
      mobile: true,
    };
  } else {
    event = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
      mobile: false,
    };
  }

  return event;
}

export const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((m) => {
  return window.setTimeout(m, 1000 / 60);
});

export const cancelAnimationFrame = window.cancelAnimationFrame || ((id) => {
  clearTimeout(id);
});

export function addClass(elem, className) {
  const classes = className.split(/\s+/);
  for (const cName of classes) {
    elem.classList.add(cName);
  }
}

export function hasClass(elem, className) {
  if (elem.classList) {
    return elem.classList.contains(className);
  }
  return new RegExp(`(^| )${className}( |$)`, 'gi').test(elem.className);
}

export function removeClass(elem, className) {
  const classes = className.split(/\s+/);
  let num = 0;
  for (const cName of classes) {
    if (elem.classList) {
      elem.classList.remove(cName);
    } else {
      elem.className = classes.splice(num, 1).join(' ');
    }
    num += 1;
  }
}

export function setStyle(elem, style) {
  for (const s in style) {
    if (Object.prototype.hasOwnProperty.call(style, s)) {
      elem.style[s] = style[s];
    }
  }
}

export function getRect(elem) {
  return elem.getBoundingClientRect();
}

export function getOtherProperties(target, source) {
  const obj = {};
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (source.indexOf(key) === -1) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
}

export function dateFormat(date, fmt) {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      const regExp = new RegExp(`(${k})`);
      if (regExp.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) :
          ((`00${o[k]}`).substr((`${o[k]}`).length)));
      }
    }
  }
  return fmt;
}

export function checkPlatform() {
  let userAngent = '';
  let isMobile = false;
  const mobile = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
    (mobile.test(navigator.userAgent))) {
    try {
      if (/Android|Windows Phone|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        userAngent = 'mobile';
      } else if (/iPad/i.test(navigator.userAgent)) {
        userAngent = 'ipad';
      }
      isMobile = true;
    } catch (e) {
      // e
    }
  } else {
    isMobile = false;
    userAngent = 'window';
  }
  return {
    platform: userAngent,
    mobile: isMobile,
  };
}
