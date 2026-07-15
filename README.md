# Digital Edge

👋 Hey, if you've ended up here, you've probably clicked through from the [Digital Edge](https://bpp-sot.github.io/Digital-Edge/) site out of curiosity to see what's behind the scenes. Welcome!

**Digital Edge** is a site built for learners: articles, events, community news, and podcast conversations on digital skills, AI, and technology, all in one place. This repository is the source code that builds and publishes that site.

## What's actually here?

The site is built with [MkDocs](https://www.mkdocs.org/), a tool that turns plain text (Markdown) files into a full website. So most of "the app" is just:

- **Content**: the articles, event pages, and podcast write-ups, written as Markdown files in [docs/](docs/)
- **A bit of styling and interactivity**: some CSS and JavaScript in [docs/assets/](docs/assets/) to make things look and feel right
- **Config**: a couple of settings files ([mkdocs.yml](mkdocs.yml)) that tell MkDocs how to put it all together

Every time content is updated and pushed here, GitHub automatically rebuilds and republishes the live site. No manual deployment needed.

You don't need to understand any of this to enjoy the site, but if source code is your kind of curiosity, hopefully this gives you a useful starting point. 🚀
