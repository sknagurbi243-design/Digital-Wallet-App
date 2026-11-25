# Luma Wallet

A responsive, frontend-only digital wallet demo built with React, Vite, React Router, React Icons, and Recharts.

## Run locally

```bash
npm install
npm run dev
```

The app is published at [https://sushma040707-code.github.io/Digital-Wallet-App/](https://sushma040707-code.github.io/Digital-Wallet-App/). Updates pushed to `main` are deployed automatically with GitHub Actions.

Use the **Create an account** link to register with any valid email and a password of at least eight characters. Sign-in is simulated; there is no backend or external payment integration.

## Demo features

- Dashboard with wallet balance, recent activity, cash flow, and budget summary.
- Simulated wallet top-ups and recipient payments, with confirmation and success states.
- Searchable and filterable transaction history and spending analytics.
- Editable profile, notification preferences, and demo password form.
- Wallet, account, and transaction data stored in browser `localStorage`.

All payment actions are simulated and do not move real funds. Clearing this site’s local storage resets the demo data.
