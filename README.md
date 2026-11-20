# Coy Discover

Coy Discover is a Next.js application foundation for a profile discovery and matching experience.
Feature implementation is intentionally not included in this scaffold.

## Stack

- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- Prisma ORM and PostgreSQL
- Framer Motion
- Lucide React
- Zod for environment validation
- ESLint and Prettier

## Project structure

```text
src/
  app/
    api/
      health/       Health endpoint
      discover/     Discover API placeholder
      matches/      Matches API placeholder
    discover/       Discover route
    matches/        Matches route
  components/
    layout/         Shared header and footer
    discover/       Discover UI
    matches/        Matches UI
    ui/             Reusable UI primitives
  lib/
    prisma.ts       Shared Prisma client
    matching.ts     Matching utility foundation
    env.ts          Environment validation
    utils.ts        Shared utilities
  types/            Shared application types
  data/             Seed-data definitions

prisma/
  schema.prisma     Database models
  seed.ts           Database seed entry point
```

## Setup

Requirements:

- Node.js 20 or newer
- npm
- PostgreSQL

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Update `DATABASE_URL` in `.env` for your PostgreSQL instance.

4. Generate the Prisma client:

```bash
npm run db:generate
```

5. Apply migrations:

```bash
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the development server             |
| `npm run build`        | Create a production build                |
| `npm run start`        | Start the production server              |
| `npm run lint`         | Run ESLint                               |
| `npm run typecheck`    | Run strict TypeScript checks             |
| `npm run format`       | Format the repository                    |
| `npm run format:check` | Check formatting                         |
| `npm run db:generate`  | Generate the Prisma client               |
| `npm run db:migrate`   | Create and apply a development migration |
| `npm run db:seed`      | Run the seed script                      |
| `npm run db:studio`    | Open Prisma Studio                       |

## API placeholders

- `GET /api/health` - service health
- `GET /api/discover` - returns `501` until discovery is implemented
- `GET /api/matches` - returns `501` until matching is implemented
