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
        this.immediate = __bind(this.immediate, this);
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
        this.timeoutId = setTimeout(this.immediate, this.delayTime);
        return this;
      };

      Interval.prototype.immediate = function() {};

      Interval.fn();

      if (Interval.timeoutId != null) {
        Interval.planned += Interval.delayTime;
        Interval.timeoutId = setTimeout(Interval.immediate, Interval.planned - now());
      }

      Interval;

      return Interval;

    })();
    return {
      clear: function() {
        this.pause();
        this.fn = voidFn;
        this.delay = null;
        allIntervals = _(allIntervals).without(this);
        return void 0;
      },
      pause: function() {
        if (this.timeoutId == null) {
          return;
        }
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.planned = null;
        return this;
      },
      delay: function(delay) {
        this.delayTime = delay;
        return this;
      },
      callback: function(fn) {
        this.fn = fn;
        return this;
      }
    };
  });

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

  ({
    Interval: Interval
  });

}).call(this);
