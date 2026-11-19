# Generative Lab website

The website for the Generative Lab, a faculty initiative at Lawrence University. Live at <https://lu-generative-lab.github.io>.

It's plain [Jekyll](https://jekyllrb.com/), built by GitHub Pages' built-in build: push to `main` and the site updates in a minute or two. No theme, no plugins, no build step on your machine. You can edit everything in GitHub's web editor.

## Where things live

| File | What it is | Do you edit it? |
|---|---|---|
| `_people/*.md` | one file per person | **yes**: add a file to add a person |
| `_projects/*.md` | one file per project | **yes**: add a file to add a project |
| `index.md` | the front page text (version one) | yes |
| `_includes/join.md` | the "join" text, shared by both versions | yes |
| `_config.yml` | site title, tagline, description | rarely |
| `assets/css/style.css` | the look; colors and fonts are tokens at the top | rarely, and change the tokens, not the rules |
| `_layouts/default.html` | the page frame (header, nav, footer) | rarely |
| `very-small-space/index.html` | version two: the page | rarely |
| `assets/js/small.js` | version two: the simulation | only to change how it behaves |
| `assets/css/small.css` | version two: its extra styles | rarely |
| `404.md` | the not-found page | no |

## Add a person

Copy an existing file in `_people/` and change it. The file name doesn't matter; use `firstname-lastname.md`.

```yaml
---
name: Ada Lovelace
role: Student, Mathematics '28
site: https://example.com/      # optional: where their name links
short: AL                       # two characters for their disk in version two
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
ai: Which AI tools work on it   # optional, e.g. Claude
status: active                  # anything short: active, paused, not started, open to visitors
short: TN                       # two characters for its disk in version two
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

If `gem install` fails while compiling native extensions (missing Ruby headers), use Docker instead:

```sh
docker run --rm -p 4000:4000 -v "$PWD":/srv ruby:3.3 sh -c \
  "gem install jekyll -v '~> 3.10' kramdown-parser-gfm webrick && jekyll serve -s /srv -d /tmp/site -H 0.0.0.0"
```

## Versions

**Version one** (`/`) is plain text, meant to be read.

**Version two** (`/very-small-space/`) is a box of hard disks moved by the Metropolis algorithm. People are filled disks, projects are ringed ones, and the blank disks are room for people who haven't joined. Squeezing the room makes the disks crystallize. It reads the same `_people/` and `_projects/` files as version one, so adding a person or project updates both, and `_includes/join.md` is shared too. If a new entry has no `short`, its disk shows the first two characters of its name.

The simulation's knobs (number of blank disks, how loose and tight the room gets) are constants at the top of `assets/js/small.js`.
