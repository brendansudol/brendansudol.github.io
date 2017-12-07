---
layout:     post
title:      World Cup draw visualized
date:       2014-01-07
js:
  - d3
  - worldCupDraw
---

A couple of weeks ago, The Guardian put together a [nice set of charts][article]
around the 2014 World Cup draw. As a newly minted soccer enthusiast, it was fun
to go through and begin getting psyched about the summer. As a fan of data
visualization, I was begging for a bit more and better. Besides the
overabundance of pie charts, I thought it was missing some interactivity which
could have made several of the points stronger.

Take the 'Average strength of each group' graphic. It's a grouped bar chart of
FIFA rankings by team for each World Cup group, ordered alphabetically; and on
the right, it lists out (in text form) the average team ranking per group from
high to low to give you a better sense of overall group strength. I like the
grouped bars and the average team ranking metric, but I think an interactive
chart here could have made the same points and been more effective (and more
fun). For example:

<div id="viz-world-cup">
  <h4>2014 World Cup Draw - Strength of Groups</h4>
  <form>
    <label>
      <input type="radio" name="mode" value="grouped" />
      Grouped
    </label>
    <label>
      <input type="radio" name="mode" value="stacked" />
      Stacked
    </label>
    <label class='right'><input type="checkbox" />Sort groups</label>
  </form>
  <div class="svg-holder">
  </div>
</div>

You can toggle between the grouped and stacked bar displays and sort the groups
by avg. ranking or alphabetically. It could definitely still use refinement
(e.g., more info on demand when hovering over bars, y-axis gridlines, etc.), but
hopefully it's a good start. I made it with d3.js, and you can explore the code
that generates it [here][code].

A few key takeaways from the graphic:

* Spain has the highest ranking by far, and Group B has a crazy big skill
  spread, with the best (Spain) and worst (Australia) teams in it
* Group G is strong all around, which gives it the edge over B in terms of
  average team ranking per group (as seen in stacked view)
* Among the top three teams in a group, there's even more parity in Group D;
  Uruguay, Italy, and England are all within 100 points of each other
* Argentina (and Belgium) have fairly easy roads out of group stage

Can't wait for the games to get started in June. Go USA!

[article]: http://www.theguardian.com/football/interactive/2013/dec/18/world-cup-2014-draw-strength-of-schedule
[code]: https://gist.github.com/brendansudol/8311952
