<a href="https://github-blog-blue.vercel.app">
  <img alt="GitHub Blog App is a dynamic, Notion-style WYSIWYG editor that innovatively utilizes GitHub Issues as its backend database." src="https://github-blog-blue.vercel.app/opengraph-image.jpeg">
  <h1 align="center">GitHub Blog</h1>
</a>

<p align="center">
   A dynamic, Notion-style WYSIWYG editor that innovatively utilizes GitHub Issues as its backend database.
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
</p>
<br/>

## Introduction

[GitHub Blog](https://github-blog-blue.vercel.app) is a dynamic, Notion-style WYSIWYG editor that innovatively utilizes GitHub Issues as its backend database.

<br />

## Installation


To use GitHub Blog in a project, you can run the following command to install it.

```
git clone http://github.com/YouMingYeh/github-blog
```
Then, you will need to fill in the environment variables in `.env.example` and rename it to `.env`.

**Note**: You will need to create a GitHub App and install it on your repository. You can follow the instructions [here](https://docs.github.com/en/developers/apps/creating-a-github-app). Also, you will need to grab the `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, from the GitHub App you created.

Afterwards, you can run the following commands to start the app.

```
cd github-blog
pnpm install
pnpm run dev
```

Note that you will need to have [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/) installed on your machine.


Here's an example application: https://github-blog-blue.vercel.app

## Deploy Your Own
Make sure you have fill in the environment variables in `.env.example` and rename it to `.env`.

**Note**: You will need to configure the GitHub App's `Homepage URL` and `Callback URL` to your deployment URL.

## Tech Stack

Novel is built on the following stack:

- [Next.js](https://nextjs.org/) – framework
- [Tiptap](https://tiptap.dev/) – text editor
- [Novel](https://novel.sh/) - Template
- [Vercel](https://vercel.com) – deployments
- [TailwindCSS](https://tailwindcss.com/) – styles
- [pnpm](https://pnpm.io/) – package manager
- [TypeScript](https://www.typescriptlang.org/) – language
- [GitHub API](https://docs.github.com/en/rest) – backend
- [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps) – authentication
- [GitHub Issues](https://docs.github.com/en/issues) – database
- [Shadcn/ui](https://ui.shadcn.com/) – components
