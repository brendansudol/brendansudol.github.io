import $ from 'jquery'

var data_url = '/assets/data/1995-2015-epl-weekly-standings.tsv',
  format_percent = d3.format(',.0%'),
  epl_data

// load epl dataset, convert fields to numbers,
// then kick off filtering

d3.tsv(data_url, function(data) {
  data.forEach(function(d) {
    d.games = +d.games
    d.points = +d.points
    d.points_behind = +d.pts_from_lead
    d.rank = +d.rk
    d.final_rank = +d.final_rk
    d.final_points = +d.final_pts
  })

  epl_data = data

  $('.epl-form').submit()
})

// on form submission: get conditions, filter dataset,
// and show results

$('.epl-form').submit(function(e) {
  e.preventDefault()

  var $form = $(this)
  var id = $form.data('type')
  var conditions = get_inputs($form)
  var filtered = filter_dataset(conditions)
  var results = format_results(filtered)

  show_results(id, results)
})

// convert form data to object with input name key

function get_inputs(form) {
  var data = {}

  $.each(form.serializeArray(), function() {
    data[this.name] = this.value || ''
  })

  return data
}

// filter dataset based on form conditions

function filter_dataset(condits) {
  // teams that meet all conditions except for final ranking
  var possibles = epl_data.filter(function(d) {
    var keep = true

    var equal_fields = ['games', 'rank', 'points', 'points_behind']
    equal_fields.forEach(function(m) {
      if (condits[m]) keep = keep && d[m] == condits[m]
    })

    if (condits.games_left) {
      var games = 38 - condits.games_left
      keep = keep && d.games >= games
    }

    return keep
  })

  // now filtering for final ranking
  // (to enable success rate computation)
  var successes = possibles.filter(function(d) {
    var keep,
      finish = condits.finish

    if (!isNaN(parseInt(finish))) {
      keep = d.final_rank == finish
    } else {
      var parts = finish.split('-'),
        top_bottom = parts[0],
        rk = parts[1]

      if (top_bottom == 'top') {
        keep = d.final_rank <= rk
      } else {
        keep = d.final_rank >= 20 - rk
      }
    }

    return keep
  })

  return {
    possibles: possibles,
    successes: successes,
  }
}

// dedup results and format result entries

function format_results(filtered) {
  var results = {}

  d3.keys(filtered).forEach(function(k) {
    var entries = []
    filtered[k].forEach(function(d) {
      var entry =
        '' +
        '<li class="epl-result">' +
        d.team +
        ' (' +
        d.season +
        ') ' +
        'finished ' +
        ordinal(d.final_rank) +
        ' with ' +
        d.final_points +
        ' points' +
        '</li>'
      entries.push(entry)
    })
    results[k] = $.unique(entries)
  })

  return results
}

// add formatted results to page (under proper form)

function show_results(id, results) {
  var $div = $('#' + id + '-results')

  var p = results.possibles,
    s = results.successes

  var content

  if (!s.length) {
    content = 'No teams meet these conditions :('
  } else {
    content =
      s.length +
      ' of ' +
      p.length +
      ' (' +
      format_percent(s.length / p.length) +
      ')' +
      ' teams went on to achieve that outcome:'

    content += '<ul>' + s.join('') + '</ul>'
  }

  $div.empty().append(content)
}

// utility function to add ordinal suffix to numbers
// 1 -> 1st; 3 -> 3rd; 5 -> 5th

function ordinal(i) {
  var j = i % 10,
    k = i % 100

  if (j == 1 && k != 11) return i + 'st'
  if (j == 2 && k != 12) return i + 'nd'
  if (j == 3 && k != 13) return i + 'rd'
  return i + 'th'
}
