# Coy Discover

<div align="center">

**A bold, playful profile discovery and matching experience built with Next.js.**

Discover people, express interest, and find mutual matches in a polished swipe-first interface.

[Features](#-features) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API](#-api-endpoints)

![Next.js](https://img.shields.io/badge/Next.js-16-17131e?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=17131e)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

---

## Overview

**Coy Discover** is a full-stack, swipe-based discovery application with a distinctive neo-brutalist visual style. It demonstrates profile feed loading, like/pass interactions, keyboard controls, animated match feedback, mutual-match detection, and a responsive matches dashboard.

The project uses a demo user identity and stores all swipes and profile relationships through Prisma and PostgreSQL.

## ✨ Features

- **Interactive discovery feed** - Browse profiles loaded directly from the database.
- **Like and pass actions** - Use the on-screen controls or the left/right arrow keys.
- **Animated swipe feedback** - Enjoy polished card transitions and clear action states.
- **Mutual match detection** - Automatically recognize when a profile and the demo user both like each other.
- **Match celebration** - View an animated match modal with both profile images.
- **Connections dashboard** - Review every mutual match in a responsive card grid.
- **Manual refresh** - Reload matches and keep the view synchronized after interactions.
- **Loading and error states** - Purpose-built UI for loading, empty feeds, database errors, and retry actions.
- **Responsive layout** - Optimized for desktop and mobile screens.
- **Strict validation** - Typed API requests, Zod validation, and centralized API error responses.

## 📸 Screenshots

### Discover Profiles

The feed presents a focused profile card with personal details, interests, and clear like/pass controls.

![Discover page](public/screenshots/01-discover.png)

### Like Interaction

Liking rotates the profile card and adds immediate visual feedback before the next profile appears.

![Like action](public/screenshots/02-like-action.png)

### Mutual Match

When interest is mutual, Coy celebrates the match with profile avatars and clear next actions.

![Mutual match celebration](public/screenshots/03-mutual-match.png)

### Pass Interaction

Passing quickly removes the profile while preserving a smooth, state-aware discovery experience.

![Pass action](public/screenshots/04-pass-action.png)

### Matches Dashboard

Mutual matches are displayed in a responsive grid with profile information and interest tags.

![Matches page](public/screenshots/05-matches.png)

## 🛠 Tech Stack

| Area       | Technology               | Purpose                                     |
| ---------- | ------------------------ | ------------------------------------------- |
| Framework  | Next.js 16 App Router    | Routing, server components, and API routes  |
| UI         | React 19                 | Interactive component architecture          |
| Language   | TypeScript 5             | End-to-end type safety                      |
| Styling    | Tailwind CSS 4           | Responsive, utility-based interface styling |
| Animation  | Framer Motion            | Card, modal, and transition effects         |
| Icons      | Lucide React             | Consistent interface iconography            |
| Database   | PostgreSQL               | Persistent application data                 |
| ORM        | Prisma 7                 | Typed schema, migrations, and queries       |
| Validation | Zod                      | Environment and request validation          |
| Testing    | Vitest + Testing Library | Component and service behavior tests        |

## 🧩 Application Flow

1. **Discovery**
   - The app fetches unswiped profiles through `GET /api/feed`.
   - A profile can be liked or passed.

2. **Swipe**
   - `POST /api/swipe` records the action for the demo user.
   - Duplicate swipes and unknown profiles are safely rejected.

3. **Match**
   - A match is created when the profile already has a reciprocal like.
   - The UI opens a celebration modal and refreshes matches.

4. **Connections**
   - `GET /api/matches` returns profiles that were liked by both sides.
   - The Matches page renders the final mutual-match collection.

## 🗂 Project Structure

```text
coy-discover/
├── prisma/
│   ├── schema.prisma          # User, Profile, Swipe, and ProfileLike models
│   └── seed.ts                # Seed entry point
├── public/
│   └── screenshots/           # README and project preview images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/          # Paginated discovery feed
│   │   │   ├── swipe/         # Like/pass operations
│   │   │   ├── matches/       # Mutual match feed
│   │   │   └── health/        # Application health check
│   │   ├── discover/          # Discovery experience route
│   │   └── matches/           # Matches dashboard route
│   ├── components/
│   │   ├── discover/          # Profile cards and swipe controls
│   │   ├── matches/           # Match cards and modal
│   │   └── layout/            # Shared navigation
│   ├── lib/
│   │   ├── discovery.ts       # Feed, swipe, and match logic
│   │   └── prisma.ts          # Shared Prisma client
│   ├── services/              # Client API access
│   └── types/                 # Shared application types
└── tests/                     # Automated test coverage
```

## 🚀 Getting Started

### Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy the example environment file:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Prepare the database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start the application

```bash
npm run dev
```

Open [http://localhost:3000/discover](http://localhost:3000/discover) in your browser.

## 🔌 API Endpoints

| Method | Endpoint                    | Description                                          |
| ------ | --------------------------- | ---------------------------------------------------- |
| `GET`  | `/api/health`               | Health status                                        |
| `GET`  | `/api/feed?page=1&limit=50` | Paginated profiles that the demo user has not swiped |
| `POST` | `/api/swipe`                | Record a like or pass for a profile                  |
| `GET`  | `/api/matches`              | Get mutual matches for the demo user                 |

### Swipe request

```json
{
  "profileId": "profile-id",
  "action": "LIKE"
}
```

Supported actions: `LIKE` or `PASS`.

## 🧪 Available Scripts

| Command                | Purpose                      |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the development server |
| `npm run build`        | Create a production build    |
| `npm run start`        | Start the production server  |
| `npm run lint`         | Run ESLint                   |
| `npm run typecheck`    | Run strict TypeScript checks |
| `npm run test`         | Run the Vitest suite         |
| `npm run format`       | Format the repository        |
| `npm run format:check` | Check formatting             |
| `npm run db:generate`  | Generate the Prisma client   |
| `npm run db:migrate`   | Create and apply migrations  |
| `npm run db:seed`      | Insert seed data             |
| `npm run db:studio`    | Open Prisma Studio           |

## Quality Checks

Run the main verification commands before submitting or deploying:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Keyboard Shortcuts

| Key | Action                  |
| --- | ----------------------- |
| `←` | Pass the active profile |
| `→` | Like the active profile |

## Data Model

The Prisma schema includes:

- **User** - Application user identity
- **Profile** - Discoverable person data, image, bio, location, and interests
- **Swipe** - User relationship with a profile and a `LIKE` or `PASS` action
- **ProfileLike** - Indicates whether a profile reciprocally likes the demo user

---

<div align="center">

Built as a modern full-stack assignment demonstrating polished UI, server-side data handling, and complete swipe-to-match behavior.

</div>
