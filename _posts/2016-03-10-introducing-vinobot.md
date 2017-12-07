---
layout:     post
title:      Introducing Vinobot
date:       2016-03-10
---

I'd like to introduce my latest side project and first iPhone app, Vinobot:

![Vinobot](/assets/img/writing/vinobot.png){: .py1 }

Some people have mastered the language of wine. They say things like "resinous
evocations of rosemary and marjoram" or a "floral profusion atop a deep pool of
fresh raspberries". Not me. I'm a simple man with a simple palate and a simple
vocabulary. When I do try to play along, it usually sounds something like
[this](https://www.youtube.com/watch?v=RKKOX5fIeK4).

So I figured, why not _lean in_ and make an app that generates completely absurd
wine tasting notes on demand for those of us without the gift of gab. You know
when a waiter pours you a sample of wine and waits to hear your thoughts? Well,
now you'll be ready.

Vinobot is very simple: you open the app and get a ridiculous wine tasting note.
If you like it, you can share it with friends or, my favorite feature, have Siri
speak it aloud. If you're not a fan, you can generate a new, random note.

I made this (my first iOS app!) using React Native (which is
[unbelievably awesome](http://www.brendansudol.com/writing/react-native-baby-steps)
btw). As always, the code is on
[GitHub](https://github.com/brendansudol/vinobot).

In terms of how the random note is generated, it's heavily inspired by this
[blog post](http://www.gmon.com/tech/stng.shtml) and accompanying
[site](http://www.gmon.com/tech/output.shtml) (which was written like 20 years
ago!). I've largely adopted the same wine tasting note template for Vinobot:

    sentence 1: [first_impression] [conjunction] [adjective].
    sentence 2: [leadin] [flavor], [adjective] [flavor], and [qualifier] [flavor].
    sentence 3: drink [when_start] through [when_end].

With this structure in place, all that's left is to fill in the blanks, Mad Libs
style, with crazy words. If you want to browse the list of ridiculous adjectives
and flavors, it's
[here](https://github.com/brendansudol/vinobot/blob/master/util/wine-words.js).
Have some additional suggestions? Let me know!

Cheers 😀🍷

[Vinobot.co](http://vinobot.co) (or download from
[App Store](https://itunes.apple.com/us/app/vinobot/id1083119387))
