---
layout: skinny
title: Projects
permalink: /projects/
---

{% for project in site.projects %}
  <div class='mb3'>
    <a class='h3 bold black' target='_blank' href='{{ project.url }}'>
      {{ project.title }}
      {% if project.deprecated %}<span class='h6 regular'>(deprecated)</span>{% endif %}
    </a>
    <p>{{ project.summary }}</p>
  </div>
{% endfor %}
