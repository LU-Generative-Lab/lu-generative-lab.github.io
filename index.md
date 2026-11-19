---
layout: default
---

The Generative Lab is a space, physical and virtual, for faculty and students in mathematics, statistics, computer science, and data science to make things.

_Make what kind of things?_ Yeah, exactly!

Generative AI tools have reached the point where it is relatively cheap and easy to do it all: build software, modify hardware, clean and analyze data, prove theorems, and, honestly, just make cool stuff for no other reason than that you want to and you can. But, for some reason, most of us are using these tools primarily to search the web and respond to emails. What else can we do with them??

Our goal is a place where students, faculty, and anyone else can explore what creativity looks like in AI-assisted computation and mathematics. We want to create projects that can run longer than a term (sometimes longer than one generation of students), facilitate faculty knowledge and expertise across disciplines, and push the boundaries of what a bunch of very bright people in a very small space can make with very little holding them back besides their own imaginations.

Think of it as a makerspace for computational science, and please come make something with us!

## projects

<ul class="entries">
{% assign projects = site.projects | sort: "order" %}
{% for p in projects %}
  <li class="entry">
    <span class="entry-name">{% if p.link %}<a href="{{ p.link }}">{{ p.name }}</a>{% else %}{{ p.name }}{% endif %}</span>
    <span class="entry-meta mono">people: {{ p.people }}{% if p.ai %} · AI: {{ p.ai }}{% endif %} · {{ p.status }}</span>
    {{ p.content | markdownify }}
  </li>
{% endfor %}
</ul>

## people

<ul class="entries">
{% assign people = site.people | sort: "order" %}
{% for person in people %}
  <li class="entry">
    <span class="entry-name"><a href="{{ person.site }}">{{ person.name }}</a></span>
    <span class="entry-meta mono">{{ person.role }}</span>
    {{ person.content | markdownify }}
  </li>
{% endfor %}
</ul>

## join

{% include join.md %}
