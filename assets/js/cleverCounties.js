import queue from 'd3-queue'
import * as topojson from 'topojson'

var width = 660,
  height = 460

var edById = {},
  nameById = {}

var formatNum = d3.format(',.0f'),
  formatPercent = d3.format(',.0%')

var projection = d3.geo.albersUsa().scale(850).translate([330, 220])

var path = d3.geo.path().projection(projection)

var svg = d3
  .select('#viz-clever-counties .svg-holder')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)

var inputVal = d3.select('#inputVal'),
  numCounties = d3.select('#numCounties'),
  countyPercent = d3.select('#countyPercent'),
  countySelected = d3.select('#countySelected')

queue()
  .defer(d3.json, '/assets/data/us.json')
  .defer(d3.tsv, '/assets/data/census-data.tsv')
  .await(ready)

function ready(error, us, census) {
  census.forEach(function(d) {
    edById[d.fips] = +d.EDU685211
    nameById[d.fips] = d.location.replace(';', ',')
  })

  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', path)
    .on('mouseover', displayCountyNums)
    .on('mouseout', function() {
      countySelected.text('')
    })

  svg
    .append('path')
    .datum(
      topojson.mesh(us, us.objects.states, function(a, b) {
        return a.id !== b.id
      })
    )
    .attr('class', 'states')
    .attr('d', path)
}

d3.select('#smartz-input').on('change', updateMap)

function updateMap() {
  var val = +this.value,
    num_counties = d3.entries(edById).filter(d => d.value >= val).length,
    county_percent = num_counties / 3195.0

  inputVal.text(val + '%')
  numCounties.text(formatNum(num_counties))
  countyPercent.text(formatPercent(county_percent))

  svg.selectAll('.counties path').style('fill', function(d) {
    return edById[d.id] >= val ? 'steelblue' : '#ccc'
  })
}

function displayCountyNums() {
  var d = this.__data__

  if (nameById[d.id] != undefined) {
    countySelected.text(nameById[d.id] + ': ' + formatNum(edById[d.id]) + '%')
  }
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
