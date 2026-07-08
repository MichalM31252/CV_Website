# Portfolio — Michał Malinowski

Personal portfolio / CV site: a single-page app built with **Vue 3** and plain CSS, served as static files with no build step.

## Stack

- [Vue 3](https://vuejs.org/) loaded via an import map from a CDN — no Node.js, no bundler, nothing to install
- Vanilla CSS with custom properties (`css/styles.css`)
- Live data fetched client-side: GitHub REST API, [github-contributions-api](https://github.com/grubersjoe/github-contributions-api), and LeetCode community APIs

## Project structure

```
index.html               Page shell: meta tags, fonts, import map, #app mount point
css/styles.css           All styling
js/
  app.js                 Creates the Vue app and mounts it
  data.js                All site content — edit this file to change any text
  icons.js               Inline SVG icon components
  reveal.js              v-reveal directive (scroll-into-view fade-in)
  components/
    App.js               Root component; composes the sections
    SiteNav.js           Sticky nav with mobile menu
    HeroSection.js       Intro, action buttons, SQL query card
    QueryCard.js         Animated typed-SQL console
    AboutSection.js      Bio paragraphs + fact card
    ExperienceSection.js Job timeline
    ProjectsSection.js   Project card grid
    ActivitySection.js   Live-data panels wrapper
    GithubPanel.js       Contribution calendar + profile chips
    LeetcodePanel.js     Solved-problem stats
    SkillsSection.js     Skill group grid
    EducationSection.js  Schools + certificates
    ContactSection.js    Contact call-to-action
    SiteFooter.js        Footer
    PageSection.js       Shared section shell (label + heading)
    TimelineItem.js      Shared dated timeline entry
    TagList.js           Shared tag pills
```

## Editing content

All copy — names, jobs, projects, skills, links — lives in [`js/data.js`](js/data.js). Edit that file; the components render whatever it contains.

## Running locally

ES modules require an HTTP server (opening `index.html` directly from disk won't work):

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Static files only — deploy the repository root as-is (e.g. GitHub Pages).
