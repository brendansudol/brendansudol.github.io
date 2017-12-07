---
layout:     post
title:      United States of Animation
date:       2015-04-19
js:
  - d3
  - usaToScatter
---

Made a little visualization that morphs the United States into a scatterplot:

<div class="mb2" id="viz-usa-to-scatter">
  <div class="svg-holder">
  </div>
  <button type="button" id="restart-usa-scatter">Restart animation</button>
</div>

I used [this example][bostock_ex] by Mike Bostock for the general shape tweening
technique. It took a bit of munging to apply this pattern to all 50 states
because several states are not just one connected polygon but also contain many
smaller non-contiguous pieces (e.g., Long Island in New York). To correct for
this and simplify the problem, I find and plot only the largest polygon in each
state and then interpolate these shapes into circles (if you look fast, you'll
see that Hawaii is missing a few of its islands...sorry, Maui!). Finally, I
replace the circle-shaped SVG paths with actual SVG circles and move them to
their proper scatterplot positions.

In the end, I think the animation is fun and pretty but I'm not sure it's very
meaningful in terms of enhancing understanding. Though if it peaks your interest
enough to look at the resulting chart, I think that's a win.

My code that produces the above visualization is [here][code].

[bostock_ex]: http://bl.ocks.org/mbostock/3081153
[code]: https://gist.github.com/brendansudol/16f4b48e771071c8c559
