import * as topojson from 'topojson'

var width = 660,
  height = 500

var boroughs = {
  36047: 'Brooklyn',
  36085: 'Staten Island',
  36061: 'Manhattan',
  36081: 'Queens',
  36005: 'The Bronx',
}
var surroundings = [
  ['New Jersey', [-74.143982, 40.853792]],
  ['Long Island', [-73.648224, 40.7387]],
]

var projection = d3.geo
  .mercator()
  .center([-73.96667, 40.78333])
  .scale(47000)
  .translate([310, 170])

var path = d3.geo.path().projection(projection)

var svg = d3
  .select('#viz-nyc')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)

d3.json('/assets/data/nyc.json', function(error, nyc) {
  var counties = topojson.feature(nyc, nyc.objects.counties).features
  var states = topojson.feature(nyc, nyc.objects.surrounding_states).features

  svg
    .selectAll('.state')
    .data(states)
    .enter()
    .append('path')
    .attr('class', function(d) {
      return 'state ' + d.id
    })
    .attr('d', path)

  svg
    .selectAll('.county')
    .data(counties)
    .enter()
    .append('path')
    .attr('class', function(d) {
      return 'county fips_' + d.id
    })
    .attr('d', path)

  svg
    .selectAll('.county-label')
    .data(counties)
    .enter()
    .append('text')
    .attr('class', 'county-label')
    .attr('transform', function(d) {
      return 'translate(' + path.centroid(d) + ')'
    })
    .attr('dy', '.35em')
    .text(function(d) {
      return boroughs[d.id]
    })

  svg
    .selectAll('.other-label')
    .data(surroundings)
    .enter()
    .append('text')
    .attr('class', 'other-label')
    .attr('transform', function(d) {
      return 'translate(' + projection(d[1]) + ')'
    })
    .text(function(d) {
      return d[0]
    })
})

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
