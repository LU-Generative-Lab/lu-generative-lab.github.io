---
layout: default
---

The Generative Lab is a space, physical and virtual, for faculty and students in mathematics, statistics, computer science, and data science to make things.

Generative AI tools have reached the point where it is relatively cheap and easy to do it all: build software, build hardware, clean and analyze data, prove theorems. We want a place where students learn what creativity looks like in these fields, where projects can run longer than a term (sometimes longer than one generation of students), and where faculty can pool what they know.

Think of it as a makerspace for science. We're just getting started (November 2026).

## what

- **Projects that last.** Work that passes from one cohort of students to the next. Each cohort ships its own edition, and the older ones stay up.
- **Lab culture.** How research and professional work in our fields actually happens, including the ethics of it.
- **Working across lines.** Cross-disciplinary projects, and projects with community partners.
- **A resource.** For Lawrence and the community around it, at whatever scale fits.

## projects

<ul class="entries">
{% assign projects = site.projects | sort: "order" %}
{% for p in projects %}
  <li class="entry">
    <span class="entry-name">{% if p.link %}<a href="{{ p.link }}">{{ p.name }}</a>{% else %}{{ p.name }}{% endif %}</span>
    <span class="entry-meta mono">{{ p.people }} · {{ p.status }}</span>
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

**Students:** if you want to build something, or want to work on something bigger than a homework set, talk to us. You don't need a project in mind.

**Faculty and staff:** if you have a problem that could use a mathematician, a statistician, a programmer, or a data person, bring it to us.

**Anyone else:** say hello.

<p class="mono">acacia{dot}ackles{at}lawrence{dot}edu<br>woden{dot}kusner{at}lawrence{dot}edu</p>
