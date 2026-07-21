# BudgetWise 💰

A full-stack personal finance app for tracking income and expenses, planning
monthly budgets, and getting smart, rule-based insights into your spending —
built with React, Node.js/Express, and MySQL.

---

## Features

- **Authentication** — register, login, logout, JWT-based sessions
- **Dashboard** — total income, total expense, remaining balance, monthly
  budget, savings, and recent transactions at a glance
- **Income & Expense tracking** — add, edit, delete, and search records,
  with expenses organized into 9 categories (Food, Rent, Shopping, Travel,
  Education, Health, Entertainment, Bills, Others)
- **Budget planning** — set a monthly budget per category and track it
  against real spending
- **Analytics Dashboard** — pie, bar, and line charts breaking down
  spending by category and by day
- **Smart Budget Insights** — rule-based (no AI) analysis that flags things
  like exceeded budgets, category spending spikes month-over-month,
  highest spending category, savings, and average daily spend
- **Transaction History** — search, filter by category/date/type, and sort
- **Profile management** — update name, change password
- **Reports** — monthly summary plus CSV export for income and expenses

---

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React (Vite), React Router, Axios, Recharts  |
| Backend    | Node.js, Express.js                          |
| Database   | TiDB Cloud (MySQL-compatible, serverless)    |
| Auth       | JWT, bcrypt                                  |
| Deployment | Vercel (frontend) · Render (backend) · TiDB Cloud (database) |

---

## Project Structure

```
BudgetWise/
├── client/                 React frontend (Vite)
│   ├── src/
│   │   ├── components/     Navbar, PrivateRoute, StatCard, TransactionTable
│   │   ├── pages/           Home, Login, Register, Dashboard, Income, Expense,
│   │   │                    Budget, Analytics, TransactionHistory, Profile, Reports
│   │   ├── context/         AuthContext (JWT session state)
│   │   ├── services/        Axios API client
│   │   └── utils/           Formatting helpers, category constants
│   └── index.html
│
└── server/                 Express backend
    ├── config/              MySQL connection pool
    ├── controllers/         Route handlers (auth, income, expense, budget,
    │                        dashboard, profile, reports)
    ├── models/               SQL queries per table
    ├── routes/               Express routers
    ├── middleware/           JWT auth guard, error handler
    └── database/schema.sql   MySQL schema
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A MySQL-compatible database. This project is configured for **[TiDB Cloud](https://tidbcloud.com)**
  (a free, serverless, MySQL-compatible cloud database), but any standard MySQL
  works too — see [Getting Your Database](#getting-your-database) below.

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/budgetwise.git
cd budgetwise
```

### 2. Getting your database (TiDB Cloud)

1. Sign up free at [tidbcloud.com](https://tidbcloud.com) and create a
   **Serverless** cluster (the free tier used in this project).
2. Open your cluster → click **Connect** → choose **General** (or **Node.js**)
   to reveal your connection details: host, port (`4000`), user (looks like
   `xxxxxxxx.root`), and password.
3. Load the schema using the **SQL Editor** tab in the TiDB Cloud console
   (left sidebar) — paste the contents of `server/database/schema.sql` and
   run it. This avoids needing the `mysql` CLI or any local TLS setup.
4. Copy the host/port/user/password into `server/.env` as shown below —
   TiDB Cloud requires TLS, so make sure `DB_SSL=true` stays set.

> Using plain MySQL instead? Any host works the same way — just load
> `server/database/schema.sql` via your usual client and set `DB_SSL=false`
> if it doesn't require TLS.

### 3. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your TiDB Cloud (or MySQL) credentials from the step above,
plus a random `JWT_SECRET`.

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/health`.

### 4. Frontend setup

In a new terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`, register an account, and start tracking.

---

## Environment Variables

**server/.env**

| Variable       | Description                                  |
|----------------|-----------------------------------------------|
| `PORT`         | Port the API listens on (default `5000`)      |
| `DB_HOST`      | TiDB Cloud (or MySQL) host                    |
| `DB_PORT`      | `4000` for TiDB Cloud, `3306` for standard MySQL |
| `DB_USER`      | TiDB Cloud user (e.g. `xxxxxxxx.root`) or MySQL user |
| `DB_PASSWORD`  | Database password                             |
| `DB_NAME`      | Database name (`budgetwise`)                  |
| `DB_SSL`       | `true` for TiDB Cloud (required) and most managed hosts |
| `JWT_SECRET`   | Long random string used to sign auth tokens   |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                   |
| `CLIENT_URL`   | Deployed frontend URL, for CORS               |

**client/.env**

| Variable       | Description                          |
|----------------|----------------------------------------|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## API Reference

| Method | Endpoint                | Description              |
|--------|--------------------------|---------------------------|
| POST   | `/api/auth/register`     | Create an account         |
| POST   | `/api/auth/login`        | Log in, returns JWT       |
| POST   | `/api/auth/logout`       | Log out                   |
| GET    | `/api/income`             | List income (supports `search`, `startDate`, `endDate`) |
| POST   | `/api/income`             | Add income                |
| PUT    | `/api/income/:id`         | Update income             |
| DELETE | `/api/income/:id`         | Delete income             |
| GET    | `/api/expense`            | List expenses (supports `search`, `category`, `startDate`, `endDate`) |
| POST   | `/api/expense`            | Add expense                |
| PUT    | `/api/expense/:id`        | Update expense              |
| DELETE | `/api/expense/:id`        | Delete expense              |
| GET    | `/api/budget`             | List budgets for a month/year |
| POST   | `/api/budget`             | Set a category budget      |
| PUT    | `/api/budget/:id`         | Update a budget             |
| DELETE | `/api/budget/:id`         | Delete a budget             |
| GET    | `/api/dashboard`          | Dashboard summary + insights |
| GET    | `/api/dashboard/analytics`| Chart data for a month     |
| GET    | `/api/profile`            | Get current user profile   |
| PUT    | `/api/profile`            | Update name / password     |
| GET    | `/api/reports/summary`    | Monthly income/expense summary |
| GET    | `/api/reports/income/csv` | Download income as CSV     |
| GET    | `/api/reports/expense/csv`| Download expenses as CSV   |

All routes except `/api/auth/*` require an `Authorization: Bearer <token>` header.

---

## Deployment

This app deploys cleanly as three pieces: a database, the Express API,
and the React frontend.

1. **Database** — this project uses [TiDB Cloud](https://tidbcloud.com)'s
   free Serverless tier (MySQL-compatible). Create a cluster, run
   `server/database/schema.sql` in its SQL Editor, and note the connection
   details from the **Connect** panel. (Any managed MySQL host works too.)
2. **Backend → Render** — new Web Service, root directory `server`,
   build command `npm install`, start command `npm start`. Add all the
   `server/.env` variables above as environment variables — including
   `DB_SSL=true` for TiDB Cloud.
3. **Frontend → Vercel** — new Project, root directory `client`, framework
   auto-detected as Vite. Add `VITE_API_URL` pointing at your Render API
   URL + `/api`.
4. Update `CLIENT_URL` on Render to your live Vercel URL so CORS allows it.

---

## Future Enhancements

- Email notifications
- Dark mode
- Recurring expenses
- UPI integration
- OCR bill scanner
- Mobile app
- Multi-language support

---

## License

This project is available for personal and educational use. Add a license
of your choice (MIT is a common pick for open-source projects) before
publishing publicly.
