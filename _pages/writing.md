---
layout: skinny
title: Writing
permalink: /writing/
---

{% for post in site.posts %}
  <div class='mb1'>
    <a class='block bold black' href='{{ post.url | prepend: site.baseurl }}'>
      {{ post.title }}
    </a>
  </div>
{% endfor %}
