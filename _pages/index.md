---
layout: default
permalink: /
is_wide: true
---

<p class='mb4 sm-h3 measure'>
  Hello! I'm a DC-based software engineer. I like building things on the web and playing golf. Here's a hodgepodge of some personal projects:
</p>

<div class='py2 flex flex-wrap mxn2'>
  {% for project in site.projects %}
    <div class='flex col-6 sm-col-4 px2 mb3'>
      <div class='sm-flex'>
        <a class='flex-none mr2 block icon-container' href='{{ project.url }}'>
          {% if project.icon contains '.svg' %}
            {% include svg/icon/{{ project.icon }} %}
          {% else %}
            <img src="{{ project.icon | prepend: '/assets/img/misc/' }}" />
          {% endif %}
        </a>
        <div class='flex-auto'>
          <a class='black extra-bold' target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
          <span class='gray'>{{ project.summary }}</span>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
