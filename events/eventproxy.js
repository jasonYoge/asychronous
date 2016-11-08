/*global define*/
(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('EventProxy', function () {
  /*!
   * refs
   */
  var SLICE = Array.prototype.slice;
  var CONCAT = Array.prototype.concat;
  var ALL_EVENT = '__all__';

  /**
   * EventProxy. An implementation of task/event based asynchronous pattern.
   * A module that can be mixed in to *any object* in order to provide it with custom events.
   * You may `bind` or `unbind` a callback function to an event;
   * `trigger`-ing an event fires all callbacks in succession.
   * Examples:
   * ```js
   * var render = function (template, resources) {};
   * var proxy = new EventProxy();
   * proxy.assign("template", "l10n", render);
   * proxy.trigger("template", template);
   * proxy.trigger("l10n", resources);
   * ```
   */
  var EventProxy = function () {
    if (!(this instanceof EventProxy)) {
      return new EventProxy();
    }
    this._callbacks = {};
    this._fired = {};
  };

  /**
   * Bind an event, specified by a string name, `ev`, to a `callback` function.
   * Passing __ALL_EVENT__ will bind the callback to all events fired.
  * Examples:
   * ```js
   * var proxy = new EventProxy();
   * proxy.addListener("template", function (event) {
   *   // TODO
   * });
   * ```
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  EventProxy.prototype.addListener = function (ev, callback) {
    debug('Add listener for %s', ev);
    this._callbacks[ev] = this._callbacks[ev] || [];
    this._callbacks[ev].push(callback);
    return this;
  };
  /**
   * `addListener` alias, `bind`
   */
  EventProxy.prototype.bind = EventProxy.prototype.addListener;
  /**
   * `addListener` alias, `on`
   */
  EventProxy.prototype.on = EventProxy.prototype.addListener;
  /**
   * `addListener` alias, `subscribe`
   */
  EventProxy.prototype.subscribe = EventProxy.prototype.addListener;

  /**
   * Bind an event, but put the callback into head of all callbacks.
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  EventProxy.prototype.headbind = function (ev, callback) {
    debug('Add listener for %s', ev);
    this._callbacks[ev] = this._callbacks[ev] || [];
    this._callbacks[ev].unshift(callback);
    return this;
  };

  /**
   * Remove one or many callbacks.
   *
   * - If `callback` is null, removes all callbacks for the event.
   * - If `eventname` is null, removes all bound callbacks for all events.
   * @param {String} eventname Event name.
   * @param {Function} callback Callback.
   */
  EventProxy.prototype.removeListener = function (eventname, callback) {
    var calls = this._callbacks;
    if (!eventname) {
      debug('Remove all listeners');
      this._callbacks = {};
    } else {
      if (!callback) {
        debug('Remove all listeners of %s', eventname);
        calls[eventname] = [];
      } else {
        var list = calls[eventname];
        if (list) {
          var l = list.length;
          for (var i = 0; i < l; i++) {
            if (callback === list[i]) {
              debug('Remove a listener of %s', eventname);
              list[i] = null;
            }
          }
        }
      }
    }
    return this;
  };
  /**
   * `removeListener` alias, unbind
   */
  EventProxy.prototype.unbind = EventProxy.prototype.removeListener;

  /**
   * Remove all listeners. It equals unbind()
   * Just add this API for as same as Event.Emitter.
   * @param {String} event Event name.
   */
  EventProxy.prototype.removeAllListeners = function (event) {
    return this.unbind(event);
  };

  /**
   * Bind the ALL_EVENT event
   */
  EventProxy.prototype.bindForAll = function (callback) {
    this.bind(ALL_EVENT, callback);
  };

  /**
   * Unbind the ALL_EVENT event
   */
  EventProxy.prototype.unbindForAll = function (callback) {
    this.unbind(ALL_EVENT, callback);
  };

  /**
   * Trigger an event, firing all bound callbacks. Callbacks are passed the
   * same arguments as `trigger` is, apart from the event name.
   * Listening for `"all"` passes the true event name as the first argument.
   * @param {String} eventname Event name
   * @param {Mix} data Pass in data
   */
  EventProxy.prototype.trigger = function (eventname, data) {
    var list, ev, callback, i, l;
    var both = 2;
    var calls = this._callbacks;
    while (both--) {
      ev = both ? eventname : ALL_EVENT;
      list = calls[ev];
      if (list) {
        for (i = 0, l = list.length; i < l; i++) {
          if (!(callback = list[i])) {
            list.splice(i, 1) {
              i--;
              l--;
            }
          } else {
            var args = [];
            var start = both ? 1 : 0;
            for (var j = start; j < arguments.length; j++) {
              args.push(arguments[j]);
            }
            callback.apply(this, args);
          }
        }
      }
    }
    return this;
  };

  EventProxy.prototype.emit = EventProxy.prototype.trigger;
  EventProxy.prototype.fire = EventProxy.prototype.trigger;


});
