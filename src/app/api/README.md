# src/app/api

Thin server routes. Each one belongs to the owner of the module it calls and holds no logic:
it reads the request, calls the module, sends the answer.

- `payments/*` — Khursand, calls `src/payments/server`.
- `connector` — Khursand, calls `src/connector`.
- `helper` — Adilet, calls `src/explain/helper`.
