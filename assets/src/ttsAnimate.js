function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function contains(arr, el) {
  return arr.indexOf(el) > -1
}
function sample(arr) {
  return arr[rand(0, arr.length - 1)]
}
function complete(transition, callback) {
  var n = 0
  transition
    .each(function() {
      ++n
    })
    .each('end', function() {
      if (!--n) callback.apply(this, arguments)
    })
}

var svg = d3.select('#viz-tts-animate svg')
var width = +svg.attr('width')
var height = +svg.attr('height')

var rects = svg.selectAll('rect')
var rects_arr = rects[0]

var data = []
var active = []

rects.each(function(_) {
  var r = d3.select(this)
  data.push({ x: +r.attr('x'), y: +r.attr('y') })
})

rects
  .data(data)
  .attr('x', function(d) {
    return rand(0, width)
  })
  .attr('y', function(d) {
    return rand(0, height)
  })
  .transition()
  .ease('cubic-out')
  .duration(function(d, i) {
    return i * 2 + 200
  })
  .delay(function(d, i) {
    return i * 15
  })
  .attr('x', function(d) {
    return d.x
  })
  .attr('y', function(d) {
    return d.y
  })
  .style('opacity', 1)
  .call(complete, function() {
    rects.on('mouseover', function() {
      dance(this)
    })
    setInterval(function() {
      dance(sample(rects_arr))
    }, 1500)
  })

function dance(a) {
  if (contains(active, a)) return
  active.push(a)

  var remain = rects_arr.filter(function(r) {
    return !contains(active, r)
  })
  var b = sample(remain)
  active.push(b)

  d3
    .selectAll([a, b])
    .data([b.__data__, a.__data__])
    .transition()
    .ease('cubic-out')
    .duration(1000)
    .attr('x', function(d) {
      return d.x
    })
    .attr('y', function(d) {
      return d.y
    })
    .call(complete, function() {
      active = active.filter(function(r) {
        return r !== a && r !== b
      })
    })
}
