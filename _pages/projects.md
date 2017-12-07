---
layout: skinny
title: Projects
permalink: /projects/
---

{% for project in site.projects %}
  <div class='mb3'>
    <a class='h3 bold black' target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
    <p>{{ project.summary }}</p>
  </div>
{% endfor %}
