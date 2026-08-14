/**
 * Unity WebGL swallows every key on the page. Run this before Unity loads
 * so the Contact form (and other inputs) can still receive typing.
 */
(function () {
  if (typeof window === "undefined" || window.__bnrKeyPatch) return;
  window.__bnrKeyPatch = true;

  var origAdd = EventTarget.prototype.addEventListener;
  var origRemove = EventTarget.prototype.removeEventListener;
  window.__bnrOrigAdd = origAdd;
  window.__bnrOrigRemove = origRemove;

  function isFormField(t) {
    if (!t || !t.tagName) return false;
    var tag = t.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      t.isContentEditable
    );
  }

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (
      (type === "keydown" || type === "keypress" || type === "keyup") &&
      typeof listener === "function"
    ) {
      var wrapped = function (event) {
        if (isFormField(event.target)) return;
        return listener.call(this, event);
      };
      return origAdd.call(this, type, wrapped, options);
    }
    return origAdd.call(this, type, listener, options);
  };
})();
