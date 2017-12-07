var width = 660,
  height = 340,
  radius = Math.min(width, height) / 2

var color = d3.scale.category20()

var data = d3.range(5).map(getRand)

var pie = d3.layout.pie().padAngle(0.02).sort(null)

var arc = d3.svg
  .arc()
  .innerRadius(radius - 40)
  .outerRadius(radius)
  .cornerRadius(20)

var svg = d3
  .select('#viz-responsive-demo')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

var path = svg
  .datum(data)
  .selectAll('path')
  .data(pie)
  .enter()
  .append('path')
  .attr('fill', function(d, i) {
    return color(i)
  })
  .attr('d', arc)
  .each(function(d) {
    this._current = d
  }) // store the initial angles

setInterval(function() {
  change()
}, 2000)

function change() {
  var new_data = d3.range(5).map(getRand)
  pie.value(function(d, i) {
    return new_data[i]
  }) // change the value function
  path = path.data(pie) // compute the new angles
  path.transition().duration(750).attrTween('d', arcTween) // redraw the arcs
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a)
  this._current = i(0)
  return function(t) {
    return arc(i(t))
  }
}

// returns random integer between min and max number
function getRand() {
  var min = 2,
    max = 5
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function responsivefy(svg) {
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width')),
    height = parseInt(svg.style('height')),
    aspect = width / height

  svg
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('perserveAspectRatio', 'xMinYMid')
    .call(resize)

  d3.select(window).on('resize.' + container.attr('id'), resize)

  function resize() {
    var targetWidth = parseInt(container.style('width'))
    svg.attr('width', targetWidth)
    svg.attr('height', Math.round(targetWidth / aspect))
  }
}
