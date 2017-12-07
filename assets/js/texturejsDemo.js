import 'd3-geo-projection/d3.geo.projection'
import * as topojson from 'topojson'
import textures from 'textures'

var orange = '#ff8c00',
  navy = '#0d3268'

// defined textures
var t1 = textures.lines().orientation('6/8').stroke(orange).background(navy)

var t2 = textures.lines().heavier().stroke(navy).background(orange)

var t3 = textures
  .lines()
  .orientation('vertical', 'horizontal')
  .size(4)
  .strokeWidth(1)
  .shapeRendering('crispEdges')
  .stroke(orange)
  .background('#fff')

var t4 = textures.lines().size(4).stroke(navy).strokeWidth(1).background('#fff')

var t5 = textures.circles().size(10).radius(1.5).fill(orange).background(navy)

var t6 = textures.circles().fill(navy).background(orange)

var t7 = textures.paths().d('waves').thicker().stroke(orange).background(navy)

// add all textures to an array
var tlist = [t1, t2, t3, t4, t5, t6, t7]

var width = 960,
  height = 547

var projection = d3.geo
  .patterson()
  .scale(153)
  .translate([width / 2, height / 2])
  .precision(0.1)

var path = d3.geo.path().projection(projection)

var graticule = d3.geo.graticule()

var svg = d3
  .select('#viz-texturejs-demo')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)

// invoke all the texture functions on svg selector
tlist.forEach(function(t) {
  svg.call(t)
})

// shuffle up textures so continents will get
// a random pattern on each page load
tlist = d3.shuffle(tlist)

var continents = [
  'Antarctica',
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
]

// add map coordinate grid
svg
  .append('path')
  .datum(graticule)
  .attr('class', 'graticule line')
  .attr('d', path)

svg
  .append('path')
  .datum(graticule.outline)
  .attr('class', 'graticule outline')
  .attr('d', path)

d3.json('/assets/data/world.json', function(error, world) {
  var countries = topojson.feature(world, world.objects.countries)

  // group countries into continent collections
  var data = []
  continents.forEach(function(continent) {
    var datum = {
      id: continent,
      type: 'FeatureCollection',
      features: countries.features.filter(function(d) {
        return d.properties.continent == continent
      }),
    }
    data.push(datum)
  })

  // draw the continents and give each a diff texture
  svg
    .selectAll('.continent')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'continent')
    .attr('d', path)
    .style('fill', function(d, i) {
      return tlist[i].url()
    })
})

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
