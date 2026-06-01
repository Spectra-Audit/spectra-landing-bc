# Security Policy

Spectra is a blockchain security audit platform, and we take the security of our own software seriously. We appreciate the work of security researchers and welcome responsible disclosure.

## Scope

This policy covers **this repository only** — the public Spectra marketing landing page (the Next.js website at https://spectra-audit.com). Examples of in-scope issues include:

- Cross-site scripting (XSS) or content injection on the landing page
- Misconfigured security headers, caching, or redirects served by this site
- Exposure of sensitive data through this repository or the deployed website
- Dependency vulnerabilities that are exploitable in this site's build or runtime

### Out of scope

The following are **not** covered here and should be reported through the appropriate platform channels:

- Vulnerabilities in the **Spectra platform / web app** (https://app.spectra-audit.com), its APIs, or backend services
- **Smart contract** vulnerabilities, audit-engine behavior, or assessment accuracy
- Issues in third-party services we link to but do not operate

If you are unsure whether something is in scope, report it anyway and we will route it appropriately.

## Reporting a vulnerability

**Please report security issues privately. Do not open a public GitHub issue, pull request, or discussion for a suspected vulnerability**, as that could put users at risk before a fix is available.

Email us at **support@spectra-audit.com** with the details. If you would like to encrypt your report or need an alternative channel, mention that in an initial (non-sensitive) message and we will coordinate.

### What to include

To help us triage and reproduce quickly, please include as much of the following as you can:

- A clear description of the issue and its potential impact
- Step-by-step reproduction instructions, including the affected URL(s) or page(s)
- Proof-of-concept code, requests, or screenshots where applicable
- The environment you observed it in (browser/version, OS) and the affected component
- Any suggested remediation, if you have one

### What to expect

- **Acknowledgement:** we aim to acknowledge your report within a few business days.
- **Updates:** we will keep you informed as we investigate and work toward a fix.
- **Coordination:** we will work with you on a reasonable disclosure timeline and are happy to credit you once the issue is resolved, if you would like to be acknowledged.

### Responsible disclosure guidelines

We ask that you:

- Give us a reasonable opportunity to investigate and remediate before any public disclosure.
- Avoid privacy violations, data destruction, service degradation, or accessing or modifying data that is not yours.
- Only interact with accounts you own or have explicit permission to test.
- Make a good-faith effort to avoid disrupting the service for other users.

We will not pursue or support action against researchers who act in good faith and in accordance with this policy.

## Supported versions

This is a continuously deployed website. The latest commit on the `main` branch (and the version live at https://spectra-audit.com) is the supported version. We do not maintain or patch older snapshots; please ensure any report reflects current `main`.
