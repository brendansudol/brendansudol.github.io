// goal diff slider
var g_diff_slider = d3.select('#g-diff-input')
var g_diff_val = d3.select('#g-diff-val')

// select grouped radio button (since i couldn't seem to do it in markdown)
d3.select('input[value="Home"]').property('checked', true)

var formatNum = d3.format(',.0f'),
  formatPercent = d3.format('.0%'),
  formatPercentOne = d3.format('.1%')

var minute_selected = 45

var margin = {
  top: 20,
  right: 80,
  bottom: 40,
  left: 50,
},
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

// Add path interpolator to d3 for nicer
// transitioning for different sized datasets
// thanks to: http://stackoverflow.com/a/14330503
d3.interpolators.push(function(a, b) {
  var isPath, isArea, interpolator, ac, bc, an, bn, d

  // Create a new array of a given length and fill it with the given value
  function fill(value, length) {
    return d3.range(length).map(function() {
      return value
    })
  }

  // Extract an array of coordinates from the path string
  function extractCoordinates(path) {
    return path.substr(1, path.length - (isArea ? 2 : 1)).split('L')
  }

  // Create a path from an array of coordinates
  function makePath(coordinates) {
    return 'M' + coordinates.join('L') + (isArea ? 'Z' : '')
  }

  // Buffer the smaller path with coordinates at the same position
  function bufferPath(p1, p2) {
    var d = p2.length - p1.length

    if (isArea) {
      return fill(p1[0], d / 2).concat(p1, fill(p1[p1.length - 1], d / 2))
    } else {
      return fill(p1[0], d).concat(p1)
    }
  }

  isPath = /M-?\d*\.?\d*,-?\d*\.?\d*(L-?\d*\.?\d*,-?\d*\.?\d*)*Z?/

  if (isPath.test(a) && isPath.test(b)) {
    isArea = a[a.length - 1] === 'Z'
    ac = extractCoordinates(a)
    bc = extractCoordinates(b)
    an = ac.length
    bn = bc.length

    if (an > bn) {
      bc = bufferPath(bc, ac)
    }

    if (bn > an) {
      ac = bufferPath(ac, bc)
    }

    // Create an interpolater with the buffered paths (if both paths are of the same length,
    // the function will end up being the default string interpolator)
    interpolator = d3.interpolateString(
      bn > an ? makePath(ac) : a,
      an > bn ? makePath(bc) : b
    )

    // If the ending value changed, make sure the final interpolated value is correct
    return bn > an
      ? interpolator
      : function(t) {
          return t === 1 ? b : interpolator(t)
        }
  }
})

var x = d3.scale.linear().domain([0, 95]).range([0, width])

var y = d3.scale.linear().domain([0, 1]).range([height, 0])

var color = d3.scale.ordinal().range(['#3498db', '#e74c3c', '#2ecc71'])

var xAxis = d3.svg.axis().scale(x).orient('bottom')

var yAxis = d3.svg
  .axis()
  .scale(y)
  .tickSize(-width)
  .orient('left')
  .tickFormat(formatPercent)

var line = d3.svg
  .line()
  .x(function(d) {
    return x(d.time)
  })
  .y(function(d) {
    return y(d.prob)
  })

var bisectX = d3.bisector(function(d) {
  return d.time
}).left

var svg = d3
  .select('#viz-soccer-outcomes .svg-holder')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .call(responsivefy)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv('/assets/data/soccer-outcome-probs.csv', function(error, data) {
  // get input values and filter to appropriate data
  var inputs = get_inputs(),
    data_selected = filter_data(inputs.g_diff, inputs.side)

  // add axes
  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('x', width)
    .attr('y', 30)
    .style('text-anchor', 'end')
    .text('Minute')

  svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -42)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Probability')

  // add initial prob lines
  var outcome = svg
    .selectAll('.outcome')
    .data(data_selected)
    .enter()
    .append('g')
    .attr('class', 'outcome')

  outcome
    .append('path')
    .attr('class', 'line')
    .attr('d', function(d) {
      return line(d.values)
    })
    .style('stroke', function(d) {
      return color(d.result)
    })

  // for hover functionality...
  var focus = svg
    .append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + x(minute_selected) + ',0)')

  focus.append('line').attr('y2', height)

  focus
    .append('text')
    .attr('y', -5)
    .style('text-anchor', 'middle')
    .text(minute_selected)

  svg
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', mousemove)

  // show win/lose/draw stats for a particular minute
  show_stats(minute_selected)

  // update chart if inputs changed
  d3.selectAll('input').on('change', change)

  // get values for goal-diff and side inputs
  function get_inputs() {
    var side_input = d3.select('input[name="side"]:checked')

    return {
      g_diff: parseInt(g_diff_slider.property('value')),
      side: side_input.property('value'),
    }
  }

  // filter & format data to win/lose/draw prob series
  // based on goal_diff and home/away side
  function filter_data(g_diff, side) {
    var MIN_GAMES = 5

    var outcomes = ['home', 'away', 'draw'],
      g_diff_adj = get_g_diff_adj(g_diff, side)

    var data_filtered = outcomes.map(function(outcome) {
      var result = get_result(outcome, side),
        prob_col = make_col(g_diff_adj, outcome),
        ct_col = make_col(g_diff_adj, 'tot_games')

      values = []
      data.forEach(function(d) {
        if (+d[ct_col] > MIN_GAMES) {
          values.push({
            time: d.time,
            prob: +d[prob_col],
            ct: +d[ct_col],
          })
        }
      })

      return {
        outcome: outcome,
        result: result,
        values: values,
      }
    })

    return data_filtered.sort((a, b) => a.result.localeCompare(b.result))
  }

  // as is, goal_diff is relative to home team
  // this normalizes goal_diff depending on chosen side
  function get_g_diff_adj(g_diff, side) {
    return side == 'Home' ? g_diff : g_diff * -1
  }

  // this transforms outcomes from home/away/draw
  // to win/lose/draw depending on chosen side
  function get_result(outcome, side) {
    var r = outcome
    if (outcome == 'home') {
      r = side == 'Home' ? 'win' : 'lose'
    } else if (outcome == 'away') {
      r = side == 'Home' ? 'lose' : 'win'
    }

    return r
  }

  // format column name so that it
  // matches output from pandas dataset
  function make_col(diff, name) {
    return '(' + diff + ".0, '" + name + "')"
  }

  // show minute level win/lose/draw probs
  function show_stats(minute) {
    var probs = get_minute_stats(minute),
      results = ['win', 'lose', 'draw']

    results.forEach(function(r) {
      var output = d3.select('#' + r + '-rate')

      output.text(function() {
        return probs[r] !== undefined ? formatPercentOne(probs[r]) : '-'
      })
    })

    ct_output = d3.select('#game-ct')
    ct_output.text(function() {
      return probs.ct && probs.ct > 0 ? formatNum(probs.ct) : '-'
    })
  }

  // fetch minute level stats based on inputs and minute
  function get_minute_stats(minute) {
    var probs = {}

    data_selected.forEach(function(d) {
      var output = d3.select('#' + d.result + '-rate')

      var d_min = d.values.filter(function(v) {
        return v.time == minute
      })

      if (d_min.length > 0) {
        probs[d.result] = d_min[0].prob
        probs.ct = d_min[0].ct
      }
    })

    return probs
  }

  // sub in new prob lines when inputs change
  function change() {
    inputs = get_inputs()
    data_selected = filter_data(inputs.g_diff, inputs.side)

    g_diff_val.text(inputs.g_diff)

    // update x domain (minutes)
    x.domain([
      d3.min(data_selected, function(d) {
        return d3.min(d.values, function(v) {
          return +v.time
        })
      }),
      95,
    ])

    var adj_min_selected = minute_selected < x.domain()[0]
      ? -100
      : minute_selected

    show_stats(adj_min_selected)
    update_min_line(adj_min_selected)

    svg.transition().duration(750).select('.x.axis').call(xAxis)

    var outcome = svg.selectAll('.outcome').data(data_selected)

    outcome.select('.line').transition().duration(750).attr('d', function(d) {
      return line(d.values)
    })
  }

  // update minute line and stat line on hover
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectX(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.time > d1.time - x0 ? d1 : d0

    minute_selected = d.time

    show_stats(minute_selected)
    update_min_line(minute_selected)
  }

  function update_min_line(minute) {
    focus.attr('transform', 'translate(' + x(minute) + ',0)')
    focus.select('text').text(minute)
  }
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
