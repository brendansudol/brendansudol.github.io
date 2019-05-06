---
layout: default
permalink: /wip
---

<p class='measure'>
  Hello! I’m Brendan. I'm a software developer living in Washington, D.C. I like
  making things on the web. I also really like golf.
</p>

<h2 class='mt4 mb3 h5 caps'>Projects</h2>
<div class='flex flex-wrap mxn2'>
  {% for project in site.projects_new %}
    <div class='flex col-6 px2 mb3 border-box'>
      <div class='flex'>
        <div class='flex-none mr2 icon-container'>
          {% if project.icon contains '.svg' %}
            {% include svg/icon/{{ project.icon }} %}
          {% else %}
            <img src="{{ project.icon | prepend: '/assets/img/icon/' }}" />
          {% endif %}
        </div>
        <div class='flex-auto'>
          <a class='black extra-bold' target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
          <span class='gray'>{{ project.summary }}</span>
        </div>
      </div>
    </div>
  {% endfor %}
</div>

<h2 class='mt4 mb3 h5 caps'>Mini Projects</h2>
<div class='flex flex-wrap mxn2'>
  {% for project in site.mini_projects %}
    <div class='flex col-6 px2 mb3 border-box'>
      <div class='flex'>
        <div class='flex-none mr2 icon-container'>
          {% if project.icon contains '.svg' %}
            {% include svg/icon/{{ project.icon }} %}
          {% else %}
            <img src="{{ project.icon | prepend: '/assets/img/icon/' }}" />
          {% endif %}
        </div>
        <div class='flex-auto'>
          <a class='black extra-bold' target='_blank' href='{{ project.url }}'>{{ project.title }}</a>
          <span class='gray'>{{ project.summary }}</span>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
