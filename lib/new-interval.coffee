  # new-interval 1.0.0 | Copyright 2014 Alan Szpigiel | MIT License
  ((root, factory) ->
    if typeof exports is 'object'
      # Expose to Node.js
      module.exports = factory()
    else if typeof define is 'function' and define.amd
      # Expose to RequireJS
      define([], factory)

    # Expose to global object (likely browser window)
    exports = factory()
    for prop of exports
      root[prop] = exports[prop];

    return
  ) this, () ->
    allIntervals = []

    now = Date.now || () ->
      new Date().valueOf();

    class Interval
      voidFn = () ->

      constructor: (delay = null, callback = voidFn) ->
        @delayTime = delay
        @fn = callback
        @timeoutId = null
        allIntervals.push(this)

      start: (nowTime) ->
        return if @timeoutId?

        nowTime ?= now()
        @planned = nowTime + @delayTime

        @started = true
        @timeoutId = setTimeout(@immediate, @delayTime)
        this

      immediate: () =>
      @fn()
      if @timeoutId?
        @planned += @delayTime
        @timeoutId = setTimeout(@immediate, @planned - now())
      this

    clear: () ->
      @pause()

      @fn = voidFn
      @delay = null
      allIntervals = _(allIntervals).without(this)
      undefined

    pause: () ->
      return unless @timeoutId?

      clearTimeout(@timeoutId)
      @timeoutId = null
      @planned = null
      this

    delay: (delay) ->
      @delayTime = delay
      this

    callback: (fn) ->
      @fn = fn
      this

  Interval.set = () ->
    interval = new Interval(arguments...)
    interval.start()
    interval

  Interval.clearAll = () ->
    _(allIntervals).each (interval) ->
      interval.clear()
    Interval

  Interval.pauseAll = () ->
    _(allIntervals).each (interval) ->
      interval.pause()
    Interval

  Interval.startAll = () ->
    nowTime = now()
    _(allIntervals).each (interval) ->
      interval.start(nowTime)
    Interval

  {
    Interval: Interval
  }
