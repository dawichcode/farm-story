# Farm Story

Farmer onboarding and farm intelligence platform, built as a practical assessment for Nimfour Consulting Group.

---

## Overview

Farm Story allows smallholder farmers to register, create detailed farm profiles, record GPS location and production data, receive a Farm Opportunity Score with targeted recommendations, and submit service requests. An administrator interface provides a dashboard, farmer list with search, full farmer records, and a service request queue.

---

## Features

| Code | Feature | Status |
|---|---|---|
| F1 | Farmer registration with generated Farmer ID | Done |
| F2 | Multi-step farm registration wizard | Done |
| F3 | Farm location via Leaflet map or manual coordinates | Done |
| F4 | Farm intelligence: opportunity score + recommendations | Done |
| F5 | Deterministic rules engine with 5 recommendation rules | Done |
| F6 | Take Action panel: 5 service types | Done |
| F7 | Service request submission with reference number | Done |
| F8 | Admin dashboard with 4 metric cards + county table | Done |
| F9 | Admin farmer list with debounced search | Done |
| F10 | Admin farmer detail: profile, farm, map, intelligence, requests | Done |
| F11 | Admin service request list | Done |
| Bonus | CSV export of all farmers with farm data | Done |

---

## Architecture

```
Next.js (port 3000)
        |
        | HTTP REST / JSON
        v
Laravel API (port 8001)
        |
        v
      SQLite
```

The application is a modular monolith. The Laravel backend exposes a RESTful JSON API. The Next.js frontend is a separate process that communicates exclusively over HTTP. There is no shared state, no shared database connection, and no server-rendered API calls from Next.js.

---

## Technology Stack

### Backend

| | |
|---|---|
| Framework | Laravel 13 |
| Language | PHP 8.4 |
| Database | SQLite via Eloquent ORM |
| Validation | Laravel Form Requests |
| Business logic | `FarmIntelligenceService` (deterministic rules engine) |
| Cache | Array driver (request-scoped only) |

### Frontend

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Icons | lucide-react |
| State | Zustand 5 |
| Maps | Leaflet 1.9.4 + OpenStreetMap |
| HTTP | Native fetch wrapped in `lib/api.ts` |

---

## Project Structure

```
farmstory/
├── api/                    Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Controller.php           success/error/paginatedSuccess helpers
│   │   │   │   ├── FarmerController.php
│   │   │   │   ├── FarmController.php
│   │   │   │   ├── InsightController.php
│   │   │   │   ├── ServiceRequestController.php
│   │   │   │   └── Admin/
│   │   │   │       └── AdminController.php  dashboard, farmers, export, requests
│   │   │   └── Requests/
│   │   │       ├── StoreFarmerRequest.php
│   │   │       ├── StoreFarmRequest.php
│   │   │       └── StoreServiceRequestRequest.php
│   │   ├── Models/
│   │   │   ├── Farmer.php
│   │   │   ├── Farm.php
│   │   │   ├── FarmInsight.php
│   │   │   └── ServiceRequest.php
│   │   └── Services/
│   │       └── FarmIntelligenceService.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── DemoFarmerSeeder.php
│   └── routes/
│       └── api.php
│
└── web/                    Next.js frontend
    ├── app/
    │   ├── page.tsx                    Landing page
    │   ├── farmer/
    │   │   ├── register/page.tsx       Farmer registration
    │   │   ├── [farmerId]/page.tsx     Farmer dashboard
    │   │   ├── [farmerId]/farm/
    │   │   │   ├── new/page.tsx        Multi-step farm registration
    │   │   │   └── [farmId]/page.tsx   Farm detail, intelligence, take action
    │   │   └── [farmerId]/requests/page.tsx
    │   └── admin/
    │       ├── layout.tsx              Sidebar layout
    │       ├── page.tsx                Dashboard
    │       ├── farmers/page.tsx        Farmer list + CSV export
    │       ├── farmers/[farmerId]/page.tsx
    │       └── requests/page.tsx
    ├── components/
    │   ├── ui/             Button, Card, Badge, Input, Label, Select, Spinner
    │   ├── farmer/         FarmerRegistrationForm, FarmerIdCard, ServiceRequestList
    │   ├── farm/           FarmRegistrationForm, FarmIntelligenceCard,
    │   │                   RecommendationCard, ProductionMetrics, TakeActionPanel
    │   ├── admin/          DashboardMetricCard, FarmerTable, FarmerSearchInput,
    │   │                   ServiceRequestTable
    │   └── map/            FarmLocationPicker, FarmLocationMap
    ├── lib/
    │   ├── api.ts          All API calls with envelope unwrapping
    │   ├── types.ts        Shared TypeScript interfaces
    │   └── utils.ts        Pure formatting utilities
    └── store/
        ├── useFarmerStore.ts
        └── useFarmFormStore.ts
```

---

## Database Schema

### `farmers`

| Column | Type |
|---|---|
| id | bigint PK |
| farmer_id | string unique (`FS-KEN-000001`) |
| full_name | string |
| mobile_number | string |
| email | string nullable |
| county | string |
| preferred_language | string |

### `farms`

| Column | Type |
|---|---|
| id | bigint PK |
| farmer_id | FK |
| farm_name, location | string |
| latitude, longitude | decimal(10,7) |
| size_acres | decimal(8,2) |
| primary_crop | string |
| coffee_varieties | string nullable |
| coffee_tree_count | integer nullable |
| estimated_annual_production | decimal(10,2) nullable |
| last_harvest_date | string nullable |
| challenges | json array |

### `farm_insights`

| Column | Type |
|---|---|
| id | bigint PK |
| farm_id | FK unique |
| score | integer (0-100) |
| summary | text |
| recommendations | json array |

### `service_requests`

| Column | Type |
|---|---|
| id | bigint PK |
| reference | string unique (`REQ-000001`) |
| farmer_id, farm_id | FK |
| type | string |
| status | string (default: `pending`) |
| notes | text nullable |

---

## API

All responses use a consistent envelope:

```json
{ "success": true,  "data": {},   "message": "..." }
{ "success": false, "data": null, "message": "...", "errors": {} }
```

Paginated responses include a `meta` object with cursor fields.

### Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/farmers` | Register farmer |
| GET | `/api/farmers` | List farmers (cursor paginated) |
| GET | `/api/farmers/{id}` | Get farmer by ID or farmer_id string |
| GET | `/api/farms` | List farms (filterable by farmer_id) |
| POST | `/api/farms` | Create farm |
| GET | `/api/farms/{id}` | Get farm |
| GET | `/api/farms/{id}/insight` | Get or generate farm intelligence |
| POST | `/api/service-requests` | Submit service request |
| GET | `/api/service-requests` | List requests (filterable) |
| GET | `/api/admin/dashboard` | Dashboard metrics |
| GET | `/api/admin/farmers` | Farmer list with search |
| GET | `/api/admin/farmers/export` | CSV download |
| GET | `/api/admin/farmers/{id}` | Full farmer record |
| GET | `/api/admin/requests` | Service request list |

---

## Farm Intelligence Logic

The `FarmIntelligenceService` runs a deterministic rules engine. It is not an AI model.

### Scoring formula

```
Base score:                      100
Per active challenge:             -12  (each of the 7 challenge types)
Unknown last harvest date:        -12
Coffee prod/tree below 2.0 kg:    -8   (coffee farms only)
Floor:                              0
```

The seeded demo farmer (John Mwangi, 1 challenge, unknown harvest, 1.64 kg/tree) scores **68/100** by design.

### Recommendation rules

| Condition | Category | Guidance |
|---|---|---|
| `low_yield` in challenges | LOW YIELD | Agronomist assessment |
| last harvest unknown | SOIL | Soil test |
| `soil_quality` in challenges | SOIL QUALITY | Soil assessment |
| `pests_disease` in challenges | PESTS / DISEASE | Agronomist assessment |
| `access_to_buyers` in challenges | MARKET ACCESS | Buyer/offtake support |
| Coffee prod/tree < 2.0 kg | COFFEE QUALITY | Coffee quality assessment |

---

## Running Locally

### Prerequisites

- PHP 8.4 and Composer
- Node.js 20+ and npm
- SQLite (bundled with PHP)

### Backend

```bash
cd api
composer install
cp .env.example .env          # then set APP_KEY, DB_DATABASE absolute path
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan serve --port=8001
```

### Frontend

```bash
cd web
npm install
# .env.local already contains NEXT_PUBLIC_API_URL=http://localhost:8001/api
npm run dev
```

Open `http://localhost:3000`.

---

## Environment Variables

### `api/.env` (key values)

```
APP_NAME="Farm Story API"
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/api/database/database.sqlite
CACHE_STORE=array
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:8001
```

### `web/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

---

## Demo Account / Seed Data

Run `php artisan db:seed` from the `api/` directory. This creates:

| Field | Value |
|---|---|
| Name | John Mwangi |
| Farmer ID | `FS-KEN-000001` |
| County | Nyeri |
| Farm | John's Coffee Farm |
| Size | 2.5 acres |
| Crop | Coffee (SL28, Ruiru 11) |
| Trees | 1,100 |
| Production | 1,800 kg cherry |
| Challenge | Low yield |
| Score | 68 / 100 |

To walk the full demo journey without registering manually, visit `http://localhost:3000/farmer/1` or click "View demo farm" on the landing page.

---

## Known Limitations

- Authentication is intentionally simplified for the MVP. Route separation (farmer vs admin) is by URL path, not by session or token.
- The Farm Opportunity Score uses a prototype rules engine and is not a scientifically validated agronomic model.
- The application does not integrate live weather or satellite data.
- SQLite is used for the prototype. It is not suitable for concurrent production workloads.
- Payments and a buyer/offtake marketplace are not implemented.
- Offline synchronisation is not implemented.
- The map uses OpenStreetMap/Leaflet with no geocoding.

---

## Scaling to 100,000 Farmers

### Phase 1 (current): MVP

```
Next.js -> Laravel -> SQLite
```

Validates the product. Suitable for demo and initial pilot.

### Phase 2: Growth

- Migrate SQLite to **PostgreSQL** with proper indexes
- Add a connection pooler (e.g. PgBouncer)
- Deploy multiple stateless Laravel instances behind a load balancer
- Introduce background job queues for intelligence generation (Laravel Horizon + Redis)
- Add object storage (S3-compatible) for any file uploads for long term
- Local storage upload for a start
- Centralised logging and monitoring (Datadog, CloudWatch)
- Automated daily database backups

### Phase 3: Agricultural platform at scale

As distinct workloads grow, extract them into independent services only where team size or traffic justifies it:

```
Farmer/Farm Service
Weather Integration Service
Satellite Processing Service
Recommendation Engine
Notification Service
Payments / Buyer Offtake
```

Use asynchronous events (farm updated, recommendation generated, notification dispatched) to decouple services without tight coupling.

For the data layer at millions of records:
- PostgreSQL with read replicas for heavy reporting
- Partitioning on time-based columns where query patterns require it
- A dedicated analytics warehouse (BigQuery, Redshift) for aggregate reporting, separated from the transactional database

The core architectural principle: **start as a modular monolith, extract services only when the product and team actually require it**. The Laravel application already has clear bounded contexts (Farmers, Farms, Intelligence, Service Requests, Administration) that map naturally to future service boundaries.

---

## AI Development Tools Used

This prototype was developed with assistance from **Kiro** (an AI-powered development environment by AWS) for architecture planning, scaffolding, implementation, and documentation.

No AI-generated code was committed without being read and understood.
