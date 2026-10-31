/*
 * dc-lite.js
 *
 * A very small stand-in for the runtime of the design canvas where the CriticalEye
 * screens were drawn. It lets the screens in prototype/source/*.dc.html run in any
 * modern browser, outside Claude. build.mjs wraps each screen in a page that loads
 * this file; you should not need to touch it.
 *
 * It supports what those screens use:
 *   {{path}}                          text or attribute value from Component.renderVals();
 *                                     a dotted lookup such as {{item.name}} or {{$index}}
 *   <sc-if value="{{path}}">…</sc-if>  kept when the value is truthy, removed otherwise
 *   <sc-for list="{{path}}" as="item">…</sc-for>
 *                                     repeated once per array element, with {{item.x}}
 *                                     and {{$index}} in scope
 *   onClick / onChange / onBlur="{{path}}"
 *                                     handlers from renderVals() (also per loop item);
 *                                     onChange fires on every keystroke, React-style,
 *                                     and e.target is the bound element
 *   value="{{path}}"                  controlled input, select or textarea
 *   checked / disabled="{{path}}"     boolean attributes, present only when truthy
 *   class Component extends DCLogic   constructor(props), renderVals(), this.setState(patch)
 *
 * Each state change rebuilds the screen's HTML. Focus, caret position and text typed
 * in fields without a binding are carried over. Prototype tooling, not production code.
 */
(function () {
  'use strict';

  var comp = null;      // the screen's Component instance
  var root = null;      // <div id="dc-root">
  var template = '';    // the screen's markup, from window.DC_TEMPLATE
  var handlers = [];    // functions bound in the last render, by index
  var queued = false;
  var mounted = false;

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
    }
    setState(patch, done) {
      var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, next);
      schedule();
      if (typeof done === 'function') Promise.resolve().then(done);
    }
    forceUpdate() {
      schedule();
    }
  }

  var PATH = '([A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*)';
  var HOLE_RE = new RegExp('\\{\\{\\s*' + PATH + '\\s*\\}\\}', 'g');
  var WHOLE_RE = new RegExp('^\\{\\{\\s*' + PATH + '\\s*\\}\\}$');
  var BLOCK_RE = /<sc-(if|for)\b([^>]*)>/g;
  var TAG_RE = /<([a-zA-Z][-\w]*)(\s[^<>]*?)?(\/?)>/g;
  var ATTR_RE = /\s([A-Za-z_:][-\w:.]*)="([^"]*)"/g;
  var BOOLEAN = { checked: 1, disabled: 1, selected: 1, readonly: 1, required: 1, multiple: 1, hidden: 1 };

  function lookup(path, scope) {
    if (!path) return undefined;
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v === null || v === undefined) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  // React-like: booleans render as nothing in text, as "true"/"false" in attributes.
  function show(x, inAttr) {
    if (x === undefined || x === null || typeof x === 'function' || typeof x === 'object') return '';
    if (typeof x === 'boolean' && !inAttr) return '';
    return String(x);
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function blockAttr(attrs, name, hole) {
    var m = new RegExp('\\b' + name + '="([^"]*)"').exec(attrs);
    if (!m) return null;
    if (!hole) return m[1];
    var w = WHOLE_RE.exec(m[1].trim());
    return w ? w[1] : null;
  }

  // Index of the </sc-tag> that closes the block whose body starts at `from`.
  function closing(t, from, tag) {
    var open = new RegExp('<sc-' + tag + '\\b', 'g'), close = '</sc-' + tag + '>';
    var depth = 1, i = from;
    for (;;) {
      var c = t.indexOf(close, i);
      if (c < 0) throw new Error('dc-lite: <sc-' + tag + '> is not closed');
      open.lastIndex = i;
      var o = open.exec(t);
      if (o && o.index < c) { depth++; i = o.index + o[0].length; continue; }
      depth--;
      if (depth === 0) return c;
      i = c + close.length;
    }
  }

  // Expand control blocks left to right, recursing into each body with its scope.
  function expand(t, scope) {
    var out = '', i = 0, m;
    var re = new RegExp(BLOCK_RE.source, 'g');
    while ((m = re.exec(t))) {
      out += fill(t.slice(i, m.index), scope);
      var start = m.index + m[0].length;
      var end = closing(t, start, m[1]);
      var body = t.slice(start, end);
      if (m[1] === 'if') {
        if (lookup(blockAttr(m[2], 'value', true), scope)) out += expand(body, scope);
      } else {
        var list = lookup(blockAttr(m[2], 'list', true), scope);
        var as = blockAttr(m[2], 'as', false) || 'item';
        if (Array.isArray(list)) {
          list.forEach(function (item, idx) {
            var s = Object.create(scope);
            s[as] = item;
            s.$index = idx;
            out += expand(body, s);
          });
        }
      }
      i = end + ('</sc-' + m[1] + '>').length;
      re.lastIndex = i;
    }
    return out + fill(t.slice(i), scope);
  }

  // Fill holes in plain markup: attributes tag by tag, then text.
  function fill(seg, scope) {
    seg = seg.replace(TAG_RE, function (tag, name, attrs, slash) {
      if (!attrs || attrs.indexOf('{{') < 0) return tag;
      var keyed = false;
      attrs = attrs.replace(ATTR_RE, function (a, key, val) {
        var whole = WHOLE_RE.exec(val.trim());
        var lower = key.toLowerCase();
        if (lower === 'hint-placeholder-val' || lower === 'hint-placeholder-count') return '';
        if (/^on[A-Z]/.test(key)) {
          var fn = whole ? lookup(whole[1], scope) : null;
          if (typeof fn !== 'function') return '';
          var kind = key.slice(2).toLowerCase();
          var out = ' data-dc-' + kind + '="' + (handlers.push(fn) - 1) + '"';
          if (!keyed) {
            keyed = true;
            var idx = lookup('$index', scope);
            out += ' data-dc-key="' + esc(kind + ':' + whole[1] + (idx === undefined ? '' : '@' + idx)) + '"';
          }
          return out;
        }
        if (whole && BOOLEAN[lower]) return lookup(whole[1], scope) ? ' ' + key : '';
        if (lower === 'value' && whole) {
          var v = esc(show(lookup(whole[1], scope), true));
          return ' value="' + v + '" data-dc-set="' + v + '"';
        }
        return ' ' + key + '="' + val.replace(HOLE_RE, function (h, p) { return esc(show(lookup(p, scope), true)); }) + '"';
      });
      return '<' + name + attrs + slash + '>';
    });
    return seg.replace(HOLE_RE, function (h, p) { return esc(show(lookup(p, scope), false)); });
  }

  // A stable key for a field or button, so focus and typed text survive a rebuild.
  function sig(el) {
    var k = el.getAttribute('data-dc-key');
    if (k) return k;
    if (el.id) return '#' + el.id;
    var a = ['name', 'aria-label', 'placeholder'];
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
    var vals = comp.renderVals() || {};

    var saved = {}, focus = null;
    keyed(root).forEach(function (p) {
      var el = p[1];
      if (isField(el) && !el.hasAttribute('data-dc-set')) saved[p[0]] = { value: el.value, checked: el.checked };
      if (el === document.activeElement) focus = { key: p[0], start: prop(el, 'selectionStart'), end: prop(el, 'selectionEnd') };
    });

    handlers = [];
    root.innerHTML = expand(template, vals);

    root.querySelectorAll('[data-dc-set]').forEach(function (el) {
      var v = el.getAttribute('data-dc-set');
      if (el.value !== v) el.value = v;
    });
    keyed(root).forEach(function (p) {
      var el = p[1], s = saved[p[0]];
      if (s && isField(el) && !el.hasAttribute('data-dc-set')) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (!el.hasAttribute('data-dc-change')) el.checked = s.checked;
        } else if (el.value !== s.value) {
          el.value = s.value;
        }
      }
      if (focus && focus.key === p[0]) {
        el.focus({ preventScroll: true });
        if (focus.start != null) { try { el.setSelectionRange(focus.start, focus.end); } catch (e) { /* not a text field */ } }
      }
    });

    if (!mounted) {
      mounted = true;
      if (typeof comp.componentDidMount === 'function') comp.componentDidMount();
    }
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
      var fn = handlers[Number(el.getAttribute('data-dc-' + kind))];
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
