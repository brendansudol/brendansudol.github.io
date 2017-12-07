---
layout:     post
title:      College Scorecard Rankings
date:       2015-10-20
---

I'm happy to announce my latest side project, [College
Rankings][college_rankings].

![College rankings](/assets/img/writing/college-rankings.png){: .my2.border }

Last month, the Department of Education launched the [College
Scorecard][scorecard], a new tool that "provides students and families the
critical information they need to make smart decisions about where to enroll for
higher education" ([press release][pr]).

It's really nice — the site is simple, easy to get around, and mobile friendly.
And they released and awesomely [documented][documentation] all the data behind
it so that others can slice and dice the info and build additional tools with
it.

One thing that the College Scorecard doesn't have is rankings. However, this
didn't stop NPR's Planet Money. They reached out to three higher ed experts and
asked them how they'd weight the various variables to create a rating, which
they then turned into [three different top-50 lists][npr_article].

I wanted to take this one step futher and allow anyone to decide which pieces of
information were most important to them and come up with their own top (and
bottom) colleges list. You can select from up to eight different variables (for
now) and assign weights from 'not important' to 'very important'. Give it a
whirl [here][college_rankings], and let me know what you think!

[brendansudol.com/college-scorecard-rankings][college_rankings]

And if you're curious about the code behind it, I made it using [ReactJS][react]
and everything is on [GitHub][source_code].

[college_rankings]: http://www.brendansudol.com/college-scorecard-rankings
[scorecard]: https://collegescorecard.ed.gov/
[pr]: http://www.ed.gov/news/press-releases/education-department-releases-college-scorecard-help-students-choose-best-college-them
[documentation]: https://collegescorecard.ed.gov/data/documentation/
[npr_article]: http://www.npr.org/sections/ed/2015/09/21/441417608/the-new-college-scorecard-npr-does-some-math
[react]: https://facebook.github.io/react/
[source_code]: https://github.com/brendansudol/college-scorecard-rankings
