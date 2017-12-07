---
layout:     post
title:      Soccer outcome probabilities 
date:       2015-04-12
js:
  - d3
  - soccerOutcomes
---

I'm a big fan of English Premier League football. Manchester United is my team.
Why? Because this girl I dated back in high school really liked them. We've
since gone on and got married and now I think I like the Red Devils more than
she does. :)

As I watch more and more games, I find myself wondering a bunch of data related
questions, like how important is home field advantage, is this a common final
score, when do goals tend to be scored, do they come in bunches, how comfortable
is a 2 goal lead with 30 minutes to go, how do all of these things differ across
teams and seasons, and on and on.

I decided to get some data and explore. It turned out to be surprisingly hard to
get my hands on a good dataset. [This][footballcsv] is an awesome resource but
it only has halftime and final scores -- I wanted more info on when goals were
scored during a match. I eventually resorted to scraping the season summary
pages on soccerbot ([example][soccerbot]). See [this github repo][data-repo] if
you'd like to see what I did / reproduce (it turned out to be trickier than it
should have been due to the site's fairly crazy client side data loading and
rendering). Then I imported the dataset into an IPython notebook to analyze and
slice & dice. Here's my [notebook][notebook] if you're curious.

For this post, I'll focus on just one question from above to kick things off:
How comfortable is a two goal lead? Or to make it more general and interesting,
**what is the likelihood of a particular outcome (win/lose/draw) based on the
goal margin, location (home or away), and how much time is remaining**. A soccer
blog called [Soccer Statistically][soccer_statistically] looked into this
problem a couple years ago and the Wall Street Journal even wrote a small [blog
post][wsj] about it, but it seems like their 'calculator' is no longer
maintained or working, so I'm happy to pick up the baton and explore the
question using my data tools of choice, python and D3.js.

How can we answer this question? Since we know when all goals were scored with
our newly created (and well earned) [dataset][dataset], we can back out what the
score was at every minute for each game. So we can look at all matches where the
home team was leading by 2 goals at the 60 minute mark and then see how often
that team went on to win. And we can do this for other goal differentials and at
each minute of the game - for example, how likely is a draw when teams are tied
(0 goal diff) in the 80th minute. Results are below (please adjust the inputs to
see how things change!), and the javascript that powers it is
[here][chart_code].

<div id="viz-soccer-outcomes">
  <div class="mb2 h5 bold">
    Hover over chart to see outcome probabilities at different times.
  </div>

  <div class="mb1" id="side-input">
      <label><input type="radio" name="side" value="Home" />Home</label>
      <label><input type="radio" name="side" value="Away" />Away</label>
  </div>

  <div class="mb1">
    <div>Goal differential: <span id='g-diff-val'>0</span></div>
    <input type="range" value="0" min="-3" max="3" step="1" id="g-diff-input" />
  </div>

  <div class="probs">
    <div class="prob p-win">Win: <span class="p-val" id="win-rate">-</span></div>
    <div class="prob p-draw">Draw: <span class="p-val" id="draw-rate">-</span></div>
    <div class="prob p-lose">Lose: <span class="p-val" id="lose-rate">-</span></div>
    <div class="prob p-games">Games: <span class="p-val" id="game-ct">-</span></div>
  </div>

  <div class="svg-holder">
  </div>
</div>

Note: The data that powers the chart above includes ~4.5k Premier League games
since 2000. At each minute, you can see the win/draw/lose probabilities above
the graph (as well as the number of games that go into that calculation). To
make the trend lines less noisy, only scenarios that occurred in at least 5
different games are plotted (e.g., there were not 5 games when the home team had
a 3 goal advantage within the first 17 minutes).

---

A few observations:

* If the score is tied and your team is playing at home, you may want to start
  lowering your expectations for a victory around the 70 minute mark - this is
  when a draw becomes more likely than a win.
* How comfortable is a one goal advantage at home? Pretty comfortable actually -
  teams go on to win over 70% of the time even if that lead came in the 2nd
  minute. That said, the win likelihood doesn't cross 80% until the 70th minute
  and it doesn't hit 90% until the 85th minute.
* A one goal lead is not nearly as cushy when you're away - a 70% win rate
  doesn't happen until the 68th minute for away sides that go up by one.
* What about a two goal advantage? Home or away, a two advantage in the second
  half leads to a victory over 90% of the time.
* It's interesting to see some of the rare and crazy comebacks that happened
  over the years, like the home team that was down by 3 in the 80th minute and
  went on to secure a draw (this was West Brom (h) vs. Man U (a) in 2013,
  summary [here][outlier]).

Feel free to play around with the inputs and hover over the chart to explore the
scenarios you're curious about, or maybe the one your team happens to be facing
during a match.

Oh, and in case you missed the Manchester derby earlier today, [enjoy][enjoy] :)

[footballcsv]: https://github.com/footballcsv/en-england
[soccerbot]: http://soccerbot.com/fa/results/ukprem2013x.htm
[data-repo]: https://github.com/brendansudol/soccer-data
[notebook]: http://nbviewer.ipython.org/gist/brendansudol/92fe0ecf750443dc5a1d
[soccer_statistically]: http://www.soccerstatistically.com/
[wsj]: http://blogs.wsj.com/dailyfix/2012/11/02/2012-league-cup-capital-one-arsenal-7-reading-5-comeback/
[dataset]: https://github.com/brendansudol/soccer-data/blob/master/data-raw-cleaned/combined.tsv
[chart_code]: https://gist.github.com/brendansudol/f62d21d8118748158e26
[outlier]: http://www.bbc.com/sport/0/football/22499117
[enjoy]: http://www.espnfc.us/barclays-premier-league/match/395478/manchester-united-manchester-city/report
