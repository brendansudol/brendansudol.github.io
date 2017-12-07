---
layout:     post
title:      Be Thotful
date:       2013-11-12
---

I'm really bad at remembering important dates. Mother's Day, Grandpa's Birthday,
Nephew's Preschool Graduation, you name it. And by the time I do remember, it's
way too late to get and send a nice gift. I'm often just scrambling to call and
send my good wishes before people go to sleep :( It's a bummer to the point of
being ridiculous.

I've tried calendars and post-it notes, but neither have worked very well. So I
decided to make a little tool to help, and if you're like me, you may find it
useful as well: [Thotfully.com][thotfully]

![thotfully](/assets/img/writing/thotfully.png)

Thotfully allows you to add in all those special occasions that sneak up on you,
and it will send you text reminders leading up to the big day so you can buy a
gift and plan accordingly. And if you know you're going to be super busy, you
can pick out one of the awesome gifts on the site in advance, and it will be
ordered and delivered for you when it's the right time. Free shipping and gift
wrapping included :)

I had a blast building the site and learned a ton in the process. I'm using
[Sinatra][sinatra], a nice and small and minimal Ruby web framework. I'm using
the [Twilio][twilio] API for the text reminders and [Stripe][stripe] for the
payment processing, and the site is hosted on Heroku. This was my first time
integrating with Stripe and I was really impressed -- their out-of-the-box
Checkout form and flow is beautiful and their [documentation is
fantastic][docs]. If you want to see the full source code for the site, check it
out [here][github].

Another thing I learned from this project was how many decisions you have to
make and the little things you have to do to put it all together and make it
look half-way decent. Like messaging copy (thanks Linz!), font styles and sizes,
color palettes, mobile responsiveness, form validations, data model
associations, cookie expiration times, social sharing integration, page load
performance, etc. I know I spent way too long on some of these things and should
have completely punted on others, so this was a nice lesson for me in
prioritizing what's necessary and judiciously thinking about what's crucial now
vs. a nice feature for down the road.

Always looking for feedback to make it better, so shout if you have any thoughts
(thots?) and suggestions!

[thotfully]: http://www.thotfully.com/
[sinatra]: http://www.sinatrarb.com/
[twilio]: https://www.twilio.com/
[stripe]: https://stripe.com/
[docs]: https://stripe.com/docs/checkout/v2
[github]: https://github.com/brendansudol/thotfully.com
