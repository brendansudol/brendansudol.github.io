---
layout:     post
title:      Introducing Jeopractice
share_img:  "/assets/img/twitter/calc.jpg"
date:       2015-12-17
---

My wife and I watch Jeopardy! almost every weekday. We've even developed a
simplified & <strike>friendly</strike> intense game to compete with each other
and track our results. Here are the rules: all questions are worth 1 point, no
matter the clue amount. You have to wait until the clue is completely read
before answering aloud. Multiple people can get credit for the same question so
long as they say it at the same time. No penalty for wrong answers. Final
Jeopardy! worth 5 points. And yes, we are fully aware of how nerdy this hobby is
:)

Needless to say, Libby beats me every night by a healthy 5 or so point margin.
I'm trying to close the gap, so I made a little site to help me practice. It's
called [Jeopractice][jeopractice].

![Jeopractice](/assets/img/writing/jeopractice.png)

It uses [this dataset][dataset] of over 200,000 past Jeopardy questions (from
over 30 years of shows). When you arrive to the site, you'll get the first clue
from a historical Jeopardy show. You can use the arrows to navigate to other
questions and categories. To reveal the answer, you can press the spacebar (or
hit the 'Answer' button). The question you're on at any time is saved to the URL
in case you want to come back later or if you want to send a hard question to a
friend. And there's a button in the top right to begin a new, randomized game.

That's it for now. It's pretty simple. I'm definitely open for ideas on
additional features to build. One thing I'd like to add at some point is the
ability to search for all questions related a particular topic across games, and
maybe compute some stats on topic popularity. But for now, I'm starting with
this flashcard-like interface.

If you're curious about the technology that powers Jeopractice, I use Python on
the backend (Django) and React on the frontend. The JS and Sass are compiled and
minified with webpack. And it's hosted on Heroku. All of the code can be found
on [Github][code].

Have a go at a game or two, and let me know what you think!

[jeopractice.com][jeopractice]

[dataset]: https://www.reddit.com/r/datasets/comments/1uyd0t/200000_jeopardy_questions_in_a_json_file
[jeopractice]: http://www.jeopractice.com/
[code]: https://github.com/brendansudol/jeopractice.com
