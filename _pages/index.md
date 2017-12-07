---
layout: skinny
permalink: /
---

Hello! I’m Brendan. I'm a software developer based in Washington, D.C. I work at
[18F](https://18f.gsa.gov/) to deliver better government services through
technology and design. Prior to that, I did data science at
[Etsy](https://www.etsy.com/) and helped build an analytics startup called
[Simon](https://www.simondata.com). In my spare time, I like making
[fun things](/projects) on the web, playing golf, and using oxford commas.

<h4 class='mt4'>Recent Writing</h4>
<ul class='m0 list-reset'>
  {% for post in site.posts limit:4 %}
    <li class='mb1'>
      <a href='{{ post.url | prepend: site.baseurl }}'>{{ post.title }}</a>
    </li>
  {% endfor %}
  <li class='mb1'><a class='italic' href='/writing'>View more...</a></li>
</ul>

<h4 class='mt4'>Recent Projects</h4>
<ul class='m0 list-reset'>
  {% for project in site.projects limit:4 %}
    <li class='mb1'>
      <a target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
      <div>{{ project.summary }}</div>
    </li>
  {% endfor %}
  <li class='mb1'><a class='italic' href='/projects'>View more...</a></li>
</ul>
