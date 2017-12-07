import queue from 'd3-queue'
import * as topojson from 'topojson'

var margin = {
  top: 20,
  right: 40,
  bottom: 50,
  left: 40,
},
  width = 660 - margin.left - margin.right,
  height = 340 - margin.top - margin.bottom

var restart_btn = d3.select('#restart-usa-scatter'),
  viz_complete

var x = d3.scale.linear().range([0, width])

var y = d3.scale.linear().range([height, 0])

var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(d3.format('.0%'))

var yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(d3.format('$s'))

var projection = d3.geo
  .albersUsa()
  .scale(700)
  .translate([width / 2, height / 2])

var path = d3.geo.path().projection(projection)

var svg = d3
  .select('#viz-usa-to-scatter .svg-holder')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .call(responsivefy)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

queue()
  .defer(d3.json, '/assets/data/us-new.json')
  .defer(d3.tsv, '/assets/data/us-state-info.tsv')
  .await(ready)

function ready(error, us_geo, census_data) {
  var data = munge_data(us_geo, census_data),
    axes,
    dots

  restart_btn.on('click', restart)

  run()

  function run() {
    viz_complete = false

    svg
      .append('g')
      .attr('class', 'states')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', function(d) {
        return d.d0
      })

    axes = svg.append('g').attr('class', 'axes')

    dots = svg.append('g').attr('class', 'dots')

    setTimeout(function() {
      morph()
    }, 1500)
  }

  function morph() {
    svg
      .selectAll('.state')
      .transition()
      .duration(750)
      .delay(function(d, i) {
        return i * 30
      })
      .style('fill', '#0076df')
      .attr('d', function(d) {
        return d.d1
      })
      .each('end', path_to_circle)
  }

  function path_to_circle(d, i) {
    var el = d3.select(this),
      datum = el.datum(),
      bb = el.node().getBBox()

    var cx = bb.x + bb.width / 2,
      cy = bb.y + bb.height / 2

    var dot = dots
      .datum(datum)
      .append('g')
      .attr('class', 'dot')
      .attr('transform', 'translate(' + cx + ',' + cy + ')')

    dot.append('circle').attr('r', 8).style('stroke-width', 1e-6)

    dot
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('opacity', 1e-6)
      .text(function(d) {
        return d.info.code
      })

    el.remove()

    if (i == 50) {
      setTimeout(function() {
        scatter()
      }, 1000)
    }
  }

  function scatter() {
    x
      .domain(
        d3.extent(data, function(d) {
          return d.info.edu
        })
      )
      .nice()

    y
      .domain(
        d3.extent(data, function(d) {
          return d.info.money
        })
      )
      .nice()

    axes
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text("Bachelor's degree or higher")

    axes
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('x', 6)
      .attr('dy', '.35em')
      .text('Mean earnings')

    svg
      .append('text')
      .attr('class', 'footnote')
      .attr('x', 0)
      .attr('y', height + margin.bottom - 10)
      .text('Source: American Community Survey, 2014 5-Year Estimate')

    var t = svg.transition().duration(1500)

    t.selectAll('.dot').attr('transform', function(d) {
      return 'translate(' + x(d.info.edu) + ',' + y(d.info.money) + ')'
    })

    t.selectAll('.dot text').style('opacity', 1)

    t.selectAll('.dot circle').style('stroke-width', '1px')

    viz_complete = true
  }

  function restart() {
    if (viz_complete) {
      svg.selectAll('.states, .axes, .dots, .footnote').remove()
      run()
    }
  }
}

function munge_data(us, stats) {
  var state_info = {}

  stats.forEach(function(d) {
    state_info[d.id] = {
      code: d.code,
      name: d.name,
      pop: +d.population,
      edu: +d.bach_degree_plus / 100,
      money: +d.mean_earnings,
    }
  })

  var geo_by_state = topojson.feature(us, us.objects.states).features,
    data = []

  geo_by_state.forEach(function(d) {
    if (d.id != '72' && d.id != '78') {
      var max_area = 0,
        winner

      d.geometry.coordinates.forEach(function(polygon) {
        var feature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: polygon,
          },
        }

        var area = path.area(feature)

        if (area > max_area) {
          winner = polygon
          max_area = area
        }
      })

      var max_pts = 0,
        winner_coords

      winner.forEach(function(coords) {
        if (coords.length > max_pts) {
          winner_coords = coords
          max_pts = coords.length
        }
      })

      var coordinates0 = winner_coords.map(projection),
        coordinates1 = circle(coordinates0),
        d0 = 'M' + coordinates0.join('L') + 'Z',
        d1 = 'M' + coordinates1.join('L') + 'Z'

      var entry = {
        id: d.id,
        coordinates0: coordinates0,
        coordinates1: coordinates1,
        d0: d0,
        d1: d1,
        info: state_info[d.id],
      }

      data.push(entry)
    }
  })

  return data
}

function circle(coordinates) {
  var circle = [],
    length = 0,
    lengths = [length],
    polygon = d3.geom.polygon(coordinates),
    p0 = coordinates[0],
    p1,
    x,
    y,
    i = 0,
    n = coordinates.length

  // Compute the distances of each coordinate.
  while (++i < n) {
    p1 = coordinates[i]
    x = p1[0] - p0[0]
    y = p1[1] - p0[1]
    lengths.push((length += Math.sqrt(x * x + y * y)))
    p0 = p1
  }

  var area = polygon.area(),
    // radius = Math.sqrt(Math.abs(area) / Math.PI),
    radius = 8,
    centroid = polygon.centroid(-1 / (6 * area)),
    angleOffset = -Math.PI / 2, // TODO compute automatically
    angle,
    i = -1,
    k = 2 * Math.PI / lengths[lengths.length - 1]

  // Compute points along the circle’s circumference at equivalent distances.
  while (++i < n) {
    angle = angleOffset + lengths[i] * k
    circle.push([
      centroid[0] + radius * Math.cos(angle),
      centroid[1] + radius * Math.sin(angle),
    ])
  }

  return circle
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
