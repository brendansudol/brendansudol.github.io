---
layout:     post
title:      DC Hack for Change
date:       2015-06-14
---

Last Saturday (6/5), I participated in my first ever hackathon. It was [National
Day of Civic Hacking][hackforchange], an event that brings together civic
activists, government staff, developers, and designers to "build new solutions
using publicly-released data, technology, and design processes to improve our
communities and the governments that serve them."

I took part in the DC organized event, which focused on helping small businesses
in the area. My team was tasked with helping local food truck businesses (an
issue near and dear to my heart and stomach).

There are way more food trucks than designated parking spots in DC; this leads
to a lot of inefficient roaming around and trying to figure out where to go. Our
goal was to use hyperlocal, real-time(ish) data to help these roving businesses
figure out the best locations to go throughout the day.

We ended up building 2 things to address this (in very half-baked forms). The
first was an aggregator of big, local events in the area, laid out to give food
truck owners a simple itinerary for the day (delivered via an email each
morning). The second thing was a map of DC that showed people who were tweeting
about various food related topics in the area (for example, where exactly are
the people who are tweeting about being "hungry" or "grabbing lunch").

I thought this second piece was really interesting but we didn't have time to
fully flesh it out. All we did was plot points (that represented individual
tweets) on a map. From a user perspective, it was a bit overwhelming to consume
and too difficult to draw conclusions about tweet densities in an area (because
of overlapping points).

After the hackathon ended, I put in a few more hours to do the things I didn't
have time for during the event, namely cleaning up the design and showing tweet
activity stats by neighborhood. I used this [dataset][hood_dataset] to get the
DC neighborhood geo boundaries and this [point in polygon Leaflet
API][leaflet_pip] to assign tweets with a latitude and longitude to their
enclosed neighborhood.

The final product is [here][final_app] (unfortunately, it seems most tweets
aren't geotagged hence the lower than expected totals). It's still quite basic,
but you can search for any word or phrase, zoom in to a particular neighborhood
(either by clicking on the map or list), and click on a point to read the actual
tweet. Give it a whirl!

[dchackforchange.herokuapp.com][final_app]

[hackforchange]: http://hackforchange.org/
[hood_dataset]: http://opendatadc.org/sr_Latn/dataset/neighborhood-boundaries-217-neighborhoods-washpost-justgrimes/resource/31ef1dd7-49a1-455e-b7e4-2c94576197f6
[leaflet_pip]: https://github.com/mapbox/leaflet-pip
[final_app]: https://dchackforchange.herokuapp.com/
