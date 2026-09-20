# Obolus Finance API and Remote MCP Examples

Public examples for the Obolus payroll and multi-country tax API. This repository contains a small Vite client, connection examples, and documentation. The hosted calculation engine and MCP server run at obolusfinanz.de; their server source code is not contained in this repository.

## Remote MCP server

Obolus provides a public, read-only MCP endpoint:

- Streamable HTTP: `https://www.obolusfinanz.de/api/mcp/claude`
- Tools: `berechne` for detailed single-country payroll and `taxcompare` for comparisons across two or more countries
- Access: no login or API key required for these read-only tools
- Registry: [`io.github.sanzation/obolus`](https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.sanzation%2Fobolus)
- Full API and MCP documentation: [Obolus Developers](https://www.obolusfinanz.de/en/developers)

The `/claude` URL is the agent-neutral MCP surface despite its historical route name. It is suitable for MCP clients other than Claude. It is separate from the browser-facing ChatGPT app integration at `/api/mcp`.

### Connect from VS Code / GitHub Copilot

This repository includes a [workspace `.mcp.json`](.mcp.json). Open the folder in VS Code, open the MCP server list, and start `obolus`. You can also copy its configuration into your own workspace:

```json
{
  "servers": {
    "obolus": {
      "type": "http",
      "url": "https://www.obolusfinanz.de/api/mcp/claude"
    }
  }
}
```

Ask the agent, for example: "Compare an annual gross salary of EUR 60,000 in Germany and Austria for tax year 2026 using Obolus." The agent should request missing profile details instead of inventing them. Calculations are estimates; inspect each tool's returned assumptions and source information before using a result.

To inspect the public MCP connection without making a calculation, run `npm run mcp:check`. This lists the available tools and checks that both expected tools are present.

## REST API demo

The Vite app demonstrates direct REST calls to `POST /api/berechne` and `POST /api/taxcompare`. It is an API client, not a local MCP server or a copy of the tax engine.

```bash
npm install
npm run dev
```

Open `http://localhost:8080`. The Vite proxy forwards API requests; see [`vite.config.js`](vite.config.js). Build with `npm run build`.

For a current, complete request schema and response examples, use the [developers page](https://www.obolusfinanz.de/en/developers) or [OpenAPI document](https://www.obolusfinanz.de/api/openapi). The browser demo uses the legacy `annual_gross` alias in major currency units. New `taxcompare` integrations should prefer `salary_ct` in minor currency units: `6000000` means EUR 60,000 when `currency` is `eur` and `salary_period` is `annual`. At least two countries and a supported tax year are required. The detailed `berechne` endpoint also uses minor currency units for salary fields.

Example comparison request:

```js
const response = await fetch("https://www.obolusfinanz.de/api/taxcompare", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    salary_ct: 6000000,
    salary_period: "annual",
    tax_year: "2026",
    countries: ["DE", "AT"],
    currency: "eur"
  })
});
if (!response.ok) throw new Error(await response.text());
const result = await response.json();
console.log(result);
```

Supported countries: Germany, Austria, Switzerland, United States, United Kingdom, Ireland, Canada, and Australia. The returned net pay is a tax/payroll result. Housing, groceries, health costs outside payroll, and purchasing-power adjustments are separate models; do not describe payroll net as disposable income after living costs.

## Repository scope and usage

This is a public integration example, not the MCP server's source repository. The hosted API has [usage terms and rate limits](https://www.obolusfinanz.de/en/developers); do not assume unrestricted production access from this demo. Do not commit API keys or other credentials. The public read-only MCP tools need no key.
