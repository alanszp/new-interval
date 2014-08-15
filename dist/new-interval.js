/*! new-interval 1.0.0 | Copyright 2014 Alan Szpigiel | MIT License */
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(root, factory) {
    var exports, prop;
    if (typeof exports === 'object') {
      module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      define([], factory);
    }
    exports = factory();
    for (prop in exports) {
      root[prop] = exports[prop];
    }
  })(this, function() {
    var Interval, allIntervals, now;
    allIntervals = [];
    now = Date.now || function() {
      return new Date().valueOf();
    };
    Interval = (function() {
      var voidFn;

      voidFn = function() {};

      function Interval(delay, callback) {
        if (delay == null) {
          delay = null;
        }
        if (callback == null) {
          callback = voidFn;
        }
        this.inmediate = __bind(this.inmediate, this);
        this.delayTime = delay;
        this.fn = callback;
        this.timeoutId = null;
        allIntervals.push(this);
      }

      Interval.prototype.start = function(nowTime) {
        if (this.timeoutId != null) {
          return;
        }
        if (nowTime == null) {
          nowTime = now();
        }
        this.planned = nowTime + this.delayTime;
        this.started = true;
        this.timeoutId = setTimeout(this.inmediate, this.delayTime);
        return this;
      };

      Interval.prototype.inmediate = function() {
        this.fn();
        if (this.timeoutId != null) {
          this.planned += this.delayTime;
          this.timeoutId = setTimeout(this.inmediate, this.planned - now());
        }
        return this;
      };

      Interval.prototype.clear = function() {
        this.pause();
        this.fn = voidFn;
        this.delay = null;
        allIntervals = _(allIntervals).without(this);
        return void 0;
      };

      Interval.prototype.pause = function() {
        if (this.timeoutId == null) {
          return;
        }
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.planned = null;
        return this;
      };

      Interval.prototype.delay = function(delay) {
        this.delayTime = delay;
        return this;
      };

      Interval.prototype.callback = function(fn) {
        this.fn = fn;
        return this;
      };

      return Interval;

    })();
    Interval.set = function() {
      var interval;
      interval = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Interval, arguments, function(){});
      interval.start();
      return interval;
    };
    Interval.clearAll = function() {
      _(allIntervals).each(function(interval) {
        return interval.clear();
      });
      return Interval;
    };
    Interval.pauseAll = function() {
      _(allIntervals).each(function(interval) {
        return interval.pause();
      });
      return Interval;
    };
    Interval.startAll = function() {
      var nowTime;
      nowTime = now();
      _(allIntervals).each(function(interval) {
        return interval.start(nowTime);
      });
      return Interval;
    };
    return {
      Interval: Interval
    };
  });

}).call(this);
