# Collection Management Platform

A modern collection management platform demonstrating proficiency in React/Next.js ecosystem, state management, authentication flows, and modern UI/UX practices.

## Tech Stack

**Next.js 16** (App Router) · **React 19** · **TypeScript** · **NextAuth.js v5** · **Zustand** · **@dnd-kit** · **Tailwind CSS** · **Docker**

---

## Features Implemented

| Requirement | Implementation |
|-------------|----------------|
| **Login Screen** | Floating label inputs, password toggle, toast notifications, auto-redirect |
| **Collection List** | Grid/List toggle, pagination, responsive cards with preview images |
| **Product Reordering** | Drag-and-drop with @dnd-kit (keyboard + touch accessible) |
| **Filter System** | Collapsible sidebar, active filter badges, real-time filtering |
| **Authentication** | NextAuth.js v5 with JWT, auto-refresh 60s before expiry |
| **State Management** | Zustand store for collections, products, and filters |
| **Save Action** | Displays JSON payload (per case requirements) |
| **Dark Mode** | CSS variable-based theme system |
| **Docker Support** | Multi-stage Dockerfile with docker-compose |

---

## Project Structure

```
app/
├── api/auth/[...nextauth]/    # NextAuth API routes
├── collections/
│   ├── page.tsx              # Collection listing (grid/list)
│   └── [id]/edit/page.tsx    # Product reordering with DnD
├── login/page.tsx            # Authentication
└── providers.tsx             # SessionProvider

components/
├── CollectionCard.tsx        # Grid view card
├── CollectionListItem.tsx    # List view row
├── FilterPanel.tsx           # Sidebar filters
├── SortableProduct.tsx       # Draggable product
├── Header.tsx                # Nav + theme toggle
├── SaveModal.tsx             # JSON preview modal
├── ConfirmDialog.tsx         # Modal confirmation
└── Toast.tsx                 # Notification system

lib/
├── api.ts                    # API client
├── store.ts                  # Zustand store
└── types.ts                  # TypeScript interfaces

auth.ts                       # NextAuth config
middleware.ts                 # Route protection
Dockerfile                    # Production image
docker-compose.yml            # Container setup
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Docker (optional)

### Local Development

```bash
# Install dependencies
bun install

# Create .env.local with AUTH_SECRET
echo "AUTH_SECRET=$(openssl rand -base64 32)" > .env.local

# Start dev server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Docker

```bash
docker-compose up --build
```

---

## Key Implementation Details

**Drag & Drop**: Uses `@dnd-kit` with 8px activation distance to prevent accidental drags. Supports keyboard navigation and touch devices.

**Token Refresh**: JWT auto-refreshes 60 seconds before expiry. On failure, user is redirected to login.

**State Management**: Zustand store tracks original vs reordered products to detect unsaved changes. Warning shown on navigation with pending changes.

**Image Optimization**: Configured for `cdn.secilstore.com`, `cdn.ilmio.com`, and `cdn.secilikart.com`.
