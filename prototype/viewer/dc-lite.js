/*
 * dc-lite.js
 *
 * A very small stand-in for the runtime of the design canvas where the CriticalEye
 * screens were drawn. It lets the screens in prototype/source/*.dc.html run in any
 * modern browser, outside Claude. build.mjs wraps each screen in a page that loads
 * this file; you should not need to touch it.
 *
 * It supports only what those screens use:
 *   {{name}}                         text or attribute value from Component.renderVals()
 *   <sc-if value="{{name}}">…</sc-if> kept when the value is truthy, removed otherwise
 *   onClick / onChange / onBlur="{{name}}"
 *                                    handlers returned by renderVals(); onChange fires on
 *                                    every keystroke (React-style), e.target is the field
 *   value="{{name}}"                 controlled input, select or textarea
 *   class Component extends DCLogic  constructor(props), renderVals(), this.setState(patch)
 *
 * Each state change rebuilds the screen's HTML. Focus, caret position and text typed
 * in fields without a binding are carried over. Prototype tooling, not production code.
 */
(function () {
  'use strict';

  var comp = null;      // the screen's Component instance
  var root = null;      // <div id="dc-root">
  var template = '';    // the screen's markup, from window.DC_TEMPLATE
  var vals = {};        // last result of renderVals()
  var queued = false;

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }
    setState(patch) {
      var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, next);
      schedule();
    }
  }

  var NAME = '([A-Za-z_$][\\w$]*)';
  var IF_RE = new RegExp('<sc-if\\s+value="\\{\\{\\s*' + NAME + '\\s*\\}\\}"[^>]*>((?:(?!<sc-if[\\s>])[\\s\\S])*?)</sc-if>', 'g');
  var EVENT_RE = new RegExp('\\s(on[A-Z]\\w*)="\\{\\{\\s*' + NAME + '\\s*\\}\\}"', 'g');
  var VALUE_RE = new RegExp('\\svalue="\\{\\{\\s*' + NAME + '\\s*\\}\\}"', 'g');
  var SLOT_RE = new RegExp('\\{\\{\\s*' + NAME + '\\s*\\}\\}', 'g');

  function text(x) {
    return x === undefined || x === null || typeof x === 'function' || typeof x === 'object' ? '' : String(x);
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Turn the template into plain HTML for the current values.
  function expand(t, v) {
    var before;
    do { // innermost <sc-if> first, until none is left
      before = t;
      t = t.replace(IF_RE, function (m, name, body) { return v[name] ? body : ''; });
    } while (t !== before);
    t = t.replace(EVENT_RE, function (m, attr, name) {
      return ' data-dc-' + attr.slice(2).toLowerCase() + '="' + name + '"';
    });
    t = t.replace(VALUE_RE, function (m, name) {
      return ' value="' + esc(text(v[name])) + '" data-dc-value="' + name + '"';
    });
    return t.replace(SLOT_RE, function (m, name) { return esc(text(v[name])); });
  }

  // A stable-ish key for a field or button, so state survives a rebuild.
  function sig(el) {
    if (el.id) return '#' + el.id;
    var a = ['data-dc-change', 'data-dc-value', 'data-dc-click', 'name', 'aria-label', 'placeholder'];
    for (var i = 0; i < a.length; i++) {
      var v = el.getAttribute(a[i]);
      if (v) return el.tagName + '|' + a[i] + '=' + v;
    }
    return el.tagName + '|' + (el.type || '') + '|' + (el.textContent || '').trim().slice(0, 40);
  }

  function keyed(scope) {
    var seen = {}, out = [];
    scope.querySelectorAll('input, select, textarea, button').forEach(function (el) {
      var s = sig(el);
      seen[s] = (seen[s] || 0) + 1;
      out.push([s + '#' + seen[s], el]);
    });
    return out;
  }

  function prop(el, name) {
    try { return el[name]; } catch (e) { return null; }
  }

  function isField(el) {
    return el.tagName !== 'BUTTON';
  }

  function render() {
    queued = false;
    if (!root || !comp) return;
    vals = comp.renderVals() || {};

    var saved = {}, focus = null;
    keyed(root).forEach(function (p) {
      var el = p[1];
      if (isField(el) && !el.hasAttribute('data-dc-value')) saved[p[0]] = { value: el.value, checked: el.checked };
      if (el === document.activeElement) focus = { key: p[0], start: prop(el, 'selectionStart'), end: prop(el, 'selectionEnd') };
    });

    root.innerHTML = expand(template, vals);

    root.querySelectorAll('[data-dc-value]').forEach(function (el) {
      var v = text(vals[el.getAttribute('data-dc-value')]);
      if (el.value !== v) el.value = v;
    });
    keyed(root).forEach(function (p) {
      var el = p[1], s = saved[p[0]];
      if (s && isField(el) && !el.hasAttribute('data-dc-value')) {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = s.checked;
        else if (el.value !== s.value) el.value = s.value;
      }
      if (focus && focus.key === p[0]) {
        el.focus({ preventScroll: true });
        if (focus.start != null) { try { el.setSelectionRange(focus.start, focus.end); } catch (e) { /* not a text field */ } }
      }
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    Promise.resolve().then(render);
  }

  // Event delegation: one listener per event type on the root.
  function listen(type, kind) {
    root.addEventListener(type, function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-dc-' + kind + ']') : null;
      if (!el || !root.contains(el)) return;
      var fn = vals[el.getAttribute('data-dc-' + kind)];
      if (typeof fn !== 'function') return;
      fn({
        type: e.type,
        target: el,
        currentTarget: el,
        nativeEvent: e,
        preventDefault: function () { e.preventDefault(); },
        stopPropagation: function () { e.stopPropagation(); }
      });
    });
  }

  function mount(Component, props) {
    root = document.getElementById('dc-root');
    template = window.DC_TEMPLATE || '';
    comp = new Component(props || {});
    listen('click', 'click');
    listen('input', 'change');
    listen('focusout', 'blur');
    render();
  }

  window.DCLogic = DCLogic;
  window.DCLite = { mount: mount, expand: expand };
})();
