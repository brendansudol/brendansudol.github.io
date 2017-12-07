function countdown(date_str, el) {
  var ctdn = document.getElementById(el)

  var deadline = new Date(date_str),
    tz_offset = deadline.getTimezoneOffset() * 60 * 1000

  function formatTime(d) {
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
  }

  function formatDay(d) {
    var days = Math.floor(+d / (24 * 60 * 60 * 1000))
    return days === 0 ? '' : days + (days > 1 ? ' days, ' : ' day, ')
  }

  function tick() {
    var now = new Date(),
      d_diff = new Date(+deadline + tz_offset + -now)

    if (+d_diff < 0) return (ctdn.innerHTML = 'boom')

    ctdn.innerHTML = formatDay(d_diff) + formatTime(d_diff)
    setTimeout(tick, 1000 - now % 1000)
  }

  tick()
}

var d = new Date()
d.setDate(d.getDate() + 3)
countdown(d.toDateString(), 'countdown')
