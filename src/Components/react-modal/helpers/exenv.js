/* global define */

(function () {
  var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

  var ExecutionEnvironment = {
    canUseDOM: canUseDOM,

    canUseWorkers: typeof Worker !== 'undefined',

    canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

    canUseViewport: canUseDOM && !!window.screen,
  };

  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function () {
      return ExecutionEnvironment;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExecutionEnvironment;
  } else {
    window.ExecutionEnvironment = ExecutionEnvironment;
  }
})();
