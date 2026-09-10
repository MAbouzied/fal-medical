## Architecture lifecycle

**At session start:** Read `PROJECT-STRUCTURE.md`, `docs/ARCHITECTURE.md`, and `PRODUCT.md` (when relevant).

**At session end:** Update `docs/ARCHITECTURE.md` (and `PROJECT-STRUCTURE.md` if ownership changed) when your work affects routes, APIs, integrations, or module boundaries.

Agent delegation and scopes: `.cursor/rules/agent-delegation.mdc`.

---

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

Project docs:

- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) — folder ownership
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — system design (update at session end)
- [PRODUCT.md](./PRODUCT.md) — product scope and constraints
