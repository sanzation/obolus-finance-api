const endpoint = process.env.OBOLUS_MCP_URL || "https://www.obolusfinanz.de/api/mcp/claude";
const protocolVersion = "2025-11-25";

async function request(id, method, params) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "MCP-Protocol-Version": protocolVersion,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, ...(params ? { params } : {}) }),
    signal: AbortSignal.timeout(15000),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${method}: HTTP ${response.status} ${body.slice(0, 300)}`);
  if (response.headers.get("content-type")?.includes("text/event-stream")) {
    throw new Error(`${method}: unexpected event stream; this minimal check expects JSON`);
  }
  const message = JSON.parse(body);
  if (message.error) throw new Error(`${method}: ${JSON.stringify(message.error)}`);
  return message.result;
}

await request(1, "initialize", {
  protocolVersion,
  capabilities: {},
  clientInfo: { name: "obolus-public-example", version: "0.1.0" },
});
const result = await request(2, "tools/list");
const names = new Set(result?.tools?.map((tool) => tool.name));
for (const expected of ["berechne", "taxcompare"]) {
  if (!names.has(expected)) throw new Error(`Missing expected tool: ${expected}`);
}
console.log(`MCP endpoint reachable: ${endpoint}`);
console.log(`Tools: ${[...names].join(", ")}`);
