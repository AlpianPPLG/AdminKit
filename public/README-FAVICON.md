# Cara Upload Favicon dan Logo

> **✅ UPDATE: Sekarang support SEMUA URL external!**  
> Logo dan Favicon sekarang menggunakan native `<img>` tag yang support semua URL tanpa batasan.

## Untuk Favicon:

1. **Buat atau download favicon:**
   - Gunakan tool online: https://favicon.io/
   - Atau convert gambar ke .ico: https://www.icoconverter.com/
   - Atau gunakan emoji sebagai favicon: https://favicon.io/emoji-favicons/

2. **Upload ke folder public:**
   - Letakkan file favicon.ico di folder `d:\Development\adminkit-dashboard\public\`
   - Atau dengan nama custom, misal: `my-favicon.ico`

3. **Set di Settings:**
   - Buka Settings → Appearance
   - Favicon URL: `/favicon.ico` atau `/my-favicon.ico`
   - Save

## Untuk Logo:

1. **Siapkan logo (PNG/SVG recommended):**
   - Format: PNG, SVG, JPG, WebP
   - Size recommended: 150x150px atau 200x200px
   - Background: Transparent (untuk PNG/SVG)

2. **Upload ke folder public:**
   - Letakkan di `d:\Development\adminkit-dashboard\public\`
   - Misal: `logo.png`, `logo.svg`

3. **Set di Settings:**
   - Buka Settings → Appearance
   - Logo URL: `/logo.png` atau `/logo.svg`
   - Save

## URL External (Alternative):

Jika ingin menggunakan URL external:
- Pastikan URL bisa diakses (test di browser)
- Gunakan HTTPS
- Pastikan tidak ada CORS restriction

### Favicon URL yang Reliable:

**Dari Website Terkenal:**
- GitHub: `https://github.com/favicon.ico`
- Google: `https://www.google.com/favicon.ico`
- YouTube: `https://www.youtube.com/favicon.ico`
- StackOverflow: `https://stackoverflow.com/favicon.ico`

**Dari CDN (RECOMMENDED):**
- Store Icon: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/store.svg`
- Shop Icon: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/shop.svg`
- Cart Icon: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/cart-shopping.svg`
- Building: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/building.svg`

### Logo URL yang Reliable:

**Dari Unpkg CDN (RECOMMENDED):**
- Shopping Bag: `https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg`
- Store: `https://unpkg.com/lucide-static@latest/icons/store.svg`
- Shopping Cart: `https://unpkg.com/lucide-static@latest/icons/shopping-cart.svg`
- Package: `https://unpkg.com/lucide-static@latest/icons/package.svg`
- Building: `https://unpkg.com/lucide-static@latest/icons/building.svg`

**Dari Simpleicons CDN:**
- Shopify: `https://cdn.simpleicons.org/shopify/7AB55C`
- WooCommerce: `https://cdn.simpleicons.org/woocommerce/96588A`
- Stripe: `https://cdn.simpleicons.org/stripe/008CDD`

## Troubleshooting:

**Favicon tidak berubah?**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Clear browser cache
3. Close semua tab dan buka lagi
4. Test di Incognito mode

**Error ERR_NAME_NOT_RESOLVED?**
- URL external tidak bisa diakses
- Gunakan URL lokal (`/favicon.ico`) sebagai gantinya

**Logo tidak muncul?**
- Pastikan file ada di folder public
- Cek path spelling
- Pastikan format file supported (PNG, SVG, JPG, WebP)
