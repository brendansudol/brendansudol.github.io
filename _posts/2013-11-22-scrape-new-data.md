---
layout:     post
title:      Web scrape a fun, new dataset
date:       2013-11-22
---

When I first started learning to code, I thought writing a program to scrape, or
fetch information, from a website was the coolest thing ever. With just a few
simple commands, I could systematically gather pretty much any piece of text or
data from any website I wanted. I still think it's just as cool and useful
today. And it's a great way to get your hands on a fun, new dataset to explore
and analyze.

For example, I love ordering food from Seamless.com. Huge selection of
restaurants, and quick and easy to place and pay for my order.

But there is one feature on Seamless that bugs me -- when you first start
searching for restaurants near your place, the default ordering of the results
is alphabetical. I know a lot of things in life are sorted this way, but
Seamless has better signals to use than the first letter of the restaurant name,
like estimated delivery time or average rating or number of reviews or even
better, relevancy based on my prior orders.

That said, maybe this default ordering is moot if users immediately filter down
to a particular cuisine, or perhaps users are even reassured by the fact that
they see 10 restaurants that all start with 'A' as it implies a large offering
on Seamless which inspires confidence and leads to more exploring and order
completions.

This got me wondering, do restaurants that begin with letters at the start of
the alphabet get more sales on Seamless just because they're higher on the page?
I wanted to try and find out, but that kind of restaurant sales data isn't
released by Seamless. But maybe I could estimate it -- Seamless does tell you
how many times each restaurant has been reviewed. This definitely isn't a
perfect proxy for sales (e.g., assumes all restaurants have been on site for
same amount of time and likelihood to review across different cuisines and price
ranges is same) but it's maybe fairly decent and I think it's the best I'm gonna
do. Time to scrape the 51 pages of results for Brooklyn restaurants and gather
and store the relevant data. I'm using [Ruby][ruby] to do this, but there are a
lot of great helper libraries out there for other languages too.

{% highlight ruby %}
# scrape seamless.com for brooklyn restaurant data 
require 'nokogiri'         
require "open-uri"

BASE_URL = 'http://www.seamless.com/brooklyn/'
OUTPUT_FILE = 'seamless-data.csv'
NUM_PAGES = 51 # total number of pages for brooklyn

open(OUTPUT_FILE, 'w') do |f|
  # add column headers to data file
  f.puts 'page|restaurant|first_letter|rating|num_reviews|price'
  # loop through each page of results 
  (1..NUM_PAGES).each do |p|
    # retrieve contents of page and select all restaurant entries
    page = Nokogiri::HTML(open("#{BASE_URL}?page=#{p}"))
    restaurants = page.css('.vendor')
    # loop through restaurants and output relevant info to csv
    restaurants.each do |r|
      # restaurant name
      name = r.css('.title')[0].attributes['title'].value.split('|')[0].strip()
      first_letter = name.nil? ? '' : name[0].downcase
      # rating
      rating = r.css('.rating')[0].attributes['class'].value.split(' ')[1]
      # number of reviews
      reviews_temp = r.css('.rating')[0].attributes['title'].value.split('on ')[1]
      num_reviews = reviews_temp.nil? ? '0' : reviews_temp.split(' ')[0]
      # price category
      price_temp = r.css('.priceRating strong')[0]
      price = price_temp.nil? ? 'n/a' : price_temp.children[0].text
      # all together
      entry = "#{p}|#{name}|#{first_letter}|#{rating}|#{num_reviews}|#{price}"
      # add to csv
      f.puts entry
    end
    # pause for ~2 seconds before next page request
    sleep 1.5 + rand
  end
end
{% endhighlight %}

With that, I now have a file with 1,260 entries for each Brooklyn restaurant on
Seamless along with their average rating (1-5), total number of reviews, and
price (1-5). The data file looks like this:

{% highlight text %}
page|restaurant|first_letter|rating|num_reviews|price
1|El Viejo Yayo Restaurant|e|rating-3|13|$$$
1|Park Plaza Restaurant|p|rating-4|113|$$
1|Hadramout Restaurant|h|rating-3|10|$$$
1|Fatoosh Middle Eastern Pitza & BBQ|f|rating-5|81|$
1|LaylaJones|l|rating-4|146|$$
1|Due Fratelli (Brooklyn)|d|rating-2|188|$$
1|Friendly Deli and Pizza|f|rating-2|7|$
1|Hanson's Restaurant|h|rating-3|21|$
1|Nicky's Vietnamese Sandwiches (Brooklyn)|n|rating-4|49|$
1|Pino's La Forchetta Pizza|p|rating-4|160|$$
...
{% endhighlight %}

Now it's time to drop it into [R][r], or your data analysis tool of choice, and
do some exploring! Pretty plots and answers (or observations at least) to come
in a future post. :)

[ruby]: https://www.ruby-lang.org/en/
[r]: http://www.r-project.org/
