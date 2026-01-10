# Collection Management Platform

A modern, responsive collection management platform built for Seçil Store's frontend case study. This application demonstrates proficiency in React/Next.js ecosystem, state management, authentication flows, and modern UI/UX practices.

## Live Demo

Test credentials:
| Field | Value |
|-------|-------|
| Email | frontendtask@secilstore.com |
| Password | 123456 |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1.1 | React framework with App Router |
| [React](https://react.dev/) | 19.2.3 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [NextAuth.js](https://authjs.dev/) | v5 beta | Authentication |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.x | State management |
| [@dnd-kit](https://dndkit.com/) | 6.x | Drag and drop |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling |
| [Docker](https://www.docker.com/) | - | Containerization |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   /login    │  │ /collections│  │ /collections/[id]/edit  │  │
│  │             │  │             │  │                         │  │
│  │  Auth Form  │  │  Grid/List  │  │  Drag & Drop Products   │  │
│  │             │  │    View     │  │  Filter Panel           │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
├─────────┴────────────────┴──────────────────────┴────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     Zustand Store                          │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │  │
│  │  │ Collections  │ │   Products   │ │   Filters    │       │  │
│  │  │    State     │ │    State     │ │    State     │       │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   NextAuth.js (v5)                         │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │  │
│  │  │   JWT Auth   │ │Token Refresh │ │  Middleware  │       │  │
│  │  │   Provider   │ │  (60s early) │ │  Protection  │       │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   External API      │
                    │ maestro-api-dev     │
                    │   .secil.biz        │
                    └─────────────────────┘
```

## Project Structure

```
store-case/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth API routes
│   ├── collections/
│   │   ├── page.tsx                # Collection listing page
│   │   └── [id]/edit/
│   │       └── page.tsx            # Collection edit page with DnD
│   ├── login/
│   │   └── page.tsx                # Authentication page
│   ├── globals.css                 # Global styles + CSS variables
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Root redirect to /collections
│   └── providers.tsx               # SessionProvider wrapper
│
├── components/
│   ├── CollectionCard.tsx          # Grid view card component
│   ├── CollectionListItem.tsx      # List view row component
│   ├── ConfirmDialog.tsx           # Modal confirmation dialog
│   ├── FilterPanel.tsx             # Sidebar filter controls
│   ├── Header.tsx                  # Navigation + theme toggle
│   ├── SaveModal.tsx               # Save confirmation with JSON preview
│   ├── SortableProduct.tsx         # Draggable product card
│   └── Toast.tsx                   # Toast notification system
│
├── lib/
│   ├── api.ts                      # API client functions
│   ├── store.ts                    # Zustand store definition
│   └── types.ts                    # TypeScript interfaces
│
├── auth.ts                         # NextAuth configuration
├── middleware.ts                   # Route protection middleware
├── next.config.ts                  # Next.js configuration
├── Dockerfile                      # Docker image definition
└── docker-compose.yml              # Docker Compose setup
```

## Key Features

### Authentication System

The authentication flow uses NextAuth.js v5 with JWT strategy:

```typescript
// Token refresh happens 60 seconds before expiry
if (Date.now() < token.expiresAt - 60 * 1000) {
  return token; // Token still valid
}
// Attempt refresh...
```

**Flow:**
1. User submits credentials → API returns JWT + refresh token
2. Tokens stored in encrypted HTTP-only cookie
3. Middleware checks auth on protected routes
4. Token auto-refreshes 60s before expiry
5. On refresh failure, user is redirected to login

### State Management

Zustand provides lightweight, performant state management:

```typescript
interface CollectionStore {
  // Collections
  collections: Collection[];
  collectionsMeta: CollectionListMeta | null;
  collectionsLoading: boolean;

  // Products (original + reordered for tracking changes)
  products: Product[];
  reorderedProducts: Product[];

  // Filters
  filters: Filter[];
  activeFilters: AdditionalFilter[];

  // Actions
  setReorderedProducts: (products: Product[]) => void;
  addActiveFilter: (filter: AdditionalFilter) => void;
  // ...
}
```

### Drag and Drop

Product reordering uses @dnd-kit with:
- Keyboard accessibility support
- Touch device support
- Visual feedback during drag
- Collision detection algorithm
- 8px activation distance to prevent accidental drags

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### Theme System

CSS variables enable seamless dark/light mode:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-primary: #000000;
}

.dark {
  --bg-primary: #111111;
  --text-primary: #f5f5f5;
  --accent-primary: #ffffff;
}
```

Single-click toggle in header switches themes instantly.

## API Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/Auth/Login` | POST | User authentication |
| `/Auth/RefreshTokenLogin` | POST | Token refresh |
| `/Collection/GetAll` | GET | List collections (paginated) |
| `/Collection/{id}/GetProductsForConstants` | POST | Get products with filters |
| `/Collection/{id}/GetFiltersForConstants` | GET | Get available filters |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Docker (optional)

### Local Development

```bash
# Install dependencies
npm install
# or
bun install

# Create .env.local
echo "AUTH_SECRET=$(openssl rand -base64 32)" > .env.local

# Start development server
npm run dev
# or
bun dev
```

Application runs at [http://localhost:3000](http://localhost:3000)

### Docker Deployment

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Page Details

### Login Page (`/login`)
- Floating label inputs
- Password visibility toggle
- Form validation
- Toast notifications on success/error
- Automatic redirect after login

### Collections Page (`/collections`)
- Toggle between grid and list views
- Pagination with meta information
- Preview images on collection cards
- Edit button navigation

### Collection Edit Page (`/collections/[id]/edit`)
- Drag-and-drop product reordering
- Collapsible filter panel (sidebar on desktop, drawer on mobile)
- Active filter badges with remove option
- Unsaved changes warning on navigation
- Save modal with JSON payload preview
- Breadcrumb navigation

## Component Highlights

### Toast System
```typescript
import { toast } from "@/components/Toast";

toast.success("Success", "Operation completed");
toast.error("Error", "Something went wrong");
toast.warning("Warning", "Please review");
toast.info("Info", "FYI message");
```

### Confirm Dialog
```typescript
<ConfirmDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleConfirm}
  title="Are you sure?"
  message="This action cannot be undone."
  variant="danger" // danger | warning | success
/>
```

## Performance Considerations

- **Next.js Image Optimization**: Automatic image optimization with remote patterns
- **Standalone Docker Build**: Minimal image size for production
- **Zustand Selectors**: Efficient re-renders with selective subscriptions
- **Memoized Callbacks**: useCallback for event handlers
- **Responsive Loading**: Skeleton states during data fetch

## Notes

- **Save Action**: Per case requirements, the save button displays the JSON payload but doesn't make an actual API call
- **Images**: Configured for `cdn.secilstore.com`, `cdn.ilmio.com`, and `cdn.secilikart.com` domains

---

# Koleksiyon Yönetim Platformu

Seçil Store frontend case study için geliştirilen modern ve kullanıcı dostu koleksiyon yönetim platformu. Bu uygulama; React/Next.js ekosistemi, state yönetimi, kimlik doğrulama akışları ve modern UI/UX pratiklerinde yetkinlik göstermektedir.

## Demo Bilgileri

Test kullanıcısı:
| Alan | Değer |
|------|-------|
| Email | frontendtask@secilstore.com |
| Şifre | 123456 |

## Teknoloji Yığını

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| [Next.js](https://nextjs.org/) | 16.1.1 | App Router ile React framework |
| [React](https://react.dev/) | 19.2.3 | UI kütüphanesi |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tip güvenliği |
| [NextAuth.js](https://authjs.dev/) | v5 beta | Kimlik doğrulama |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.x | State yönetimi |
| [@dnd-kit](https://dndkit.com/) | 6.x | Sürükle-bırak |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Stillendirme |
| [Docker](https://www.docker.com/) | - | Konteynerizasyon |

## Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   /login    │  │ /collections│  │ /collections/[id]/edit  │  │
│  │             │  │             │  │                         │  │
│  │  Auth Formu │  │  Grid/List  │  │  Sürükle-Bırak Ürünler │  │
│  │             │  │   Görünüm   │  │  Filtre Paneli          │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
├─────────┴────────────────┴──────────────────────┴────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     Zustand Store                          │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │  │
│  │  │ Koleksiyonlar│ │    Ürünler   │ │   Filtreler  │       │  │
│  │  │    State     │ │    State     │ │    State     │       │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   NextAuth.js (v5)                         │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │  │
│  │  │   JWT Auth   │ │Token Yenileme│ │  Middleware  │       │  │
│  │  │   Provider   │ │  (60sn önce) │ │   Koruma     │       │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Harici API       │
                    │ maestro-api-dev     │
                    │   .secil.biz        │
                    └─────────────────────┘
```

## Proje Yapısı

```
store-case/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth API route'ları
│   ├── collections/
│   │   ├── page.tsx                # Koleksiyon listeleme sayfası
│   │   └── [id]/edit/
│   │       └── page.tsx            # Sürükle-bırak düzenleme sayfası
│   ├── login/
│   │   └── page.tsx                # Giriş sayfası
│   ├── globals.css                 # Global stiller + CSS değişkenleri
│   ├── layout.tsx                  # Provider'lı root layout
│   ├── page.tsx                    # /collections'a yönlendirme
│   └── providers.tsx               # SessionProvider wrapper
│
├── components/
│   ├── CollectionCard.tsx          # Grid görünümü kart bileşeni
│   ├── CollectionListItem.tsx      # Liste görünümü satır bileşeni
│   ├── ConfirmDialog.tsx           # Modal onay dialogu
│   ├── FilterPanel.tsx             # Yan panel filtre kontrolleri
│   ├── Header.tsx                  # Navigasyon + tema değiştirici
│   ├── SaveModal.tsx               # JSON önizlemeli kaydet modalı
│   ├── SortableProduct.tsx         # Sürüklenebilir ürün kartı
│   └── Toast.tsx                   # Toast bildirim sistemi
│
├── lib/
│   ├── api.ts                      # API istemci fonksiyonları
│   ├── store.ts                    # Zustand store tanımı
│   └── types.ts                    # TypeScript arayüzleri
│
├── auth.ts                         # NextAuth konfigürasyonu
├── middleware.ts                   # Route koruma middleware'i
├── next.config.ts                  # Next.js konfigürasyonu
├── Dockerfile                      # Docker imaj tanımı
└── docker-compose.yml              # Docker Compose kurulumu
```

## Temel Özellikler

### Kimlik Doğrulama Sistemi

Kimlik doğrulama akışı JWT stratejisiyle NextAuth.js v5 kullanır:

```typescript
// Token yenileme süre dolmadan 60 saniye önce gerçekleşir
if (Date.now() < token.expiresAt - 60 * 1000) {
  return token; // Token hala geçerli
}
// Yenileme dene...
```

**Akış:**
1. Kullanıcı bilgileri gönderir → API JWT + refresh token döner
2. Token'lar şifreli HTTP-only cookie'de saklanır
3. Middleware korumalı route'ları kontrol eder
4. Token süre dolmadan 60sn önce otomatik yenilenir
5. Yenileme başarısız olursa kullanıcı login'e yönlendirilir

### State Yönetimi

Zustand hafif ve performanslı state yönetimi sağlar:

```typescript
interface CollectionStore {
  // Koleksiyonlar
  collections: Collection[];
  collectionsMeta: CollectionListMeta | null;
  collectionsLoading: boolean;

  // Ürünler (değişiklikleri takip için orijinal + yeniden sıralanmış)
  products: Product[];
  reorderedProducts: Product[];

  // Filtreler
  filters: Filter[];
  activeFilters: AdditionalFilter[];

  // Aksiyonlar
  setReorderedProducts: (products: Product[]) => void;
  addActiveFilter: (filter: AdditionalFilter) => void;
  // ...
}
```

### Sürükle ve Bırak

Ürün sıralaması @dnd-kit ile şunları içerir:
- Klavye erişilebilirlik desteği
- Dokunmatik cihaz desteği
- Sürükleme sırasında görsel geri bildirim
- Çarpışma algılama algoritması
- Yanlışlıkla sürüklemeleri önlemek için 8px aktivasyon mesafesi

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### Tema Sistemi

CSS değişkenleri kesintisiz dark/light mod geçişi sağlar:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-primary: #000000;
}

.dark {
  --bg-primary: #111111;
  --text-primary: #f5f5f5;
  --accent-primary: #ffffff;
}
```

Header'daki tek tıkla değiştirici anında tema değiştirir.

## API Entegrasyonu

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/Auth/Login` | POST | Kullanıcı girişi |
| `/Auth/RefreshTokenLogin` | POST | Token yenileme |
| `/Collection/GetAll` | GET | Koleksiyonları listele (sayfalı) |
| `/Collection/{id}/GetProductsForConstants` | POST | Filtreli ürünleri getir |
| `/Collection/{id}/GetFiltersForConstants` | GET | Mevcut filtreleri getir |

## Başlangıç

### Gereksinimler

- Node.js 18+ veya Bun
- Docker (opsiyonel)

### Yerel Geliştirme

```bash
# Bağımlılıkları yükle
npm install
# veya
bun install

# .env.local oluştur
echo "AUTH_SECRET=$(openssl rand -base64 32)" > .env.local

# Geliştirme sunucusunu başlat
npm run dev
# veya
bun dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışır

### Docker ile Çalıştırma

```bash
# Derle ve çalıştır
docker-compose up --build

# Arka planda çalıştır
docker-compose up -d --build

# Logları görüntüle
docker-compose logs -f

# Durdur
docker-compose down
```

## Sayfa Detayları

### Giriş Sayfası (`/login`)
- Floating label input'lar
- Şifre görünürlük değiştirici
- Form doğrulama
- Başarı/hata durumunda toast bildirimleri
- Giriş sonrası otomatik yönlendirme

### Koleksiyonlar Sayfası (`/collections`)
- Grid ve liste görünümü arasında geçiş
- Meta bilgili sayfalama
- Koleksiyon kartlarında önizleme görselleri
- Düzenle butonu navigasyonu

### Koleksiyon Düzenleme Sayfası (`/collections/[id]/edit`)
- Sürükle-bırak ürün sıralaması
- Katlanabilir filtre paneli (masaüstünde yan panel, mobilde drawer)
- Kaldırma seçenekli aktif filtre badge'leri
- Navigasyonda kaydedilmemiş değişiklik uyarısı
- JSON payload önizlemeli kaydet modalı
- Breadcrumb navigasyonu

## Bileşen Öne Çıkanları

### Toast Sistemi
```typescript
import { toast } from "@/components/Toast";

toast.success("Başarılı", "İşlem tamamlandı");
toast.error("Hata", "Bir şeyler yanlış gitti");
toast.warning("Uyarı", "Lütfen gözden geçirin");
toast.info("Bilgi", "Bilgilendirme mesajı");
```

### Onay Dialogu
```typescript
<ConfirmDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  onConfirm={handleConfirm}
  title="Emin misiniz?"
  message="Bu işlem geri alınamaz."
  variant="danger" // danger | warning | success
/>
```

## Performans Değerlendirmeleri

- **Next.js Image Optimizasyonu**: Remote pattern'lerle otomatik görsel optimizasyonu
- **Standalone Docker Build**: Prodüksiyon için minimal imaj boyutu
- **Zustand Selector'ları**: Seçici aboneliklerle verimli yeniden render'lar
- **Memoize Edilmiş Callback'ler**: Event handler'lar için useCallback
- **Responsive Yükleme**: Veri çekme sırasında skeleton state'ler

## Notlar

- **Kaydet İşlemi**: Case gereksinimleri gereği kaydet butonu JSON payload'ı gösterir ama gerçek API çağrısı yapmaz
- **Görseller**: `cdn.secilstore.com`, `cdn.ilmio.com` ve `cdn.secilikart.com` domainleri için yapılandırılmıştır

---

MIT License
