---
layout:     post
title:      EPL standings scenarios
date:       2015-09-22
js:
  - d3
  - eplStandings
---

Football season is now underway and I couldn't be happier. And of course I'm
talking about the English Premier League. However, one thing that bugs me at the
start of seasons is when pundits make seemingly crazy extrapolations about final
league standings when there's so much football still to be played. It seemed
like people were already crowning Man City after week 5, and Chelsea has been
completely dismissed after an (admittedly) awful start.

I wanted to see how fair these prognostications were, so I compiled some data
and made a little scenario calculator. It's very simple. You input how many
games have been played so far and your team's current position in the table (or
their number of points or the number of points between them and the top of the
table). Then you select where you hope for them to finish and it will tell you
how often a team in that situation has gone on to achieve that final result over
the last 20 years (1995-2015). Give it a whirl:

<div class="epl-scenarios-cntnr p2 mb3 h6 border rounded">
  <div class="epl-query mb3">
    <form class="epl-form mb2" data-type="rank">
      How often has a team ranked...<br>
      <select name="rank" class="field">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7" selected>7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
      </select>
      after 
      <input name="games" type="number" class="field" min="1" max="38" value="5" required>
      games finished
      <select name="finish" class="field">
        <option value="1">1st</option>
        <option value="top-2">Top 2</option>
        <option value="top-4">Top 4</option>
        <option value="bottom-3">Bottom 3</option>
      </select>
      <button class="btn btn-primary" type="submit">Go</button>
    </form>
    <div class="epl-results" id="rank-results"></div>
  </div>

  <div class="epl-query mb3">
    <form class="epl-form mb2" data-type="points">
      How often has a team with...<br>
      <input name="points" type="number" class="field" min="0" value="8" required>
      points after
      <input name="games" type="number" class="field" min="1" max="38" value="6" required>
      games finished
      <select name="finish" class="field">
        <option value="1">1st</option>
        <option value="top-2">Top 2</option>
        <option value="top-4" selected>Top 4</option>
        <option value="bottom-3">Bottom 3</option>
      </select>
      <button class="btn btn-primary" type="submit">Go</button>
    </form>
    <div class="epl-results" id="points-results"></div>
  </div>

  <div class="epl-query mb3">
    <form class="epl-form mb2" data-type="points-behind">
      How often has a team that's...<br>
      <input name="points_behind" type="number" class="field" min="0" value="12" required>
      points off lead with 
      <input name="games_left" type="number" class="field" min="1" max="38" value="20" required>
      games left finished
      <select name="finish" class="field">
        <option value="1">1st</option>
        <option value="top-2">Top 2</option>
        <option value="top-4">Top 4</option>
        <option value="bottom-3">Bottom 3</option>
      </select>
      <button class="btn btn-primary" type="submit">Go</button>
    </form>
    <div class="epl-results" id="points-behind-results"></div>
  </div>
</div>

A couple observations:

* Chelsea has a ton of work to do this season — only 3 teams with 7 points in
  their first 6 games have finished in the top 4 (and no one has finished higher
  than 3rd).
* No team has ever won the league after falling behind the leader by 13 points
  or more, although 2 teams (in 20 years) have overcome a 10 point deficient
  halfway through the season to win it all (Man U in 1996 and Arsenal in 1998).

If you're curious about the nitty-gritty data details, my IPython notebook is
[here][notebook] and the final, cleaned dataset is [here][data].

[statto]: http://www.statto.com/football/stats/england/premier-league
[notebook]: https://github.com/brendansudol/epl-weekly-standings/blob/master/ipy-notebooks/main.ipynb
[data]: https://github.com/brendansudol/epl-weekly-standings/blob/master/output/1995-2015-epl-weekly-standings.tsv
