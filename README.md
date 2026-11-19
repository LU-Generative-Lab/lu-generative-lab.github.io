# Generative Lab website

The website for the Generative Lab, a faculty initiative at Lawrence University. Live at <https://lu-generative-lab.github.io>.

It's plain [Jekyll](https://jekyllrb.com/), built by GitHub Pages' built-in build: push to `main` and the site updates in a minute or two. No theme, no plugins, no build step on your machine. You can edit everything in GitHub's web editor.

## Where things live

| File | What it is | Do you edit it? |
|---|---|---|
| `_people/*.md` | one file per person | **yes**: add a file to add a person |
| `_projects/*.md` | one file per project | **yes**: add a file to add a project |
| `index.md` | the front page text | yes |
| `_config.yml` | site title, tagline, description | rarely |
| `assets/css/style.css` | the look; colors and fonts are tokens at the top | rarely, and change the tokens, not the rules |
| `_layouts/default.html` | the page frame (header, nav, footer) | rarely |
| `404.md` | the not-found page | no |

## Add a person

Copy an existing file in `_people/` and change it. The file name doesn't matter; use `firstname-lastname.md`.

```yaml
---
name: Ada Lovelace
role: Student, Mathematics '28
site: https://example.com/      # optional: where their name links
order: 3                        # position on the page
---
One or two sentences, in your own voice, about what you're interested in.
```

## Add a project

Copy an existing file in `_projects/` and change it.

```yaml
---
name: The Name of the Thing
link: https://example.com/      # optional: where the name links
people: Who works on it
status: active                  # anything short: active, paused, not started, open to visitors
order: 3
---
One to three sentences. If the project has a driving question, lead with it in **bold**.
```

## Preview locally (optional)

You don't need to, but if you want to see changes before pushing:

```sh
gem install --user-install jekyll
jekyll serve
```

Then open <http://localhost:4000>.

## Versions

This is version one: plain text, meant to be read. A second, explorable version is planned. It should read the same `_people/` and `_projects/` files, so both versions stay in sync.
