## ⚠️ FITUR YANG BELUM BERFUNGSI ATAU PERLU PERBAIKAN

### 2. **Settings - System Information**
**Status**: ⚠️ Data Statis/Hardcoded
**Masalah**:
- System information (Version, Environment, Last Backup, Uptime, Memory Usage) adalah data statis
- Button "Refresh" dan "Backup Now" tidak berfungsi

**Solusi yang Diperlukan**:
- Implementasi API untuk mendapatkan system info real-time
- Implementasi backup functionality
- Connect button actions ke API

**File yang Perlu Dimodifikasi**:
- `src/app/dashboard/settings/page.tsx` (line 354-362)
- Buat API route baru: `src/app/api/system/route.ts`

---

### 3. **Reports - Data Real dari Database**
**Status**: ⚠️ Menggunakan Mock Data
**Masalah**:
- Semua data reports adalah mock/dummy data (line 41-57)
- Tidak mengambil data real dari database
- Date range filter tidak berfungsi

**Solusi yang Diperlukan**:
- Buat API endpoint untuk reports
- Query database berdasarkan date range
- Replace mock data dengan real data

**File yang Perlu Dimodifikasi**:
- `src/app/dashboard/reports/page.tsx`
- Buat API route baru: `src/app/api/reports/route.ts`

---

### 5. **Wishlist Functionality**
**Status**: ⚠️ Frontend Only (LocalStorage)
**Masalah**:
- Wishlist hanya disimpan di localStorage
- Tidak ada persistence ke database
- Tidak ada API endpoint untuk wishlist

**Solusi yang Diperlukan**:
- Buat tabel `wishlist` di database
- Implementasi API untuk wishlist CRUD
- Sync localStorage dengan database

**File yang Perlu Dibuat**:
- Database migration untuk tabel `wishlist`
- `src/app/api/wishlist/route.ts`
- Update `src/lib/wishlist-context.tsx`

---

### 6. **Product Categories**
**Status**: ❌ Tidak Ada
**Masalah**:
- Tidak ada kategori produk
- Tidak ada filter by category di catalog
- Database tidak punya tabel categories

**Solusi yang Diperlukan**:
- Buat tabel `categories` di database
- Add `category_id` ke tabel `products`
- Implementasi category management (Admin)
- Add category filter di catalog (User)

**File yang Perlu Dibuat**:
- Database migration untuk tabel `categories`
- `src/app/dashboard/categories/page.tsx`
- `src/app/api/categories/route.ts`

---

### 7. **Product Reviews & Ratings**
**Status**: ❌ Tidak Ada
**Masalah**:
- Field `rating` dan `reviews` ada di interface tapi tidak ada di database
- Tidak ada sistem review/rating produk
- Tidak ada tabel `reviews` di database

**Solusi yang Diperlukan**:
- Buat tabel `product_reviews` di database
- Implementasi review form
- Calculate average rating
- Display reviews di product detail

**File yang Perlu Dibuat**:
- Database migration untuk tabel `product_reviews`
- `src/app/api/reviews/route.ts`
- Product detail page dengan reviews

---

### 8. **Notifications System**
**Status**: ❌ Tidak Ada
**Masalah**:
- Tidak ada sistem notifikasi
- Tidak ada bell icon di navbar
- Tidak ada tabel `notifications` di database

**Solusi yang Diperlukan**:
- Buat tabel `notifications` di database
- Implementasi notification API
- Add notification bell di navbar
- Real-time notifications (optional: WebSocket)

**File yang Perlu Dibuat**:
- Database migration untuk tabel `notifications`
- `src/app/api/notifications/route.ts`
- Notification component

---

### 10. **Search Functionality - Advanced**
**Status**: ⚠️ Basic Only
**Masalah**:
- Search hanya di nama dan deskripsi produk
- Tidak ada autocomplete
- Tidak ada search history
- Tidak ada search suggestions

**Solusi yang Diperlukan**:
- Implementasi full-text search
- Add autocomplete component
- Store search history
- Search suggestions based on popular searches

---

### 11. **Dashboard Analytics (User)**
**Status**: ⚠️ Data Statis
**Masalah**:
- Dashboard user menampilkan data statis (line 343-350 di `dashboard/page.tsx`)
- "Last Backup: Never", "Uptime: 2 days, 5 hours", "Memory Usage: 45%" adalah hardcoded

**Solusi yang Diperlukan**:
- Fetch real user statistics dari database
- Calculate real metrics (total orders, total spent, wishlist items, payment methods)

**File yang Perlu Dimodifikasi**:
- `src/app/dashboard/page.tsx`
- Buat API: `src/app/api/dashboard/stats/route.ts`

---

### 11. **Dashboard Analytics (admin)**
**Status**: ⚠️ Data Statis
**Masalah**:
- Dashboard user menampilkan data statis (line 343-350 di `dashboard/page.tsx`)
- "Last Backup: Never", "Uptime: 2 days, 5 hours", "Memory Usage: 45%" adalah hardcoded

**Solusi yang Diperlukan**:
- Fetch real user statistics dari database
- Calculate real metrics (total orders, total spent, wishlist items, payment methods)

**File yang Perlu Dimodifikasi**:
- `src/app/dashboard/page.tsx`
- Buat API: `src/app/api/dashboard/stats/route.ts`

---

### 12. **Pagination**
**Status**: ⚠️ Tidak Konsisten
**Masalah**:
- API products support pagination tapi frontend tidak menggunakannya
- Catalog page fetch semua produk sekaligus (tidak scalable)
- Orders, Users, Media tidak ada pagination

**Solusi yang Diperlukan**:
- Implementasi pagination component
- Add pagination ke semua list pages
- Infinite scroll (optional)

**File yang Perlu Dimodifikasi**:
- `src/app/catalog/page.tsx`
- `src/app/dashboard/products/page.tsx`
- `src/app/dashboard/orders/page.tsx`
- `src/app/dashboard/users/page.tsx`

---

### 13. **Image Upload untuk Products**
**Status**: ❌ URL Only
**Masalah**:
- Product image hanya support URL
- Tidak ada actual image upload
- Tidak ada image preview sebelum upload

**Solusi yang Diperlukan**:
- Implementasi image upload
- Image preview
- Image optimization/compression
- Multiple images per product (optional)

---

### 14. **Password Reset/Forgot Password**
**Status**: ❌ Tidak Ada
**Masalah**:
- Tidak ada halaman forgot password
- Tidak ada reset password functionality
- Tidak ada email untuk reset password

**Solusi yang Diperlukan**:
- Create forgot password page
- Generate reset token
- Send reset email
- Reset password page

**File yang Perlu Dibuat**:
- `src/app/forgot-password/page.tsx`
- `src/app/reset-password/page.tsx`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`

---

### 15. **Activity Logs Viewer**
**Status**: ❌ Tidak Ada UI
**Masalah**:
- Tabel `activity_logs` ada di database
- Tidak ada halaman untuk view activity logs
- Tidak ada logging di aplikasi

**Solusi yang Diperlukan**:
- Create activity logs page (Admin only)
- Implementasi logging di semua actions
- Filter by user, action, date

**File yang Perlu Dibuat**:
- `src/app/dashboard/activity-logs/page.tsx`
- `src/app/api/activity-logs/route.ts`
- `src/lib/logger.ts`

---

### 16. **Export/Import Data**
**Status**: ❌ Tidak Ada
**Masalah**:
- Tidak ada export products to CSV/Excel
- Tidak ada import products from CSV
- Tidak ada bulk operations

**Solusi yang Diperlukan**:
- Export functionality untuk products, orders, users
- Import functionality dengan validation
- Bulk edit/delete

---

### 17. **Multi-language Support (i18n)**
**Status**: ❌ Tidak Ada
**Masalah**:
- Aplikasi hanya bahasa Indonesia/Inggris mixed
- Tidak ada language switcher
- Tidak ada translation files

**Solusi yang Diperlukan**:
- Setup i18n library (next-i18next)
- Create translation files
- Language switcher component

---

### 20. **Error Handling & Loading States**
**Status**: ⚠️ Tidak Konsisten
**Masalah**:
- Beberapa pages tidak ada error handling
- Loading states tidak konsisten
- Tidak ada error boundary

**Solusi yang Diperlukan**:
- Add error boundaries
- Consistent loading states
- Better error messages
- Retry mechanisms

---