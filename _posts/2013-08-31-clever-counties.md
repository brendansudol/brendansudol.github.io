---
layout:     post
title:      Clever counties
date:       2013-09-01
js:
  - d3
  - cleverCounties
---

It's been too long since I played around with d3.js. So I decided to get some US
Census data and make a little visualization.

I was curious about what areas of the country have the highest (and lowest)
college degree density. Fortunately, [Census Quickfacts][census] reports that
down to the county level (along with having tons of other interesting stats).

It turns out that nationally, about 28% of people over 25 have a bachelor's
degree or higher. But there is a lot of fluctuation on the county level, from a
low of 4% (Issaquena County, MS) to a high of 72% (Falls Church City, VA).
Virginia represent!

Use the slider below to explore more; you can hover over the map to see how
individual counties stack up. All d3 code used below is [here][code].

<div id="viz-clever-counties">
  <div>
    >= <span id='inputVal' class='bold'>0%</span> (of county population with bach. degree)
  </div>
  <input type="range" value="0" min="0" max="72" step="1" id="smartz-input"/>
  <div>
    <span id='numCounties' class='bold'>3,195</span> / 3,195 counties (<span id='countyPercent' class='bold'>100%</span>)
  </div>
  <div class='county-info mt1'>
    <span id='countySelected'></span>&nbsp;
  </div>
  <div class="svg-holder">
  </div>
</div>

[census]: http://quickfacts.census.gov/qfd/download_data.html
[code]: https://gist.github.com/brendansudol/6407704
