# Obolus API Basic Examples

This repository is a very small public example for the Obolus API.

It focuses on the two public endpoints:

- `POST https://www.obolusfinanz.de/api/berechne`
- `POST https://www.obolusfinanz.de/api/taxcompare`

The goal is to show the smallest useful frontend setup for public usage:

- a slim payroll calculator
- a slim salary compare screen
- minimal inputs
- plain HTML, CSS, and browser JavaScript

## Public URLs

Main website:

- https://www.obolusfinanz.de/en

Developer documentation:

- https://www.obolusfinanz.de/en/developers

OpenAPI specification:

- https://www.obolusfinanz.de/api/openapi

MCP discovery:

- https://www.obolusfinanz.de/api/mcp

Direct endpoints:

- `POST https://www.obolusfinanz.de/api/berechne`
- `POST https://www.obolusfinanz.de/api/taxcompare`

## Why this repo exists

Obolus exposes a slim public API for payroll and salary-comparison workflows.

This example is meant for developers who want to:

- test the API quickly
- understand the basic request shape
- embed a lightweight payroll widget
- embed a lightweight salary comparison widget
- start from a minimal frontend instead of a full framework app

## Included files

- `index.html`
  Small two-tab demo UI
- `styles.css`
  Lightweight UI inspired by the Obolus TaxApp surface
- `app.js`
  Plain browser-side fetch calls to the public API
- `package.json`
  Minimal Vite setup
- `vite.config.js`
  Tiny local dev and preview configuration
- `coins.svg`
  Reused Obolus brand icon from the main frontend
- `og-image.png`
  Reused Obolus social preview image from the main frontend

## Endpoint examples

### berechne

`POST https://www.obolusfinanz.de/api/berechne`

This example sends a one-person payload and lets the public route normalize the remaining defaults.

Example body:

```json
{
  "Land": "DE",
  "Stjahr": 2026,
  "Currency": "EUR",
  "LZZ": 1,
  "Modus": 1,
  "Personen": [
    {
      "Land": "DE",
      "Gehalt_ct": 6000000,
      "Gehalt_ct_ohne_Sonst": 6000000,
      "Steuerklasse": 1,
      "Geburtsjahr": 1990
    }
  ]
}
```

### taxcompare

`POST https://www.obolusfinanz.de/api/taxcompare`

This example compares one annual gross salary across a small country set.

Example body:

```json
{
  "annual_gross": 60000,
  "tax_year": "2026",
  "countries": ["DE", "AT", "CH", "AU", "CA", "IE"],
  "currency": "eur"
}
```

## Authentication

The UI supports an optional API key field.

Preferred header:

`x-public-api-key: YOUR_API_KEY`

Depending on deployment, some requests may work without a key, but production usage should use one.

## Local development

This repo intentionally keeps the app code framework-light, but uses Vite for a clean developer workflow.

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open:

`http://localhost:8080`

Important:

- local development uses the Vite proxy under `/api`
- the default demo config is therefore `API base URL = /api`
- this avoids browser CORS errors when calling the live Obolus API from localhost

Create a production build:

```bash
npm run build
```

Preview the built version:

```bash
npm run preview
```

## Project approach

This repository uses:

- Vite for local development and preview
- plain HTML for structure
- plain CSS for styling
- plain browser JavaScript for API calls

That keeps the example easy to understand, easy to copy into other projects, and easy to embed into a small site or documentation portal.

## CORS note

If you deploy this demo on a different origin and call:

- `https://www.obolusfinanz.de/api/berechne`
- `https://www.obolusfinanz.de/api/taxcompare`

directly from the browser, the API must explicitly allow that origin via CORS.

For local development, this repo avoids that issue by using the Vite dev proxy:

- browser -> `http://localhost:8080/api/...`
- Vite proxy -> `https://www.obolusfinanz.de/api/...`

If you want to host the demo publicly on another domain, use one of these approaches:

1. Add a same-origin proxy in your host app or edge layer
2. Enable CORS on the API for the target origin
3. Serve the example from the same origin as the API

## Notes

- `berechne` expects salary amounts in minor currency units, so the UI converts annual gross salary into cents before sending.
- `taxcompare` expects annual gross salary in major currency units.
- This example intentionally leaves out advanced product logic like scenario persistence, budget handoff, cockpit flows, and user accounts.
- For the authoritative public API description, always refer to:
  - https://www.obolusfinanz.de/en/developers
  - https://www.obolusfinanz.de/api/openapi
