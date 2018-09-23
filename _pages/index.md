---
layout: skinny
permalink: /
---

<p class='sm-col-4'>
  Hello! I’m Brendan. I'm a software developer living in Washington, D.C. I like
  making things on the web. I also really like golf.
</p>

<h4 class='mt4'>Recent Writing</h4>
<ul class='m0 list-reset sm-col-4'>
  {% for post in site.posts limit:4 %}
    <li class='mb1'>
      <a href='{{ post.url | prepend: site.baseurl }}'>{{ post.title }}</a>
    </li>
  {% endfor %}
  <li class='mb1'><a class='italic' href='/writing'>View more...</a></li>
</ul>

<h4 class='mt4'>Recent Projects</h4>
<ul class='m0 list-reset sm-col-4'>
  {% for project in site.projects limit:4 %}
    <li class='mb1'>
      <a target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
      <div>{{ project.summary }}</div>
    </li>
  {% endfor %}
  <li class='mb1'><a class='italic' href='/projects'>View more...</a></li>
</ul>
