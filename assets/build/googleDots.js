!function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var r={};n.m=t,n.c=r,n.d=function(t,r,e){n.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:e})},n.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(r,"a",r),r},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=7)}({7:function(t,n,r){"use strict";function e(){clearTimeout(i),"dots"===this.value?o():a()}function o(){s.transition().duration(500).selectAll("path").attr("d",function(t){return f(t.circle_coords)}).attr("transform",function(t,n){var r=d3.select(this),e=r.node().getBBox(),o=e.x+e.width/2,a=e.y+e.height/2;return"translate("+(t.circle>=0?d(t.circle)-o:0)+", "+(l/2-a)+")"})}function a(){s.transition().duration(500).selectAll("path").attr("d",function(t){return f(t.letter_coords)}).attr("transform","translate(0, 0)")}function c(t,n){for(var r,e,o,a=[],c=0,i=[c],u=d3.geom.polygon(t),l=t[0],s=0,d=Math.min(250,t.length);++s<d;)r=t[s],e=r[0]-l[0],o=r[1]-l[1],i.push(c+=Math.sqrt(e*e+o*o)),l=r;for(var f,h=u.area(),g=n||50,p=u.centroid(-1/(6*h)),v=-Math.PI/2,s=-1,m=2*Math.PI/i[i.length-1];++s<d;)f=v+i[s]*m,a.push([p[0]+g*Math.cos(f),p[1]+g*Math.sin(f)]);return a}var i,u=1132,l=372,s=d3.select("#viz-google-dots .svg-holder").append("svg").attr("class","logo").attr("width",u).attr("height",l).attr("viewBox","0 0 1132 "+l).append("g").attr("transform","translate(566, "+l/2+") scale(1, -1) translate(-566, -"+l/2+") translate(0, 1)"),d=d3.scale.ordinal().domain(d3.range(4)).rangeRoundBands([0,u],1),f=d3.svg.line().x(function(t){return t[0]}).y(function(t){return t[1]});d3.json("/assets/data/google.json",function(t){t.forEach(function(t){t.circle_radius=t.circle>=0?50:1,t.circle_coords=c(t.letter_coords,t.circle_radius)}),s.selectAll("path").data(t).enter().append("path").attr("class",function(t){return t.color}).attr("d",function(t){return f(t.letter_coords)}),i=setTimeout(function(){d3.select('input[value="dots"]').property("checked",!0).each(e)},2e3)}),d3.selectAll("#viz-google-dots input").on("change",e),d3.interpolators.push(function(t,n){function r(t,n){return d3.range(n).map(function(){return t})}function e(t){return t.substr(1,t.length-(i?2:1)).split("L")}function o(t){return"M"+t.join("L")+(i?"Z":"")}function a(t,n){var e=n.length-t.length;return i?r(t[0],e/2).concat(t,r(t[t.length-1],e/2)):r(t[0],e).concat(t)}var c,i,u,l,s,d,f;if(c=/M-?\d*\.?\d*,-?\d*\.?\d*(L-?\d*\.?\d*,-?\d*\.?\d*)*Z?/,c.test(t)&&c.test(n))return i="Z"===t[t.length-1],l=e(t),s=e(n),d=l.length,f=s.length,d>f&&(s=a(s,l)),f>d&&(l=a(l,s)),u=d3.interpolateString(f>d?o(l):t,d>f?o(s):n),f>d?u:function(t){return 1===t?n:u(t)}})}});