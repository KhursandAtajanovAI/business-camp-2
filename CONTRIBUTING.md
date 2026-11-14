# Contributing

Three people work in parallel, each with an AI agent, in one repository.

## Rules

1. **Your folders only.** Every folder has one owner (see the table in `README.md`).
   Do not edit another owner's folder, even for a typo: ask the owner.
2. **Contracts.** Streams talk only through `src/contracts` and each module's `index.ts`.
   Contracts change only when all three agree; Khursand makes the commit.
   While another module is not ready, use a stub of the same shape and mark it `STUB`.
3. **Branches.** `stage-<N>/<person>-<package>`, for example `stage-1/adilet-A1`.
   Run `git pull origin main` before you start a stage.
4. **Commits.** `Stage N / Commit M: what the product can do now`, in plain English.
   One commit is one step you can run and show. No `fix` or `update` messages.
   Push after every commit.
5. **Main.** Nobody pushes to `main`. At the end of a stage check that typecheck, tests
   and build pass, then ask Khursand to merge.
6. **package.json** is the one shared file: add a library in its own small commit and tell the team.
7. **Simple code.** One topic is one folder, at most three levels deep, files up to about
   150 lines, a short `README.md` in every folder, tests next to the code.
8. **Money** is stored in cents. Rules and math are code with tests; the model only explains.
9. **Words.** All user-facing text is in English. No promise of a refund ("money in question"),
   no medical or legal advice.
10. **Secrets.** Never commit secrets, `.env` files, personal data or real patient data.
    Check `git diff --staged` before every commit. See `SECURITY.md`.

## Work packages

The list of packages and who took each one is in [TASKS.md](TASKS.md).
