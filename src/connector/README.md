# src/connector

Owner: Khursand. Lets ChatGPT and Claude read a bill review through the Model Context Protocol (MCP).
The address is `https://<site>/api/connector`. It is read-only: it checks text and stores nothing.

- `tools.ts` — the one tool, `check_birth_bill`: paper text in, findings and money in question out.
- `rpc.ts` — answers the few MCP messages an assistant sends (initialize, tools/list, tools/call, ping).
- `index.ts` — `handleConnectorMessage`, used by the route in `src/app/api/connector`.

To try it: in Claude open Settings, Connectors, "Add custom connector" and paste the address.
In ChatGPT turn on developer mode and add the same address as a connector.

The assistant gets the same result as the site: rules written in code find the problems,
the assistant only talks about them. No names or policy numbers are returned.
