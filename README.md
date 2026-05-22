# Undangan Digital - Adit & Risa

Website undangan pernikahan digital yang siap di-deploy ke Netlify.

## Fitur

- ✅ Halaman depan dengan nama pasangan
- ✅ Countdown timer ke tanggal pernikahan
- ✅ Informasi acara (Akad & Resepsi)
- ✅ Galeri foto
- ✅ Form RSVP
- ✅ Pesan untuk tamu
- ✅ Halaman hadiah/rekening
- ✅ Desain responsif (mobile-friendly)
- ✅ Navigasi mudah

## Teknologi

- HTML5
- CSS3 (tanpa framework)
- JavaScript (vanilla)
- Google Fonts (Cormorant Garamond & Montserrat)

## Cara Edit

### 1. Edit Nama & Tanggal
Buka `index.html` dan cari:
- Nama pengantin: "Adit & Risa"
- Tanggal: "30 Mei 2026"

### 2. Edit Detail Acara
Di `index.html` bagian Event Section:
- Lokasi Masjid
- Alamat
- Waktu acara

### 3. Edit Foto
Ganti emoji placeholder di galeri dengan foto asli Anda.

### 4. Edit Rekening
Di `index.html` bagian Gift Section:
- Nama bank
- Nomor rekening
- Nama pemilik

### 5. Konfigurasi Countdown
Di `script.js`, ubah tanggal pernikahan:
```javascript
const weddingDate = new Date('2026-05-30T08:00:00').getTime();
```

## Deploy ke Netlify

### Cara 1: Drag & Drop
1. Buka https://netlify.com
2. Login/Sign up
3. Drag folder `adit-risa` ke area deploy
4. Selesai! URL akan diberikan

### Cara 2: GitHub
1. Push semua file ke GitHub
2. Login ke Netlify
3. Klik "Add new site" → "Import an existing project"
4. Pilih repository GitHub
5. Deploy otomatis

### Cara 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Struktur File

```
adit-risa/
├── index.html    # Halaman utama
├── style.css     # Styling
├── script.js     # Fungsi JavaScript
└── README.md     # Dokumentasi
```

## Catatan

- RSVP saat ini disimpan di localStorage (hanya untuk demo)
- Untuk production, gunakan backend service seperti Formspree atau Google Sheets
- Replace semua placeholder dengan konten asli

---

Made with ❤️ for Adit & Risa