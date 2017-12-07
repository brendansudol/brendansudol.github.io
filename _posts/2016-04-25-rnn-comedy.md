---
layout:     post
title:      Can computers be funny?
date:       2016-04-05
---

Machine intelligence has been on a roll lately:
[beating the world's best Go player](http://www.theatlantic.com/technology/archive/2016/03/the-invisible-opponent/475611/),
[autonomously driving cars](http://jalopnik.com/you-can-now-autonomously-park-and-summon-the-tesla-mode-1752037395),
even [Making America Great Again](http://www.csail.mit.edu/deepdrumpf).

But can a computer be funny? Equipped with a deep learning
[model](https://github.com/karpathy/char-rnn) open sourced by a Stanford
researcher (with an
[amazing accompanying article](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)),
I tried to find out.

To start, I compiled every
[Conan O'Brien monologue joke](http://teamcoco.com/jokes) over the last ~5 years
(results
[here](https://raw.githubusercontent.com/brendansudol/rnn-joke-generate/master/data/conan/input.txt)).
These jokes served as the input for a recurrent neural network (RNN)
character-level language model. The model learns the patterns and style of the
text and is then able to generate new text, one character a time, that is
similar in style but still unique (code and additional details on
[GitHub](https://github.com/brendansudol/rnn-joke-generate)).

Some of the better results are below. A few of the set-ups are hilariously fresh
and I love the attempted quotations. All in all, they're not exactly ha-ha
funny, but definitely quite amusing. At least for now, comedy writers' jobs are
safe :)

> A new study says that a second wife is coming out with a new song "Seattle
> Starbucks." The study was conducted by the presidential candidates and said,
> "That’s not the most popular story."

> Donald Trump has been invited to have sex with the check of single of her
> wife. In fact, the most popular campaign slogan is "I have a hotel."

> In a new interview, Mitt Romney is coming out of the room for a sex tape in
> the money.

> In a new interview, Bill Clinton said he was honded to be from the
> controversy. It's called "Watching his female problems."

> It was reported today that Donald Trump said that he would make a protest back
> for the police of the state of the US and the third year of store. The new
> store is pregnant.

> A new study found that sex with a salary state of the Kanye West party to be
> the first time ever. The man is called "50 Shades of Grey" and "The Day to
> Facebook."

> Donald Trump has a new slogan, "I don't want to be a lot of men."

> In a new interview, Mitt Romney has announced that they are a storm to be a
> prostitute. It’s the first time a start with the streets at the state of "The
> Real Housewives of The Republican Presidential Candidate."

> In a new interview, Kim Kardashian said he was arrested for probably sexual
> harassment. The show is going to be a break from the first time ever to say he
> was a string of contract than the Pope said, "I am also the one who was sent
> out of the world."

> In a new interview, Mitt Romney is in trouble for a new book for the first
> time in the world. The study was conducted by a show with the movie "The
> American American American Idol."
