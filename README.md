# Inspection Record Management System

A full-stack web application for managing industrial inspection records in warehouse/yard operations. Built with Laravel 12, Vue 3, Inertia.js, and TypeScript.

The system tracks inspection requests from creation through completion — managing items, lots, quality standards, and scope of work (SOW).

## Tech Stack

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Backend  | PHP 8.2+, Laravel 12, Inertia.js                           |
| Frontend | Vue 3, TypeScript, Tailwind CSS 4, Vite 7                  |
| UI       | Reka UI (headless), Shadcn/Vue-inspired components, Lucide |
| Forms    | VeeValidate + Zod schema validation                        |
| Tables   | TanStack Vue Table                                         |
| State    | Pinia                                                      |
| Testing  | Pest PHP (backend), Vitest (frontend)                      |
| Database | SQLite (default), MySQL/PostgreSQL supported               |

## Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm

## Installation

### Quick Setup

```bash
composer setup
```

This single command runs all setup steps:

1. `composer install` — install PHP dependencies
2. Copy `.env.example` to `.env`
3. Generate `APP_KEY`
4. Run database migrations
5. `npm install` — install Node dependencies
6. `npm run build` — compile frontend assets

### Manual Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file and generate app key
cp .env.example .env
php artisan key:generate

# Create SQLite database and run migrations
touch database/database.sqlite
php artisan migrate

# Install Node dependencies
npm install
```

## Development

Start all development services (Laravel server, queue worker, log viewer, Vite dev server) with a single command:

```bash
composer dev
```

This runs concurrently:

| Service                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| `php artisan serve`        | Laravel dev server at `http://localhost:8000` |
| `php artisan queue:listen` | Queue worker                                  |
| `php artisan pail`         | Real-time log viewer                          |
| `npm run dev`              | Vite HMR dev server                           |

### With SSR

```bash
composer dev:ssr
```

## Testing

### Backend (Pest PHP)

```bash
# Run all tests (lint + test suite)
composer test

# Run lint check only
composer test:lint
```

### Frontend (Vitest)

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Code Quality

```bash
# PHP formatting (Laravel Pint)
composer lint

# JavaScript/TypeScript linting
npm run lint

# Prettier formatting
npm run format
```

## Build for Production

```bash
# Standard build
npm run build

# With SSR
npm run build:ssr
```

## Project Structure

```
app/
├── Data/                          # Data layer (JSON-based storage)
│   └── InspectionData.php
├── Http/Controllers/Api/          # API controllers
│   └── InspectionController.php
└── Models/

resources/js/
├── pages/                         # Inertia page components
│   ├── InspectionRecordList.vue
│   ├── InspectionRecordCreate.vue
│   └── InspectionRecordDetail.vue
├── modules/inspection-record/     # Feature module
│   ├── types/                     # TypeScript interfaces
│   ├── composables/               # Vue composables
│   ├── stores/                    # Pinia stores
│   ├── schemas/                   # Zod validation schemas
│   └── components/                # Feature components
├── components/ui/                 # Shared UI components
└── layouts/

routes/
├── web.php                        # Inertia page routes
└── api.php                        # JSON API routes
```

## API Endpoints

| Method | Endpoint                           | Description                                          |
| ------ | ---------------------------------- | ---------------------------------------------------- |
| GET    | `/api/inspection`                  | List inspection records (supports `?status=` filter) |
| POST   | `/api/inspection`                  | Create a new inspection record                       |
| GET    | `/api/inspection/{no}`             | Get a single record by number                        |
| GET    | `/api/inspection/yards`            | List available yards                                 |
| GET    | `/api/inspection/customers`        | List customers                                       |
| GET    | `/api/inspection/tpi-companies`    | List TPI companies                                   |
| GET    | `/api/inspection/items`            | List available items                                 |
| GET    | `/api/inspection/items/{id}/stock` | Get stock for an item                                |
| GET    | `/api/inspection/sow-templates`    | List SOW templates                                   |

## Key Features

- **Inspection Records** — Create, list, and view inspection records with status tracking (Draft, New, For Review, Completed, Cancelled)
- **Scope of Work (SOW)** — Dynamic SOW templates (ADNOC Requirements, Standard Inspection, API Specification) with configurable subscopes
- **Item & Lot Management** — Track items by code, batch/lot, allocation, ownership, condition, and quantities
- **Stock Position Lookup** — Cascading filters (Lot > Allocation > Owner > Condition) for stock availability
- **Data Tables** — Sortable, filterable tables powered by TanStack Vue Table

## Data Storage

The application currently uses JSON file storage (`storage/app/data/inspection_records.json`) with in-memory reference data. This makes it easy to run without database configuration for inspection data, while SQLite handles sessions, cache, and queues.

## License

MIT
