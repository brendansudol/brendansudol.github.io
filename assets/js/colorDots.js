var width = 660,
  height = 600

var color = d3.scale
  .linear()
  .domain([0, width / 4, width / 4 * 2, width / 4 * 3, width])
  .range(['#fb000f', '#6e00fb', '#00fbec', '#8dfb00', '#fb3c00'])
  .interpolate(d3.interpolateHsl)

var svg = d3
  .select('#viz-color-dots')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(responsivefy)
  .on('mousemove', mousemove)

var data = d3.range(320)

svg
  .selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d, i) {
    return (i % 20) * 38 + 10
  })
  .attr('cy', function(d, i) {
    return Math.floor(i / 20) * 38 + 10
  })
  .attr('r', 3)
  .style('fill', function(d, i) {
    return d3
      .rgb(color((i % 20) * 38 + 10))
      .darker(Math.floor(i / 20) * (1 / 4))
      .toString()
  })
  .transition()
  .duration(1500)
  .attr('r', 18.5)
  .each('end', function() {
    d3
      .select(this)
      .transition()
      .duration(1500)
      .attr('r', 3)
  })

function mousemove() {
  var m = d3.mouse(this),
    x = m[0],
    y = m[1]

  svg
    .append('circle')
    .transition()
    .duration(0)
    .attr('r', 10)
    .attr('transform', 'translate(' + x + ',' + y + ')scale(2)')
    .style(
      'fill',
      d3
        .rgb(color(x))
        .darker(d3.max([0, y - 10]) / width * 3.75)
        .toString()
    )
    .each('end', function() {
      d3
        .select(this)
        .transition()
        .duration(1500)
        .attr(
          'transform',
          'translate(' +
            (x +
              (Math.round(Math.random() * 1) * 2 - 1) *
                Math.floor(Math.random() * 60 + 1)) +
            ',' +
            (y +
              (Math.round(Math.random() * 1) * 2 - 1) *
                Math.floor(Math.random() * 60 + 1)) +
            ')'
        )
        .attr('r', 1e-6)
        .remove()
    })
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
