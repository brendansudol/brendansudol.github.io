---
layout:     post
title:      Google logo animation with D3.js
date:       2015-09-03
js:
  - d3
  - googleDots
---

Earlier this week, Google [unveiled][article] a new logo / identify. I'm a big
fan of it; it feels clean, modern, and just plain friendly.

![Google logo elements](/assets/img/writing/google-logo-elements.jpg){:
.bordered }

Along with the logotype, they've added some new elements to accomodate different
platforms and contexts. And they made an [awesome video][video] that animates
the new logo between the new states.

The video animation is beautiful, and I was inspired to try and recreate it (at
least in part) with code (using D3.js). For now, I just focused on the logotype
to dots transition; here's the result:

<div id="viz-google-dots">
  <div class="input-group">
    <label>
      <input type="radio" name="mode" value="letters" />
      Logotype
    </label>
    <label>
      <input type="radio" name="mode" value="dots" />
      Dots
    </label>
  </div>
  <div class="svg-holder center">
  </div>
</div>

It's nowhere near as cool and slick as the animation from the video, but it's
still pretty fun to toggle between the logotype and the dots. Curious about the
implementation? Here's the code that powers it:

<div class="long-code-block">
{% highlight javascript %}
// svg size / attribute eccentricities 
// when logotype png was converted to svg
var w = 1132,
    h = 372;

var svg = d3.select("#goog-viz .canvas").append('svg')
    .attr('class', 'logo')
    .attr('width', w)
    .attr('height', h)
    .attr('viewBox', "0 0 " + w + " " + h)
  .append("g")
    .attr('transform', '' +
        'translate(' + w / 2 + ', ' + h / 2 + ') ' +
        'scale(1, -1) ' +
        'translate(-' + w / 2 + ', -' + h / 2 + ') ' +
        'translate(0, 1)'
    );

var x = d3.scale.ordinal()
    .domain(d3.range(4)) // 4 dots
    .rangeRoundBands([0, w], 1);

var path = d3.svg.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

var timeout;

d3.json("/assets/data/google.json", function(data) {
    // add circle coordinates based on letter coordinates
    // and circle radii (note 2 letters essentially shrink to nothing)
    data.forEach(function(d) {
        d.circle_radius = d.circle >= 0 ? 50 : 1;
        d.circle_coords = compute_circle(d.letter_coords, d.circle_radius);
    });

    // add letters to page
    svg.selectAll('path')
        .data(data)
        .enter().append('path')
        .attr("class", function(d) { return d.color; })
        .attr("d", function(d) { return path(d.letter_coords); });

    // initial transition trigger
    timeout = setTimeout(function() {
        d3.select('input[value="dots"]')
            .property("checked", true).each(change);
    }, 2000);
});

// handle input changing
d3.selectAll("#goog-viz input").on("change", change);

function change() {
    clearTimeout(timeout);
    if (this.value === "dots") morph_to_dots();
    else morph_to_letters();
}

// letter to dot transition
function morph_to_dots() {
    var t = svg.transition().duration(500);

    t.selectAll('path')
        .attr("d", function(d) { return path(d.circle_coords); })
        .attr('transform', function(d, i) {
            var el = d3.select(this),
                bb = el.node().getBBox();

            var x_centroid = bb.x + bb.width / 2,
                y_centroid = bb.y + bb.height / 2;

            var x_new = d.circle >= 0 ? x(d.circle) - x_centroid : 0,
                y_new = (h / 2) - y_centroid;

            return "translate(" + x_new + ", " + y_new + ")";
        });
}

// dot to letter transition
function morph_to_letters() {
    var t = svg.transition().duration(500);

    t.selectAll('path')
        .attr('d', function(d) { return path(d.letter_coords); })
        .attr('transform', 'translate(0, 0)');
}

// use coordinates of existing path element to 
// compute circle coordinates for shape tweening
function compute_circle(coordinates, r) {
    var circle = [],
        length = 0,
        lengths = [length],
        polygon = d3.geom.polygon(coordinates),
        p0 = coordinates[0],
        p1,
        x,
        y,
        i = 0,
        n = Math.min(250, coordinates.length);

    // Compute the distances of each coordinate.
    while (++i < n) {
        p1 = coordinates[i];
        x = p1[0] - p0[0];
        y = p1[1] - p0[1];
        lengths.push(length += Math.sqrt(x * x + y * y));
        p0 = p1;
    }

    var area = polygon.area(),
        radius = r || 50,
        centroid = polygon.centroid(-1 / (6 * area)),
        angleOffset = -Math.PI / 2,
        angle,
        i = -1,
        k = 2 * Math.PI / lengths[lengths.length - 1];

    // Compute points along the circle’s 
    // circumference at equivalent distances.
    while (++i < n) {
        angle = angleOffset + lengths[i] * k;
        circle.push([
            centroid[0] + radius * Math.cos(angle),
            centroid[1] + radius * Math.sin(angle)
        ]);
    }

    return circle;
}

// custom path interpolator that transitions 
// nicely when path data is of different sizes
// thanks to: http://stackoverflow.com/a/14330503
d3.interpolators.push(function(a, b) {
    var isPath, isArea, interpolator, ac, bc, an, bn, d;

    function fill(value, length) {
        return d3.range(length).map(function() {
            return value;
        });
    }

    function extractCoordinates(path) {
        return path.substr(1, path.length - (isArea ? 2 : 1)).split('L');
    }

    function makePath(coordinates) {
        return 'M' + coordinates.join('L') + (isArea ? 'Z' : '');
    }

    function bufferPath(p1, p2) {
        var d = p2.length - p1.length;

        if (isArea) {
            return fill(p1[0], d / 2).concat(p1, fill(p1[p1.length - 1], d / 2));
        } else {
            return fill(p1[0], d).concat(p1);
        }
    }

    isPath = /M-?\d*\.?\d*,-?\d*\.?\d*(L-?\d*\.?\d*,-?\d*\.?\d*)*Z?/;

    if (isPath.test(a) && isPath.test(b)) {
        isArea = a[a.length - 1] === 'Z';
        ac = extractCoordinates(a);
        bc = extractCoordinates(b);
        an = ac.length;
        bn = bc.length;

        if (an > bn) bc = bufferPath(bc, ac);
        if (bn > an) ac = bufferPath(ac, bc);

        interpolator = d3.interpolateString(
            bn > an ? makePath(ac) : a,
            an > bn ? makePath(bc) : b
        );

        return bn > an ? interpolator : function(t) {
            return t === 1 ? b : interpolator(t);
        };
    }
});
{% endhighlight %}
</div>

[article]: https://design.google.com/articles/evolving-the-google-identity/
[video]: https://g-design.storage.googleapis.com/production/v5/assets/g-header.mp4
