// select grouped radio button (since i couldn't seem to do it in markdown)
d3.select('input[value="grouped"]').property('checked', true)

var data = [
  [
    { x: 'A', y: 1102, z: 'Brazil' },
    { x: 'B', y: 1507, z: 'Spain' },
    { x: 'C', y: 1200, z: 'Columbia' },
    { x: 'D', y: 1132, z: 'Uruguay' },
    { x: 'E', y: 1113, z: 'Switzerland' },
    { x: 'F', y: 1251, z: 'Argentina' },
    { x: 'G', y: 1318, z: 'Germany' },
    { x: 'H', y: 1098, z: 'Belgium' },
  ],
  [
    { x: 'A', y: 971, z: 'Croatia' },
    { x: 'B', y: 1106, z: 'Netherlands' },
    { x: 'C', y: 1055, z: 'Greece' },
    { x: 'D', y: 1120, z: 'Italy' },
    { x: 'E', y: 893, z: 'France' },
    { x: 'F', y: 886, z: 'Bosnia-Herz.' },
    { x: 'G', y: 1172, z: 'Portugal' },
    { x: 'H', y: 870, z: 'Russia' },
  ],
  [
    { x: 'A', y: 892, z: 'Mexico' },
    { x: 'B', y: 1014, z: 'Chile' },
    { x: 'C', y: 918, z: 'Ivory Coast' },
    { x: 'D', y: 1041, z: 'England' },
    { x: 'E', y: 852, z: 'Ecuador' },
    { x: 'F', y: 710, z: 'Nigeria' },
    { x: 'G', y: 1019, z: 'United States' },
    { x: 'H', y: 800, z: 'Algeria' },
  ],
  [
    { x: 'A', y: 612, z: 'Cameroon' },
    { x: 'B', y: 564, z: 'Australia' },
    { x: 'C', y: 638, z: 'Japan' },
    { x: 'D', y: 738, z: 'Costa Rica' },
    { x: 'E', y: 688, z: 'Honduras' },
    { x: 'F', y: 650, z: 'Iran' },
    { x: 'G', y: 849, z: 'Ghana' },
    { x: 'H', y: 577, z: 'Korea' },
  ],
]

var n = data.length, // teams per group
  m = data[0].length, // # of groups
  labelOffset = 12, // to better align label within bar
  stack = d3.layout.stack(),
  layers = stack(data),
  yGroupMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d.y
    })
  }),
  yStackMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d.y0 + d.y
    })
  })

var margin = { top: 30, right: 10, bottom: 30, left: 57 },
  width = 660 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom

var x = d3.scale
  .ordinal()
  .domain(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
  .rangeRoundBands([0, width], 0.08)

var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0])

var color = d3.scale
  .linear()
  .domain([500, 1000, 1500])
  .range(['#74c476', '#31a354', '#006d2c'])

var xAxis = d3.svg.axis().scale(x).tickSize(0).tickPadding(6).orient('bottom')

var yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(d3.format(',.0f'))

var svg = d3
  .select('#viz-world-cup .svg-holder')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .call(responsivefy)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var layer = svg
  .selectAll('.layer')
  .data(layers)
  .enter()
  .append('g')
  .attr('class', 'layer')

// initial grouped bars
var rect = layer
  .selectAll('rect')
  .data(function(d) {
    return d
  })
  .enter()
  .append('rect')
  .attr('x', function(d) {
    return x(d.x)
  })
  .attr('y', height)
  .attr('width', x.rangeBand())
  .attr('height', 0)
  .style('fill', function(d, i) {
    return color(d.y)
  })

rect
  .transition()
  .duration(500)
  .delay(function(d, i) {
    return i * 10
  })
  .attr('x', function(d, i, j) {
    return x(d.x) + x.rangeBand() / n * j
  })
  .attr('width', x.rangeBand() / n)
  .transition()
  .attr('y', function(d) {
    return y(d.y)
  })
  .attr('height', function(d) {
    return height - y(d.y)
  })

// labels for each team (for grouped view)
var labels = layer
  .selectAll('text')
  .data(function(d) {
    return d
  })
  .enter()
  .append('text')
  .attr('class', 'team')
  .attr('transform', 'rotate(-90)')
  .attr('x', function(d) {
    return -(y(d.y) + 3)
  })
  .attr('y', function(d, i, j) {
    return x(d.x) + labelOffset + x.rangeBand() / n * j
  })
  .style('text-anchor', 'end')
  .text(function(d) {
    return d.z
  })

// display axes
svg
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis)

svg
  .append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(-13,0)')
  .call(yAxis)
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .style('text-anchor', 'end')
  .text('FIFA Ranking')

// for toggling stack vs. group and sorting bars
d3.selectAll('input[type="radio"]').on('change', toggleBarViz)
d3.selectAll('input[type="checkbox"]').on('change', sortBars)

function toggleBarViz() {
  if (this.value === 'grouped') transitionGrouped()
  else transitionStacked()
}

function transitionGrouped() {
  updateAxis('grouped')

  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10
    })
    .attr('x', function(d, i, j) {
      return x(d.x) + x.rangeBand() / n * j
    })
    .attr('width', x.rangeBand() / n)
    .transition()
    .attr('y', function(d) {
      return y(d.y)
    })
    .attr('height', function(d) {
      return height - y(d.y)
    })

  labels.transition().duration(500).delay(500).style('opacity', 1)
}

function transitionStacked() {
  updateAxis('stacked')

  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10
    })
    .attr('y', function(d) {
      return y(d.y0 + d.y)
    })
    .attr('height', function(d) {
      return y(d.y0) - y(d.y0 + d.y)
    })
    .transition()
    .attr('x', function(d) {
      return x(d.x)
    })
    .attr('width', x.rangeBand())

  labels.transition().duration(500).style('opacity', 1e-6)
}

function updateAxis(viz) {
  y.domain(viz === 'grouped' ? [0, yGroupMax] : [0, yStackMax])

  svg.select('.y.axis').transition().duration(500).call(yAxis)
}

function sortBars() {
  var barsGrouped = d3.select('input[value="grouped"]').node().checked

  x.domain(
    this.checked
      ? ['G', 'B', 'D', 'C', 'A', 'E', 'F', 'H']
      : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  )

  var transition = svg.transition().duration(750),
    delay = function(d, i) {
      return i * 50
    }

  transition.selectAll('rect').delay(delay).attr('x', function(d, i) {
    return barsGrouped ? x(d.x) + x.rangeBand() / n * parseInt(i / m) : x(d.x)
  })

  transition.selectAll('.team').delay(delay).attr('y', function(d, i) {
    return x(d.x) + labelOffset + x.rangeBand() / n * parseInt(i / m)
  })

  transition.select('.x.axis').call(xAxis).selectAll('g').delay(delay)
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
