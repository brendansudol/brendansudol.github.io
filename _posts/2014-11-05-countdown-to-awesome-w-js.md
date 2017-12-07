---
layout:     post
title:      Countdown with Javascript
date:       2014-11-05
js:
  - countdown
---

Have something memorable coming up? Want to keep track of it online and get
excited as the big day approaches?

Well I did, so I made a simple javascript function that does just that. It's in
pure javascript (no jQuery or other dependencies) and here's the output:

<div class="mb2" id="countdown">
</div>

To use it, you just specify the date you want to count down towards and the id
of the element in the DOM where it'll go. For example:

{% highlight javascript %} countdown("11-21-2014", "countdown"); {% endhighlight
%}

And here's the function you can drop into your site to power it:

{% highlight javascript %}
function countdown(date_str, el) {
    var ctdn = document.getElementById(el);

    var deadline = new Date(date_str),
        tz_offset = deadline.getTimezoneOffset() * 60 * 1000;

    function formatTime(d) {
        return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    function formatDay(d) {
        var days = Math.floor(+d / (24 * 60 * 60 * 1000));
        return days === 0 ? '' : days + (days > 1 ? ' days, ' : ' day, ');
    }

    function tick() {
        var now = new Date,
            d_diff = new Date(+deadline + tz_offset + -now);

        if (+d_diff < 0) return ctdn.innerHTML = 'boom';

        ctdn.innerHTML = formatDay(d_diff) + formatTime(d_diff);
        setTimeout(tick, 1000 - now % 1000);  
    }

    tick();
}
{% endhighlight %}

Happy counting down to awesome things :)
