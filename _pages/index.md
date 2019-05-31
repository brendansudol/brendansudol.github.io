---
layout: default
permalink: /
is_wide: true
---

<p class='mb4 sm-h3 measure'>
  Hello, I'm Brendan! I'm a software engineer based in Washington, D.C.
  I'm interested in data visualization, machine learning, generative design,
  and building fun things on the web. I also really like to golf.
</p>

<h2 class='mb3 h5 caps'>Projects</h2>
<div class='mb3 flex flex-wrap mxn2'>
  {% for project in site.projects %}
    <div class='flex col-6 sm-col-4 px2 mb3'>
      <div class='sm-flex'>
        <a class='flex-none mr2 block icon-container' href='{{ project.url }}'>
          {% if project.icon contains '.svg' %}
            {% include svg/icon/{{ project.icon }} %}
          {% else %}
            <img src="{{ project.icon | prepend: '/assets/img/icon/' }}" />
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

<h2 class='mb3 h5 caps'>Mini Projects</h2>
<div class='flex flex-wrap mxn2'>
  {% for project in site.mini_projects %}
    <div class='flex col-6 sm-col-4 px2 mb3'>
      <div class='sm-flex'>
        <a class='flex-none mr2 block icon-container' target='_blank' href='{{ project.url }}'>
          {% if project.icon contains '.svg' %}
            {% include svg/icon/{{ project.icon }} %}
          {% else %}
            <img src="{{ project.icon | prepend: '/assets/img/icon/' }}" />
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
