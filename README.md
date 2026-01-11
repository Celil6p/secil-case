# Collection Management Platform

<div align="center">

A modern collection management platform demonstrating proficiency in React/Next.js ecosystem, state management, authentication flows, and modern UI/UX practices.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## Important Notes

### 📌 Order Tracking with Filters & Pagination

| TR | EN |
|----|----|
| Bir ürün, mevcut sayfa aralığının dışındaki bir konuma taşındığında (örneğin 1-36 arası ürünken 1. ürünü 166. sıraya taşımak), farklı bir sayfaya kaymak yerine mevcut sayfanın sonunda görünür. Çapraz sayfalı görsel yeniden sıralama frontend karmaşıklığını artıracağı için bu yöntem seçildi. Sipariş değişikliği doğru şekilde takip edilir ve düzgün kaydedilir—sınırlama sadece görsel görünümdür. | When a product is moved to a position outside the current page range (e.g., moving item #1 to position #166 while viewing items 1-36), it remains visible at the last position of the current page rather than moving to a different page. Cross-page visual reordering was avoided to reduce frontend complexity. The order change is still tracked correctly and saved properly—the limitation is visual only. |

**How It Works:**
1. **Original Order Map** — Fetches complete unfiltered product list to preserve original positions
2. **Visual Reordering** — When filters reset, products reorder based on tracked changes
3. **Change Detection** — Amber badges show moved items with tooltip displaying original position

---

### 🐛 Backend Bugs & Discoveries

| TR | EN |
|----|----|
| Save endpoint için dummy endpoint yerine `/api/collections/{id}/save` kullanıldı. Bu endpoint aslında var gibi çalışıyor ve 200 döndürüyor. JSON payload modal'da gösteriliyor. **Fakat asıl veri güncellenmiyor.** | Used `/api/collections/{id}/save` for save action instead of dummy endpoint. This endpoint works and returns 200. JSON payload is displayed in modal. **However, the actual data is not updated.** |
| Token refresh endpoint'i (`/Auth/RefreshTokenLogin`) geçersiz JWT gönderildiğinde **500 hatası** döndürüyor. **401** döndürmesi gerekiyor. | Token refresh endpoint (`/Auth/RefreshTokenLogin`) returns **500 error** instead of **401** when invalid JWT is sent. |

---

## Tech Stack

**Next.js 16** (App Router) · **React 19** · **TypeScript** · **NextAuth.js v5** · **Zustand** · **@dnd-kit** · **Tailwind CSS** · **Docker**

---

## Features Implemented

| Feature | Details |
|---------|---------|
| 🔐 **Login Screen** | Floating label inputs, password toggle, toast notifications, auto-redirect |
| 📦 **Collection List** | Grid/List toggle, pagination, responsive cards with preview images |
| 🔄 **Product Reordering** | Drag-and-drop with @dnd-kit (keyboard + touch accessible) |
| 🔍 **Filter System** | Collapsible sidebar, active filter badges, real-time filtering |
| 👤 **Authentication** | NextAuth.js v5 with JWT, auto-refresh 60s before expiry |
| 📊 **State Management** | Zustand store for collections, products, and filters |
| 💾 **Save Action** | Displays JSON payload (per case requirements) |
| 🌙 **Dark Mode** | CSS variable-based theme system |
| 🐳 **Docker Support** | Multi-stage Dockerfile with docker-compose |

---

## Project Structure

```
app/
├── api/auth/[...nextauth]/    # NextAuth API routes
├── collections/
│   ├── page.tsx              # Collection listing (grid/list)
│   └── [id]/edit/page.tsx    # Product reordering with DnD
├── login/page.tsx            # Authentication
├── icon.tsx                  # Favicon with "S" icon
└── providers.tsx             # SessionProvider

components/
├── CollectionCard.tsx        # Grid view card
├── CollectionListItem.tsx    # List view row
├── FilterPanel.tsx           # Sidebar filters
├── SortableProduct.tsx       # Draggable product
├── Header.tsx                # Nav + theme toggle
├── SaveModal.tsx             # JSON preview modal
├── ConfirmDialog.tsx         # Modal confirmation
├── Toast.tsx                 # Notification system
└── Tooltip.tsx               # Portal-based tooltips

lib/
├── api.ts                    # API client
├── store.ts                  # Zustand store
├── types.ts                  # TypeScript interfaces
└── navigation.ts             # Navigation warning utilities

auth.ts                       # NextAuth config
middleware.ts                 # Route protection
Dockerfile                    # Production image
docker-compose.yml            # Container setup
```

---

## Getting Started

### Prerequisites
- Node.js 20+ or Bun
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

| Area | Details |
|------|---------|
| **Drag & Drop** | Uses `@dnd-kit` with 8px activation distance to prevent accidental drags. Supports keyboard navigation and touch devices. |
| **Token Refresh** | JWT auto-refreshes 5 minutes before expiry. Access tokens expire in 8 hours, refresh tokens in 10 hours. Session checks every 10 minutes. |
| **State Management** | Zustand store tracks original vs reordered products to detect unsaved changes. Warning shown on navigation with pending changes. |
| **Image Optimization** | Configured for `cdn.secilstore.com`, `cdn.ilmio.com`, and `cdn.secilikart.com`. |
