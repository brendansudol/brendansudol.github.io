---
layout:     post
title:      Responsive D3.js
date:       2014-11-30
js:
  - d3
  - responsiveD3
---

The only thing better than a nice, interactive D3 widget is one that's mobile
friendly. There are a variety of ways (using Javascript / CSS) to achieve this
responsiveness. Here's the way I do it when I'm making a visualization (no
jQuery required):

{% highlight javascript %}
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}
{% endhighlight %}

You can call this function when you add your SVG element to the page:

{% highlight javascript %}
d3.select("#viz").append("svg")
    .attr("width", 960)
    .attr("height", 500)
    .call(responsivefy);
{% endhighlight %}

And for completeness, here's a working example with a randomly updating donut
chart — try shrinking your browser window to see it adapt :)

<div id="viz-responsive-demo">
</div>
