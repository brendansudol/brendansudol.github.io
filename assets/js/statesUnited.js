import queue from 'd3-queue'
import * as topojson from 'topojson'

var width = 500,
  height = 500

var projection = d3.geo
  .albersUsa()
  .scale(1280)
  .translate([width / 2, height / 2])

var path = d3.geo.path().projection(projection)

var svg = d3
  .select('#viz-states-united')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)

// for dropshadow effect (applied to states)

var defs = svg.append('defs')
defs.node().appendChild(d3.select('#viz-shadow').node())

// rainbow

var π = Math.PI,
  τ = 2 * π,
  n = 40

svg
  .append('g')
  .attr('class', 'rainbow-circle')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
  .selectAll('path')
  .data(d3.range(0, τ, τ / n))
  .enter()
  .append('path')
  .attr(
    'd',
    d3.svg
      .arc()
      .outerRadius(width)
      .startAngle(function(d) {
        return d
      })
      .endAngle(function(d) {
        return d + τ / n * 1.1
      })
  )
  .style('fill', function(d) {
    return d3.hsl(d * 360 / τ, 1, 0.5)
  })

// text holder for state name (when hovered on)

var label = svg
  .append('text')
  .attr('class', 'state-label')
  .attr('x', width / 2)
  .attr('y', 60)

// united states heart

var states,
  heart_info = {}

queue()
  .defer(d3.json, '/assets/data/us-geo.json')
  .defer(d3.tsv, '/assets/data/us-states-heart.tsv')
  .await(ready)

function ready(error, us, heart) {
  states = topojson.feature(us, us.objects.states).features
  states = states.filter(function(d) {
    return d.id != '72' && d.id != '78'
  })

  heart.forEach(function(d) {
    heart_info[+d.id] = {
      state_id: d.code,
      state_name: d.name,
      x_pos: +d.pos_x_adj,
      y_pos: +d.pos_y_adj,
      rotate: +d.rotate * -1,
    }
  })

  svg
    .append('g')
    .attr('class', 'states-united')
    .attr('transform', 'translate(60,60)')
    .selectAll('.state')
    .data(states)
    .enter()
    .append('path')
    .each(function(d) {
      var bounds = path.bounds(d),
        x_origin = -bounds[0][0],
        y_origin = -bounds[0][1],
        area1 = d3.geo.area(d),
        area2 = path.area(d),
        s = Math.sqrt(area1 / area2) * 500,
        h = heart_info[d.id]

      // adjust for alaska 0.35 scale factor in albersUsa projection
      if (h.state_id == 'AK') {
        h.x_pos = h.x_pos * 0.35
        h.y_pos = h.y_pos * 0.35
      }

      d3
        .select(this)
        .attr('class', 'state')
        .attr('id', h.state_id)
        .attr('transform', function(d) {
          return (
            '' +
            'scale(' +
            s +
            ') ' +
            'rotate(' +
            [h.rotate, h.x_pos, h.y_pos] +
            ') ' +
            'translate(' +
            [h.x_pos, h.y_pos] +
            ')' +
            'translate(' +
            [x_origin, y_origin] +
            ') '
          )
        })
        .attr('d', path)
        .on('mouseover', function(d) {
          label.text(heart_info[d.id].state_name)
        })
        .on('mouseout', function() {
          label.text('')
        })
    })
}

// for making viz responsive

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
