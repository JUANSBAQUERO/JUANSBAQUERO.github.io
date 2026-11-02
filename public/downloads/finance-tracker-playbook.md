# Playbook: Build a Personal Finance Tracker (v1)

> A practical guide to shipping a real v1 of a personal finance tracker —
> the same approach used to build [FinanceOS](https://github.com/JUANSBAQUERO/finance-os),
> a configurable personal finance SaaS. Written by Juan Sebastián Baquero.

## 1. Scope the v1 honestly

Don't start with "track everything." A v1 that actually ships handles:

- **Accounts** — cash, bank, credit card balances (manual entry is fine for v1, no bank sync yet)
- **Transactions** — income/expense entries tied to an account and a category
- **Budgets** — a monthly limit per category, compared against actual spend
- **Debts** — balance, interest rate, minimum payment, payoff projection
- **Cash flow** — a rolling view of money in vs. money out over time

Everything else (investment tracking, AI-driven forecasting, goal simulators) is v2+.
Resist scope creep here — a v1 that does 5 things well beats one that does 15 things
half-built.

## 2. Suggested stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fast dev loop, no SSR complexity needed for a dashboard app |
| State | Zustand | Minimal boilerplate vs. Redux; granular selectors avoid over-rendering |
| Server state / cache | TanStack Query | Handles loading/error/retry/cache for every Supabase call for free |
| Forms | React Hook Form + Zod | Schema-validated forms, shared Zod schema between form and API payload |
| Styling | Tailwind CSS + shadcn/ui | Ship UI fast without hand-rolling a design system |
| Charts | Recharts | Cash flow / budget visualizations without a heavy charting lib |
| Backend | Supabase (PostgreSQL + Auth + Row Level Security) | Real relational DB, auth, and per-row security policies without hand-rolling an API server |
| Offline | IndexedDB cache layer | Lets the dashboard render instantly on repeat visits, syncs in background |

## 3. Data model (minimum viable schema)

```
profiles        — one row per user (display name, currency, locale)
settings        — per-user preferences (default account, budget reset day)
accounts        — id, user_id, name, type (cash/bank/credit), balance
transactions    — id, account_id, category, amount, type (income/expense), date, note
budgets         — id, category, monthly_limit, user_id
debts           — id, name, balance, interest_rate, minimum_payment
debt_payments   — id, debt_id, amount, date
goals           — id, name, target_amount, target_date, current_amount
```

Row Level Security (RLS) on every table from day one — `user_id = auth.uid()` as the
baseline policy. Retrofitting RLS after you have real users and real money data is a
much worse day than building it in from the first migration.

## 4. Architecture: keep domain logic framework-free

Structure the frontend feature-first, with each feature split into layers so the
dependency direction always points inward (domain never imports from infrastructure):

```
src/features/<feature>/
├── domain/          — types + Zod schemas + pure business rules
├── application/     — use cases + hooks (TanStack Query, Zustand)
├── infrastructure/  — Supabase client calls, DB <-> domain mappers
└── presentation/    — components, pages, forms
```

Why this matters in practice: a "budget overspend" calculation (sum of transactions in
a category this month vs. the budget limit) belongs in `domain/` as a pure function
that takes transactions + a budget and returns a number — not inline inside a React
component. That function is unit-testable without mocking Supabase, React, or a
browser, and it's the same function whether it's called from a dashboard widget or a
notification worker later.

## 5. Build order that actually gets you to a working v1

1. **Auth + accounts CRUD** — the absolute floor; nothing else works without a signed-in
   user and at least one account to attach transactions to.
2. **Transactions CRUD + categorization** — this is the core data entry loop; get the
   form fast and low-friction (defaults, recent categories) since this is what the user
   touches daily.
3. **Dashboard** — aggregate the transactions into "this month's spend by category" and
   a running balance. This is the first screen that makes the app feel alive.
4. **Budgets** — compare actuals against the limits set per category; surface overspend
   clearly (a progress bar per category reads better than a table).
5. **Debts + payoff projection** — balance, rate, minimum payment → a simple
   amortization projection (even a linear estimate is useful before you build a real
   amortization engine).
6. **Cash flow view** — once transactions + budgets exist, a month-over-month in/out
   chart is mostly a Recharts config away.

## 6. Common mistakes to avoid

- **Building the AI/forecasting feature first.** It's the flashiest idea but it's
  worthless without months of real transaction data to forecast from. Ship the boring
  CRUD first.
- **Skipping RLS "for now."** There is no safe later point to retrofit row-level
  security on financial data.
- **One giant `TransactionForm` component that also fetches, validates, and renders.**
  Split fetch (infrastructure) from validation (domain/Zod) from rendering
  (presentation) from day one — it's a much smaller refactor to do now than after the
  form has 300 lines.
- **Hardcoding currency/locale.** Even if you only support COP today, store currency as
  a field, not an assumption baked into formatting code everywhere.

## 7. Where to go from v1

Once the core loop (accounts → transactions → budgets → debts) works end-to-end:

- **v2 — financial engine:** net worth over time, recurring transaction detection,
  multi-account rollups.
- **v3 — simulator:** "what if I paid an extra $X on this debt" / "what if I saved $X
  more per month" projections.
- **v4 — AI layer:** categorization suggestions from transaction descriptions, spend
  anomaly detection, natural-language queries over the user's own data.

---

Questions, feedback, or want to compare notes on your own build? Reach out via the
contact section of [juansbaquero.github.io](https://juansbaquero.github.io).
