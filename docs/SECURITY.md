# Security policy

## Supported versions

This project is under active development on `main`. Only the latest commit on `main` receives security fixes.

## Reporting a vulnerability

Please do not open a public GitHub issue for security reports. Instead, use GitHub's private vulnerability reporting: open the repository's **Security** tab and select **Report a vulnerability**.

Include, where possible:
- A description of the issue and its potential impact
- Steps to reproduce it
- Any relevant logs, screenshots, or a minimal reproduction

Reports will be acknowledged within a few days, with updates as the issue is investigated.

## Scope

This app is client-only with zero backend: there is no server, database, or API handling user data, and all state lives in the visitor's own browser via `localStorage`. That limits the realistic attack surface to:

- Vulnerable dependencies (tracked via Dependabot)
- XSS through rendered markdown/HTML in the live preview, since the compiler intentionally allows raw HTML fallbacks (`<p align>`, `<table>`) for GitHub-flavored layout
- Build and deploy configuration (see the production checklist in this repo)

Because block data is never synced or shared between users, there is currently no stored-XSS path across different visitors. If import/export of block state from external files or URLs is added later, that input must be sanitized before being rendered or compiled.
