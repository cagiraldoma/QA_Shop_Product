# QA Practice Product

A full-stack e-commerce application built for QA practice. The entire stack runs via Docker Compose — no local installs required beyond Docker.

**Stack:** React 19 · Vite · TypeScript · TailwindCSS · NestJS · Prisma · PostgreSQL 15

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Running the project

**First time (or after code changes):**

```bash
docker compose up --build
```

**Subsequent runs:**

```bash
docker compose up
```

**Stop everything:**

```bash
docker compose down
```

> Each startup resets and re-seeds the database with fresh data — ideal for repeatable QA sessions.

---

## Services

| Service     | URL                            | Description                    |
| ----------- | ------------------------------ | ------------------------------ |
| Frontend    | http://localhost:80            | React app                      |
| Backend API | http://localhost:3000/api      | NestJS REST API                |
| Swagger UI  | http://localhost:3000/api/docs | Interactive API docs           |
| PostgreSQL  | localhost:5432                 | Database                       |
| PgAdmin     | http://localhost:5050          | DB admin UI (dev profile only) |

---

## PgAdmin (optional)

To start PgAdmin alongside the other services:

```bash
docker compose --profile dev up
```

Then open http://localhost:5050 and log in with:

| Field    | Value             |
| -------- | ----------------- |
| Email    | `admin@admin.com` |
| Password | `admin`           |

To connect to the database from within PgAdmin, create a new server with:

| Field    | Value          |
| -------- | -------------- |
| Host     | `db`           |
| Port     | `5432`         |
| Database | `ecommerce_qa` |
| Username | `postgres`     |
| Password | `postgres`     |

> Use `db` as the host (not `localhost`) — PgAdmin runs inside the Docker network.

---

## Database connection

For external clients (DBeaver, TablePlus, DataGrip, psql, etc.):

| Field    | Value          |
| -------- | -------------- |
| Host     | `localhost`    |
| Port     | `5432`         |
| Database | `ecommerce_qa` |
| Username | `postgres`     |
| Password | `postgres`     |

**Connection string:**

```
postgresql://postgres:postgres@localhost:5432/ecommerce_qa
```

**psql via Docker:**

```bash
docker exec -it qa_shop_db psql -U postgres -d ecommerce_qa
```

---

## Test accounts

| Role       | Email                | Password    | Notes              |
| ---------- | -------------------- | ----------- | ------------------ |
| Admin      | `admin@qashop.com`   | `Admin123!` | Full access        |
| Customer 1 | `customer1@test.com` | `Test123!`  | 2 orders, 1 review |
| Customer 2 | `customer2@test.com` | `Test123!`  | 1 pending order    |
| Customer 3 | `customer3@test.com` | `Test123!`  | Cart with items    |
| Customer 4 | `customer4@test.com` | `Test123!`  | Clean account      |
| Customer 5 | `customer5@test.com` | `Test123!`  | 3 addresses        |

---

## Test coupons

| Code      | Type         | Details                                    |
| --------- | ------------ | ------------------------------------------ |
| `SAVE10`  | Percentage   | 10% off                                    |
| `SAVE20`  | Percentage   | 20% off                                    |
| `FLAT15`  | Fixed amount | $15 off                                    |
| `BIGDEAL` | Percentage   | Large discount                             |
| `EXPIRED` | —            | Expired coupon (should be rejected)        |
| `MAXUSED` | —            | Exhausted usage limit (should be rejected) |

---

## Data model

| Entity                | Description                              |
| --------------------- | ---------------------------------------- |
| `User`                | Customers and admins                     |
| `Product`             | Items with stock, price, images, ratings |
| `Category`            | Hierarchical (supports parent/child)     |
| `Cart` / `CartItem`   | One cart per user                        |
| `Order` / `OrderItem` | Full order lifecycle                     |
| `Address`             | Shipping/billing addresses per user      |
| `Review`              | One review per user per product          |
| `Coupon`              | Percentage or fixed-amount discounts     |

**Order status flow:**

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → REFUNDED
       ↘           ↘
        CANCELLED   CANCELLED
```

---

## Environment variables

Copy `.env.example` to `.env` before the first run. Default values work out of the box for local development:

```bash
cp .env.example .env
```

Key variables:

| Variable            | Default                 | Description         |
| ------------------- | ----------------------- | ------------------- |
| `POSTGRES_DB`       | `ecommerce_qa`          | Database name       |
| `POSTGRES_USER`     | `postgres`              | DB username         |
| `POSTGRES_PASSWORD` | `postgres`              | DB password         |
| `JWT_SECRET`        | `supersecretjwt`        | JWT signing secret  |
| `JWT_EXPIRES_IN`    | `7d`                    | Token expiry        |
| `CORS_ORIGIN`       | `http://localhost:5173` | Allowed CORS origin |
