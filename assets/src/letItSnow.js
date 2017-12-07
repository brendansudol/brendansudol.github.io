import $ from 'jquery'

function letItSnow(el) {
  // if snow added to body, set snow area to viewport
  var bbox = el
  if (el === 'body') bbox = window

  var colors = ['#fff', '#f3f3f7', '#dadae7'],
    fonts = ['Verdana', 'Tahoma', 'Georgia', 'Bookman', 'Times'],
    flakes = ['*', '&#10052;'] // 2nd element is unicode snowflake

  // random int between min & max
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  // get random element from array
  function randInArray(arr) {
    return arr[rand(0, arr.length - 1)]
  }

  // adds unique-ish snowflake to page with falling animation
  function snow() {
    var flake = '<span>' + randInArray(flakes) + '</span>',
      left_pos = $(bbox).width() * Math.random(),
      fall_time = rand(3000, 10000)

    var stylez_start = {
      position: 'absolute',
      top: -50,
      left: left_pos,
      color: randInArray(colors),
      'font-family': randInArray(fonts),
      'font-size': rand(15, 30),
      opacity: 0.5 + Math.random(),
    }

    var stylez_end = {
      top: $(bbox).height() - 30,
      left: left_pos + rand(-200, 200),
      opacity: 0.2,
    }

    // add snowflake to page with initial position and styles,
    // animate it (falling & dimming), then remove it from DOM
    $(flake)
      .clone()
      .appendTo(el)
      .css(stylez_start)
      .animate(stylez_end, fall_time, 'linear', function() {
        $(this).remove()
      })
  }

  // adds a new snowflake every 300 milliseconds
  setInterval(function() {
    snow()
  }, 300)
}

letItSnow('#sky')
