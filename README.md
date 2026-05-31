# StudentHub Staff — AI Portfolio & Agent Platform

This repository combines a mobile-first staff portal with an AI-driven agency workflow that helps founders automate portfolio creation, job discovery, and career positioning.

## What is this project?

StudentHub Staff is an Ionic + Angular staff portal built for modern education and team management. The repository also includes `ai-agency/`, a lightweight AI runtime that can:

- inspect GitHub profiles
- search issues and discussions for remote roles
- generate portfolio README content
- update the root `README.md`
- write tailored cover letters
- open GitHub issues programmatically

## Why this matters

This repo demonstrates a hybrid product approach: a real app with a programmable AI assistant layer. It showcases full-stack development, platform automation, and startup-ready narrative tooling in one place.

## Key features

- **StudentHub Staff portal** built with Angular, Ionic, Capacitor
- **AI agency runtime** with reusable task commands
- **GitHub job and discussion search** for remote opportunities
- **Portfolio and README generation** powered by AI
- **Cover letter automation** for GitHub-related roles

## Run the AI agency

```bash
npm install
setx GITHUB_TOKEN "your_github_token"
setx OPENAI_API_KEY "your_openai_key"
npm run ai-agency -- preview
npm run ai-agency -- profile
npm run ai-agency -- search "hiring remote javascript"
npm run ai-agency -- jobs "remote github jobs"
npm run ai-agency -- portfolio
npm run ai-agency -- update-readme
npm run ai-agency -- cover-letter "Company Name" "Role Title" "Job description"
```

> Note: use the same terminal session for `GITHUB_TOKEN` / `OPENAI_API_KEY` after setting them, or re-open the terminal.

## Project structure

- `src/` — Angular + Ionic application source
- `ai-agency/` — AI agency runtime and task definitions
- `README.portfolio.md` — generated portfolio draft
- `README.backup.md` — backup of the previous README
- `ai-agency/cover-letters/` — generated cover letters

## AI agency overview

The `ai-agency` runtime includes a manifest, GitHub integration, and LLM client. It is designed to make the repository both a product and a career showcase.

### Example commands

- `npm run ai-agency -- preview` — print the current agency structure
- `npm run ai-agency -- portfolio` — generate a portfolio README
- `npm run ai-agency -- update-readme` — replace the root README with generated portfolio content
- `npm run ai-agency -- cover-letter "Company" "Role" "Description"` — create a tailored cover letter

## Contact

This project serves as an AI portfolio and product showcase. For collaboration or hiring inquiries, use the GitHub account associated with this repository.
