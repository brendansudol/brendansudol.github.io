---
layout:     post
title:      Colors with D3.js
date:       2013-07-14
js:
  - d3
  - colorDots
---

Etsy has a fun feature for [exploring products by color][colors]. You click on
your favorite shade in the grid, and then items of that color pop up.

How does it work? Every listing on Etsy is associated with a HSB color value,
defined by a hue value, a saturation level, and a brightness level. When you
select a color, we extract its HSB value, set a maximum and minimum range around
each component (color 'wiggle' room), and then select and show a random sample
of listings whose values fall within the correct range for hue, saturation and
brightness.

It also has a neat interactive animation as your mouse moves over the grid. Etsy
implements it with the javascript library [Raphael][raphael]. But I'm a huge fan
of [D3.js][d3], so I thought it'd be fun to recreate the grid and animation
effects with D3.

Check it out by moving your mouse over the grid below. Code is
<a href="https://gist.github.com/brendansudol/5995005" target="_blank">here</a>.

<div id="viz-color-dots">
</div>

[colors]: https://www.etsy.com/color.php
[raphael]: http://raphaeljs.com/
[d3]: http://d3js.org/
[gist]: https://gist.github.com/brendansudol/5995005
