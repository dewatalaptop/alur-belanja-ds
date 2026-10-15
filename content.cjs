// Isi halaman "Alur Belanja DS". Format teks: **tebal**. Gambar: berkas di img/ (potongan layar aplikasi sungguhan, data uji).
// role: outlet | belanja | keringan | admin | supplier | sistem
const ROLES = {
  outlet: { name: "Staf Outlet", short: "Outlet", d: "Memesan barang dan mencatat barang yang datang." },
  belanja: { name: "Tukang Belanja", short: "Tukang Belanja", d: "Berbelanja di pasar dan meneruskan daftar ke supplier lewat WhatsApp." },
  keringan: { name: "Admin Gudang Keringan", short: "Gudang Keringan", d: "Menyiapkan barang keringan dari gudang dan menjaga stok." },
  admin: { name: "Admin", short: "Admin", d: "Mengawasi seluruh alur, menyetujui susulan, mengatur jadwal dan katalog." },
  supplier: { name: "Supplier (di luar aplikasi)", short: "Supplier", d: "Menerima daftar lewat grup WhatsApp dan mengantar barang." },
  sistem: { name: "Sistem (otomatis)", short: "Otomatis", d: "Dikerjakan aplikasi sendiri, tanpa perlu ditekan siapa pun." },
};

const PHASES = [
  // ------------------------------------------------------------------ 0
  {
    id: "persiapan", num: 0, icon: "⚙️", title: "Persiapan (dilakukan sekali, diubah bila perlu)",
    short: "Persiapan", when: "Sebelum dipakai, lalu sesekali",
    who: ["admin"],
    goal: "Menyiapkan 'aturan main': barang apa yang bisa dipesan, kategori apa saja, jam berapa pesanan ditutup, outlet mana yang wajib mengisi, dan siapa yang boleh masuk.",
    lead: "Tahap ini dikerjakan **Admin**. Setelah beres, hari-hari berikutnya tidak perlu disentuh lagi, kecuali ada barang, outlet, atau jadwal baru.",
    steps: [
      { role: "admin", t: "Menetapkan jam tutup dan tanggal kirim", p: ["Buka **Atur → Jadwal**. Kartu **Batas waktu umum** mengatur satu jam tutup untuk semua kategori sekaligus (misalnya 17.00) dan kapan barang dibutuhkan (**Besok**, **Hari ini**, atau **Lusa**).", "Pesanan yang dibuat sore ini umumnya untuk **besok**. Karena itu 'tanggal' pada pesanan selalu berarti **tanggal barang dikirim**, bukan tanggal pesanan dibuat."], img: "ad18-atur-cutoff", cap: "Satu jam tutup untuk semua kategori." },
      { role: "admin", t: "Mengatur tiap kategori", p: ["Tiap kategori (Belanja Pusat/Pasar, Keringan, Ayam Potong, Buah, Sayur, Bebek & Ayam Kampung) punya pengaturan sendiri: **dikirim lewat** (Aplikasi atau WhatsApp), **penerima di aplikasi** (Tukang Belanja atau Admin Keringan), jam tutup, kapan barang dibutuhkan, dan **outlet yang wajib mengisi**.", "Inilah yang menentukan jalur sebuah kategori setelah dilepas (lihat Tahap 4)."], img: "ad19-kategori-edit", cap: "Pengaturan satu kategori.", warn: "Mengubah tanggal kirim menggeser pesanan yang sedang dibuka. Lakukan di luar jam pengisian." },
      { role: "admin", t: "Mengatur outlet", p: ["Di **Atur → Outlet** terdaftar semua outlet beserta kodenya. Outlet yang berada di **tempat** yang sama (misalnya DS, SP, SS di Dolan Sawah) digabung di daftar supplier. Outlet nonaktif tidak wajib mengisi."], img: "ad20-atur-outlet", cap: "Daftar outlet dan tempatnya." },
      { role: "admin", t: "Mengisi katalog barang", p: ["Katalog adalah daftar barang yang bisa dipilih outlet. Buka tab **Katalog**, cari barang, atau tambah lewat **+ Barang**: nama, kategori, satuan, harga (opsional), dan outlet yang boleh memesan. Hilangkan centang **Aktif** bila barang tidak dijual lagi (lebih aman daripada menghapus)."], img: "ad11-katalog", cap: "Katalog dengan kolom cari, filter kategori, dan harga." },
      { role: "admin", t: "Membuat akun untuk semua orang", p: ["Di tab **Akun**, admin membuat satu akun untuk setiap orang: Staf Outlet (centang outlet yang boleh diisi), Tukang Belanja, dan Admin Keringan. Username dan password disampaikan langsung ke orangnya. **Hanya Admin yang bisa mengganti password**; pengguna lain tidak bisa mengganti sendiri."], tip: "Satu staf boleh memegang lebih dari satu outlet. Aplikasi menampilkan pilihan outlet di bagian atas beranda." },
    ],
  },
  // ------------------------------------------------------------------ 1
  {
    id: "pesan", num: 1, icon: "📝", title: "Outlet membuat pesanan",
    short: "Pesan", when: "Sore hari, sebelum jam tutup (standar 17.00)",
    who: ["outlet", "admin"],
    goal: "Setiap outlet menuliskan barang yang dibutuhkan besok, per kategori. Tidak ada kertas dan tidak ada chat WhatsApp.",
    lead: "Satu kategori = satu kali kirim. Untuk tiap kategori outlet punya dua pilihan: **Kirim** (ada barang yang dipesan) atau **Tidak pesan** (sudah dicek, hari ini tidak perlu). Dua-duanya dianggap 'selesai'. Yang berbahaya adalah **lupa**: kategori yang dibiarkan kosong membuat daftar tertahan.",
    steps: [
      { role: "outlet", t: "Masuk dan buka beranda", p: ["Buka aplikasi lalu masuk dengan username dan password dari admin. Aplikasi mengingat Anda, jadi tidak perlu masuk tiap hari."], img: "o01-login", cap: "Layar masuk." },
      { role: "outlet", t: "Pilih kategori yang akan diisi", p: ["Tab **Pesan** menampilkan semua kategori outlet Anda. Tiap kategori punya status: **Belum diisi**, **Draf**, **Terkirim**, **Tidak pesan**, atau **Ditutup**. Kalimat di bawah nama kategori menunjukkan jam tutup terdekat."], img: "o02-home", cap: "Kategori Sayur masih Belum diisi (bingkai merah). Ketuk untuk membukanya." },
      { role: "outlet", t: "Pilih barang dengan tombol +", p: ["Ketuk **+** pada barang yang dibutuhkan. Barang naik ke atas dengan warna hijau muda dan jumlah awal 1."], img: "o03-form", cap: "Tanda + menambahkan Wortel ke pesanan." },
      { role: "outlet", t: "Atur jumlah dan satuan", p: ["Ubah jumlah dengan tombol **−/+** atau ketik langsung (boleh desimal, mis. 2,5). Pilih **satuan** yang tepat: 2 kg berbeda dengan 2 ikat."], img: "o04-qty", cap: "Jumlah dan satuan.", warn: "Salah satuan adalah kesalahan pesanan yang paling sering terjadi. Periksa sebelum mengirim." },
      { role: "outlet", t: "Tulis catatan bila perlu", p: ["Ikon **pensil** membuka kolom catatan (ukuran, merek, tingkat kematangan). Catatan ikut terbaca oleh tukang belanja dan supplier."], img: "o05-note", cap: "Catatan untuk satu barang." },
      { role: "outlet", t: "Cari barang dan tambah barang lain", p: ["Ketik sebagian nama di kolom **Cari** untuk menyaring daftar yang panjang. Barang yang tidak ada di daftar? Gulir ke bawah dan ketuk **Tambah barang lain**: tulis nama, jumlah, satuan. Admin bisa memasukkannya ke katalog supaya lain kali mudah dipilih."], img: "o06-search", cap: "Mengetik 'cabai' menampilkan semua jenis cabai." },
      { role: "outlet", t: "Periksa dengan filter 'Dipilih'", p: ["Ketuk **Dipilih (3)** untuk hanya menampilkan barang yang dipesan, lalu periksa sekali lagi. Draf **tersimpan otomatis**: bila sinyal hilang atau aplikasi tertutup, pesanan tidak hilang dan belum dilihat siapa pun."], img: "o08-selected", cap: "Hanya barang yang dipesan yang tampil." },
      { role: "outlet", t: "Kirim", p: ["Ketuk **Kirim**, lalu **Kirim** sekali lagi pada konfirmasi. Pesanan baru masuk setelah statusnya berubah menjadi **Terkirim**.", "Bila tidak ada yang perlu dipesan, ketuk **Tidak pesan**. Di beranda juga ada tombol **Tidak ada pesanan untuk sisanya** untuk menandai semua kategori kosong sekaligus."], img: "o09-confirm", cap: "Konfirmasi sebelum kirim." },
      { role: "outlet", t: "Masih boleh diubah selama daftar belum dilepas", p: ["Pesanan yang sudah terkirim bisa dibuka lagi lewat **Ubah pesanan**, diperbaiki, lalu dikirim ulang, **selama belum semua outlet selesai dan jam tutup belum lewat** (artinya daftar belum dilepas, lihat Tahap 2). Keterangan 'Terkirim. 7/8 outlet sudah mengisi' memberi tahu kemajuan."], img: "o10-sent", cap: "Pesanan terkirim; tombol Ubah pesanan masih ada." },
      { role: "outlet", t: "Beranda menunjukkan hasilnya", p: ["Kategori berubah menjadi **Terkirim** dan angka kemajuan bertambah. Setelah semua kategori beres muncul 'Semua kategori sudah diisi. Terima kasih!'."], img: "o11-home-sent", cap: "Kategori Sayur kini Terkirim." },
    ],
    notes: [
      ["Simpan otomatis", "Draf tersimpan di perangkat dan di server. Aman bila aplikasi tertutup atau sinyal putus."],
      ["Dua perangkat", "Bila akun yang sama dibuka di dua ponsel, aplikasi mencegah satu perangkat menimpa pesanan yang lebih baru dari perangkat lain."],
      ["Barang nonaktif", "Barang yang sudah dinonaktifkan admin tidak bisa dipesan; aplikasi menyebut nama barangnya agar jelas."],
    ],
  },
  // ------------------------------------------------------------------ 2
  {
    id: "lepas", num: 2, icon: "🔓", title: "Daftar dilepas",
    short: "Dilepas", when: "Saat semua outlet selesai, atau jam tutup lewat",
    who: ["admin", "sistem"],
    goal: "Menggabungkan pesanan semua outlet menjadi satu daftar yang sudah final dan menyerahkannya ke orang yang mengerjakan. Sebelum 'dilepas', daftar hanya pratinjau.",
    lead: "Setiap kategori punya satu daftar (disebut **batch**). Daftar itu **dilepas** lewat salah satu dari tiga cara. Cara mana pun yang terjadi lebih dulu yang berlaku.",
    diagram: "release",
    steps: [
      { role: "admin", t: "Memantau siapa yang sudah mengisi", p: ["Buka **Pantau → Pengisian**. Tabel menunjukkan baris = outlet dan kolom = kategori. Hijau berceklis **Terkirim**, abu-abu strip **Tidak pesan**, biru **Draf**, oranye jam **Belum**."], img: "ad02-pantau-grid", cap: "Panarama Resto belum mengisi Sayur (jam oranye)." },
      { role: "admin", t: "Mengingatkan yang belum mengisi", p: ["Ketuk **Ingatkan yang belum**. Notifikasi dikirim ke outlet yang belum mengisi, bila perangkat mereka sudah mengaktifkan notifikasi. Bila semua sudah mengisi, aplikasi menjawab bahwa tidak ada yang perlu diingatkan."], img: "ad03-ingatkan", cap: "Tombol Ingatkan yang belum." },
      { role: "admin", t: "Melihat daftar yang masih menunggu", p: ["Buka kartu kategori. Selama belum lengkap, tampil kotak **Menunggu 1 dari 8 outlet** beserta outlet yang sudah dan belum selesai."], img: "ad05-batch-menunggu", cap: "Rincian outlet yang sudah dan belum mengisi." },
      { role: "sistem", t: "Pratinjau: boleh dilihat, jangan dikerjakan", p: ["Orang yang mengerjakan (tukang belanja, admin keringan) sudah bisa membuka daftar, tetapi bertanda **Pratinjau sementara** dan tombol kirim WhatsApp belum aktif. Daftar masih bisa bertambah bila ada outlet yang belum mengisi."], img: "b09-wa-preview", cap: "Kotak oranye: masih menunggu outlet.", warn: "Jangan belanja atau kirim ke supplier dari pratinjau." },
      { role: "admin", t: "Melepas manual bila perlu", p: ["Bila tidak mau menunggu (misalnya satu outlet jelas tidak memesan), ketuk **Lepas sekarang (walau belum lengkap)**. Aplikasi menyebut outlet yang belum mengisi, dan setelah dilepas mereka **hanya bisa lewat Susulan**. Pelepasan bisa **ditarik kembali** selama belum dikirim ke supplier dan masih ada outlet yang belum selesai."], img: "ad07-lepas-dialog", cap: "Konfirmasi pelepasan." },
      { role: "sistem", t: "Daftar final", p: ["Setelah dilepas, daftar menjadi final: barang semua outlet dijumlahkan per barang dan satuan, lengkap dengan rincian per outlet. Statusnya berubah menjadi **Siap**."], img: "ad25-batch-siap", cap: "Daftar belanja yang sudah final." },
    ],
    notes: [
      ["Setelah dilepas", "Outlet tidak bisa lagi mengubah pesanan biasa. Menambah hanya lewat **Susulan** (Tahap 3)."],
      ["Koreksi oleh admin", "Admin bisa mengoreksi pesanan satu outlet lewat tombol **Koreksi** di daftar per outlet, mis. bila outlet salah isi dan tidak sempat memperbaiki."],
      ["Tanggal kirim terkunci", "Mengubah tanggal kirim ditolak bila sudah ada pesanan terkirim, kecuali admin menegaskannya."],
    ],
  },
  // ------------------------------------------------------------------ 3
  {
    id: "susulan", num: 3, icon: "➕", title: "Susulan: tambahan setelah ditutup",
    short: "Susulan", when: "Setelah daftar dilepas, bila ada yang terlewat",
    who: ["outlet", "admin"],
    goal: "Memberi jalan bagi outlet yang lupa atau butuh tambahan, tanpa mengacaukan daftar yang sudah berjalan.",
    lead: "Susulan **hanya menambah** barang, tidak bisa mengurangi atau mengubah pesanan yang sudah ditutup, dan **baru dikerjakan setelah disetujui Admin**.",
    steps: [
      { role: "outlet", t: "Mengenali pesanan yang sudah ditutup", p: ["Kategori yang sudah dilepas berlabel merah **Ditutup**. Isi pesanan tetap bisa dilihat tetapi tidak bisa diubah."], img: "o12-closed", cap: "Label Ditutup di pojok kanan atas." },
      { role: "outlet", t: "Ketuk Kirim susulan dan pilih barang", p: ["Ketuk tombol oranye **Kirim susulan**. Caranya sama seperti pesanan biasa: **+**, jumlah, satuan, catatan. Tombol oranye mengingatkan bahwa ini susulan."], img: "o13c-susulan-isi", cap: "Micin 2 kg ditambahkan sebagai susulan." },
      { role: "outlet", t: "Kirim dan tunggu keputusan", p: ["Ketuk **Kirim susulan** lalu **Kirim**. Susulan yang belum diputuskan masih bisa dibatalkan lewat **Batalkan susulan**."], img: "o13d-susulan-konfirmasi", cap: "Konfirmasi susulan.", tip: "Untuk barang mendesak, hubungi admin langsung supaya segera diputuskan." },
      { role: "admin", t: "Admin menyetujui atau menolak", p: ["Di tab **Susulan** (angka di lonceng ikut bertambah) admin melihat outlet pengirim, kategori, tanggal kirim, dan barangnya. **Setujui**: barang langsung bergabung ke daftar tukang belanja atau gudang. **Tolak**: barang tidak dipesan dan outlet melihat bahwa susulannya ditolak."], img: "ad09-susulan-setujui", cap: "Tombol Setujui (hijau) dan Tolak (merah)." },
    ],
    notes: [
      ["Kategori WhatsApp yang sudah dikirim", "Bila susulan disetujui setelah daftar WhatsApp terkirim ke supplier, tukang belanja diberi tahu dan pesan WhatsApp berikutnya hanya memuat **tambahannya**, bukan seluruh daftar lagi."],
      ["Putuskan lebih awal", "Susulan sebaiknya diputuskan sebelum tukang belanja berangkat atau sebelum supplier mengemas barang."],
    ],
  },
  // ------------------------------------------------------------------ 4
  {
    id: "kerja", num: 4, icon: "🛒", title: "Daftar dikerjakan: tiga jalur",
    short: "Dikerjakan", when: "Malam hari sampai pagi sebelum barang dibutuhkan",
    who: ["belanja", "keringan", "supplier"],
    goal: "Mengubah daftar final menjadi barang nyata. Jalur ditentukan oleh pengaturan kategori (Tahap 0).",
    lead: "Ada tiga jalur. Pesanan outlet **sama** untuk semuanya; yang berbeda hanya siapa yang mengerjakan.",
    diagram: "jalur",
    subs: [
      {
        id: "pasar", icon: "🧺", title: "Jalur A: Belanja ke pasar", role: "belanja",
        intro: "Untuk kategori **Belanja Pusat (Pasar)**. Tukang belanja membeli sendiri dan mencatat apa yang sungguh didapat dan berapa harganya. Layar sengaja dijaga tetap menyala selama daftar terbuka.",
        steps: [
          { role: "belanja", t: "Mulai dari Ringkasan", p: ["Tab **Ringkasan** menampilkan satu kartu per kategori: tanggal, jumlah jenis barang dari berapa outlet, dan status (**Menunggu N outlet**, **Siap dibelanjakan**, **Siap dikirim WA**, **Sudah dikirim WA**). Ketuk kartunya untuk membuka daftar."], img: "b01-ringkasan", cap: "Kartu Belanja ke pasar dan kartu supplier WhatsApp." },
          { role: "belanja", t: "Baca daftar belanja", p: ["Tab **Pasar** memuat daftar barang: nama, rincian per outlet (mis. 'Dolan Sawah 5 · Soto Pagi 1,5'), dan **jumlah total** di kanan. Tombol **Gabungan** menampilkan satu baris per barang (praktis di pasar); **Per outlet** mengelompokkan per outlet (praktis saat menyusun paket)."], img: "b03-pasar-atas", cap: "Kartu kategori, pilihan tanggal, dan jumlah barang." },
          { role: "belanja", t: "Dapat sebanyak pesanan? Ketuk centang", p: ["Bila barang didapat sebanyak yang dipesan, cukup ketuk **kotak centang** di kiri. Barang dicoret dan tercatat 'dibeli sebanyak pesanan'."], img: "b05-centang", cap: "Kotak centang di baris Kencur." },
          { role: "belanja", t: "Hasilnya berbeda? Catat rinci", p: ["Ketuk **nama barang** atau ikon **pensil**. Pilih hasil belanja: **Dapat sesuai**, **Sebagian** (isi jumlah yang didapat), **Ganti barang** (tulis penggantinya di catatan), atau **Tidak ada** (habis di pasar)."], img: "b06-sheet", cap: "Lembar Catat pembelian." },
          { role: "belanja", t: "Isi jumlah, harga total, dan catatan", p: ["Isi **Jumlah dibeli** dan **Harga total** (rupiah yang dibayar untuk barang itu, bukan harga satuan). Aplikasi menghitung harga per satuan otomatis. Harga boleh dikosongkan."], img: "b07-sheet-harga", cap: "Rp 63.000 untuk 4,5 kg terhitung Rp 14.000 per kg." },
          { role: "belanja", t: "Hasil tersimpan dan terlihat admin", p: ["Baris barang menampilkan status berwarna, jumlah, harga, dan catatan. Di ujung daftar kotak **Biaya nyata tercatat** menjumlahkan semua harga yang diisi. Semuanya muncul di **Realisasi** milik admin (Tahap 6)."], img: "b09-tersimpan", cap: "Kencur dibeli 4,5 kg dari 5 kg, sisanya habis di pasar." },
        ],
      },
      {
        id: "wa", icon: "💬", title: "Jalur B: Diteruskan ke supplier lewat WhatsApp", role: "belanja",
        intro: "Untuk kategori yang dikirim lewat **WhatsApp**: Ayam Potong, Buah, Sayur, Bebek & Ayam Kampung. Tukang belanja tidak membeli sendiri; ia meneruskan daftar final ke grup supplier, dan supplier yang mengantar.",
        steps: [
          { role: "belanja", t: "Pilih kategori di tab WhatsApp", p: ["Pindah antar kategori lewat deretan tombol di atas. Status **Siap** berarti daftar lengkap dan boleh dikirim; selama masih pratinjau, tombol kirim tidak aktif."], img: "b13-wa-atas", cap: "Kategori Buah siap dikirim." },
          { role: "belanja", t: "Pilih format pesan", p: ["**Per outlet + total**: rincian tiap outlet lalu rekap total (cocok bila supplier mengemas per outlet). **Total saja**: hanya rekap barang (lebih singkat); catatan outlet tetap ikut."], img: "b16-wa-format", cap: "Dua pilihan format." },
          { role: "belanja", t: "Baca teks sebelum dikirim", p: ["Ketuk **Lihat teks** untuk membaca pesan persis seperti yang akan terkirim. Periksa nama barang dan jumlah. Aplikasi juga memperingatkan bila pesan dikirim melewati tengah malam sehingga tanggalnya bisa membingungkan supplier."], img: "b14-wa-teks", cap: "Teks pesan." },
          { role: "belanja", t: "Kirim ke WhatsApp", p: ["Ketuk **Kirim ke WhatsApp**. WhatsApp terbuka dengan pesan sudah terisi; **pilih grup supplier** lalu tekan kirim. Setelah itu aplikasi menanyakan konfirmasi dan menandai kategori **Sudah dikirim WA** lengkap dengan jam dan nama pengirim."], img: "b15-wa-kirim", cap: "Tombol hijau Kirim ke WhatsApp.", warn: "Salah grup? Hapus pesan di WhatsApp, lalu ketuk 'Kirim lagi ke WhatsApp' dan pilih grup yang benar." },
          { role: "supplier", t: "Supplier mengemas dan mengantar", p: ["Bagian ini terjadi **di luar aplikasi**: supplier membaca pesan di grup, menyiapkan barang, dan mengantar ke outlet pada tanggal kirim."] },
          { role: "belanja", t: "Pastikan semuanya terkirim", p: ["Kembali ke **Ringkasan** untuk memastikan semua kategori WhatsApp sudah **Sudah dikirim WA**."], img: "b12-ringkasan-wa", cap: "Status kiriman tiap kategori." },
        ],
      },
      {
        id: "keringan", icon: "📦", title: "Jalur C: Barang keringan dari gudang", role: "keringan",
        intro: "Untuk kategori **Keringan** (barang keringan yang disimpan di gudang). Barang tidak dibeli melainkan **diambil dari gudang**, jadi Admin Keringan menyiapkannya per outlet dan stok berkurang otomatis.",
        steps: [
          { role: "keringan", t: "Buka Pesanan, pilih 'Siapkan per outlet'", p: ["Tab **Pesanan** menampilkan barang keringan yang dipesan. **Gabungan** menunjukkan total tiap barang; **Siapkan per outlet** adalah layar kerja utama, satu kotak per outlet dengan kemajuan (mis. **0/4 disiapkan**). Di atas ada pintasan ringkasan stok gudang."], img: "k11-pesanan-atas", cap: "Tab Pesanan dengan ringkasan stok gudang." },
          { role: "keringan", t: "Tautkan barang pesanan dengan barang stok (pertama kali)", p: ["Daftar pesanan dan daftar stok gudang tidak selalu bernama atau berasatuan sama. Pada pemberian **pertama**, pilih barang stok yang dimaksud (aplikasi menebak dan menandai 'dipilih otomatis'; periksa dulu). Pilihan **diingat** untuk semua outlet dan tanggal berikutnya. Barang yang memang tidak dilacak dipilih sebagai **Tanpa stok**."], img: "k17-pilih-stok", cap: "Kolom 'Barang di stok gudang' masih kosong: pilih barang yang benar." },
          { role: "keringan", t: "Catat jumlah yang diberikan", p: ["Ketuk pensil, isi **jumlah diberikan ke outlet**. Aplikasi langsung menandai **Sesuai pesanan**, **Kurang**, **Lebih**, atau **Tidak diberi**, lalu menghitung stok, mis. 'Stok 20 kg → sisa 19 kg'. Isi 0 bila barang tidak diberikan."], img: "k15-sheet-kurang", cap: "Dipesan 1,5 kg, diberikan 1 kg: Kurang. Stok 20 kg menjadi 19 kg." },
          { role: "keringan", t: "Centang cepat bila sesuai", p: ["Sesudah tertaut, barang yang sama untuk outlet lain cukup dicentang. Aplikasi memberi sesuai jumlah pesanan dan memotong stok bila **tautannya jelas, satuannya cocok, dan stoknya cukup**. Bila salah satunya tidak terpenuhi, barang hanya tercentang dengan keterangan 'stok belum dicatat' dan dapat dicatat ke stok belakangan lewat tombol **Catat ke stok**."], img: "k20-centang-cepat", cap: "Centang di baris Bawang Putih (barang sudah tertaut)." },
          { role: "keringan", t: "Satuan berbeda dan barang pengganti", p: ["Bila satuan pesanan lain dari satuan stok (pesan 'dus', stok 'pack'), aplikasi bertanya: **'1 dus berapa pack?'** atau 'mana satuan yang benar?'. Jawaban diingat, dan bila satuan pesanan memang keliru, outlet menerima **banner 'Ganti satuan pesanan'**. Bila barang utama kurang, sisanya dapat otomatis diambil dari **barang pengganti** (mis. santan Sasa habis, diganti Kara)."] },
          { role: "keringan", t: "Membatalkan pemberian", p: ["Salah centang? Ketuk lagi. Aplikasi menyebut **berapa stok yang akan dikembalikan**; ketuk **Batalkan** untuk menarik pemberian dan mengembalikan stok."], img: "k22-batal-dialog", cap: "Konfirmasi pembatalan: stok kembali 4 kg.", warn: "Bila stok tidak cukup, penyimpanan ditolak dan tidak ada yang berubah. Lakukan Barang masuk atau Opname dulu." },
          { role: "keringan", t: "Kartu Kekurangan", p: ["Barang yang tidak terpenuhi dari gudang dikumpulkan di kartu **Kekurangan** dan bisa disalin (**Salin**) untuk diteruskan atau ditindaklanjuti."] },
        ],
        after: [
          { role: "keringan", t: "Kelola stok: barang masuk, keluar, opname", p: ["Menu **Stok gudang** punya tiga tombol aksi. **Barang masuk** menambah stok saat gudang menerima barang dari supplier. **Keluar ke outlet** hanya untuk barang yang diambil di luar pesanan. **Opname** mencocokkan angka sistem dengan hitungan fisik; selisih besar atau opname malam hari ditandai tidak wajar dan dilihat admin. Salah catat? Batalkan dari tab **Riwayat** (transaksi sendiri, maksimal 24 jam)."], img: "k0x-ringkasan", cap: "Ringkasan stok: menipis, habis, minus." },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 5
  {
    id: "terima", num: 5, icon: "📬", title: "Barang tiba: outlet mencatat penerimaan",
    short: "Diterima", when: "Pada tanggal kirim, begitu barang sampai",
    who: ["outlet"],
    goal: "Mencatat dengan jujur apa yang sungguh diterima. Catatan inilah yang membuat admin tahu barang mana yang kurang, rusak, atau berlebih.",
    lead: "Dikerjakan dari tab **Barang datang** di akun outlet. Prinsipnya: yang **sesuai** cukup dicentang (cepat), yang **bermasalah** dicatat satu per satu.",
    steps: [
      { role: "outlet", t: "Pilih tanggal kirim", p: ["Buka **Barang datang**. Pesanan yang Anda buat kemarin sore biasanya tiba **hari ini**. Pakai **Kemarin / Hari ini / Besok** atau panah untuk berpindah tanggal."], img: "o14-terima-tanggal", cap: "Pilihan tanggal di tab Barang datang." },
      { role: "outlet", t: "Pilih kategori yang barangnya sudah tiba", p: ["Layar menunjukkan kemajuan (mis. 4/6 kategori) dan status tiap kategori: **Belum dicatat**, **Sesuai**, atau **Ada selisih**."], img: "o15-terima-home", cap: "Keringan dan Buah masih Belum dicatat." },
      { role: "outlet", t: "Centang yang sesuai", p: ["Tiap baris menampilkan jumlah yang **dipesan**. Bila yang datang sama persis, ketuk **centang** di kanan baris."], img: "o16-terima-list", cap: "Centang = diterima sesuai pesanan." },
      { role: "outlet", t: "Catat yang kurang atau lebih", p: ["Ketuk **nama barang** (bukan centangnya), lalu ubah **Jumlah diterima**. Status menyesuaikan sendiri: **Sesuai**, **Kurang**, atau **Lebih**. Tombol cepat: **Semua datang** dan **Tidak datang** (jumlah 0)."], img: "o17-terima-kurang", cap: "Pesan 2 kg, diterima 1,5 kg: otomatis Kurang." },
      { role: "outlet", t: "Tandai barang rusak dan jelaskan", p: ["Centang **Ada yang rusak / tidak layak**, tulis penjelasan di **Catatan** (mis. '0,5 kg busuk'), lalu **Simpan**. Catatan terbaca admin dan tukang belanja untuk ditindaklanjuti ke supplier."], img: "o18-terima-rusak", cap: "Centang rusak dan tulis catatan.", warn: "Simpan atau foto barang rusak sampai admin menyatakan sudah ditangani." },
      { role: "outlet", t: "Terima sisanya sesuai", p: ["Setelah yang bermasalah dicatat, ketuk **Terima sisanya sesuai**. Semua barang lain otomatis tercatat sesuai pesanan. Hemat waktu bila sebagian besar barang sudah benar."], img: "o20-terima-semua", cap: "Satu ketukan menyelesaikan sisanya." },
      { role: "outlet", t: "Cek ringkasan", p: ["Kategori yang punya selisih ditandai merah **Ada selisih**. Salah catat? Ketuk lagi barangnya dan perbaiki, atau **Hapus catatan** untuk mengulang."], img: "o22-terima-home-selisih", cap: "Kategori dengan selisih ditandai merah." },
    ],
    notes: [
      ["Jenis selisih dihitung server", "Sesuai, kurang, dan lebih ditentukan otomatis dari angka. Hanya **rusak** yang dipilih manual."],
      ["Lima status penerimaan", "**Sesuai**, **Kurang**, **Lebih**, **Rusak**, **Tidak datang**."],
    ],
  },
  // ------------------------------------------------------------------ 6
  {
    id: "realisasi", num: 6, icon: "📊", title: "Admin memeriksa: dipesan vs dibeli vs diterima",
    short: "Realisasi", when: "Setelah barang tiba (biasanya siang), dan berkala",
    who: ["admin"],
    goal: "Menutup lingkaran: apakah yang dipesan sama dengan yang dibeli dan yang tiba di outlet? Selisih ditindaklanjuti ke supplier, tukang belanja, atau outlet.",
    lead: "Dibuka dari **Pantau → Realisasi**. Tiga sumber data dipertemukan: pesanan outlet (Tahap 1), catatan pembelian tukang belanja (Tahap 4A), dan catatan penerimaan outlet (Tahap 5).",
    steps: [
      { role: "admin", t: "Baca empat angka utama", p: ["Pilih tanggal kirim. **Barang dibeli** (mis. 17/18), **Biaya nyata** (total rupiah dari harga yang dicatat tukang belanja), **Penerimaan selesai** (berapa pencatatan outlet sudah selesai), dan **Perlu dicek** (jumlah selisih). Tanggalnya adalah tanggal kirim, jadi 'hari ini' bisa masih kosong dan otomatis melompat ke tanggal yang berisi."], img: "ad10-realisasi", cap: "Ringkasan realisasi satu tanggal." },
      { role: "admin", t: "Telusuri selisih", p: ["Daftar **Perlu ditindaklanjuti** menyebut jenis masalah: **Tidak dibeli**, **Dibeli sebagian**, **Diganti barang lain**, **Tidak datang**, **Diterima rusak**, **Kurang diterima**, **Lebih diterima**, lengkap dengan barang, outlet, catatan, dan angka pesan vs hasil. Gunakan untuk menegur supplier, menagih kekurangan, atau mengecek laporan outlet. **Unduh CSV** membawa datanya ke Excel."], img: "ad10b-realisasi-2", cap: "Contoh selisih: rusak, kurang diterima, dibeli sebagian." },
      { role: "admin", t: "Memantau gudang", p: ["Tab **Stok** (sama dengan milik Admin Keringan) dipakai admin untuk memeriksa stok menipis atau minus, dan **Atur → Gudang** menampilkan jejak audit aktivitas gudang, termasuk yang ditandai tidak wajar."] },
    ],
  },
];

const MATRIX = [
  // [tahap, outlet, belanja, keringan, admin]
  ["0 Persiapan", "", "", "", "Atur jadwal, kategori, outlet, katalog, akun"],
  ["1 Pesan", "Mengisi dan mengirim pesanan; Tidak pesan", "", "", "Memantau, mengingatkan"],
  ["2 Dilepas", "Menunggu (tidak bisa mengubah setelah dilepas)", "Melihat pratinjau", "Melihat pratinjau", "Melepas manual / menarik kembali; Koreksi"],
  ["3 Susulan", "Mengirim susulan", "", "", "Menyetujui atau menolak"],
  ["4 Dikerjakan", "", "Belanja pasar; meneruskan WhatsApp", "Menyiapkan barang keringan, mengelola stok", "Memantau"],
  ["5 Diterima", "Mencatat barang yang datang", "", "", ""],
  ["6 Realisasi", "Melihat selisih milik sendiri", "", "", "Memeriksa dan menindaklanjuti selisih"],
];

const SCREENS = [
  ["outlet", "Staf Outlet", ["Pesan", "Barang datang"]],
  ["belanja", "Tukang Belanja", ["Ringkasan", "Pasar", "WhatsApp"]],
  ["keringan", "Admin Keringan", ["Pesanan", "Stok gudang"]],
  ["admin", "Admin", ["Pantau", "Stok", "Susulan", "Katalog", "Akun", "Atur"]],
];

const DAY = [
  ["H-1 pagi–sore", "outlet", "Outlet mengisi pesanan untuk besok (draf tersimpan otomatis)."],
  ["H-1 menjelang jam tutup", "admin", "Admin memantau tabel Pengisian dan menekan Ingatkan yang belum."],
  ["H-1 jam tutup (17.00) atau semua selesai", "sistem", "Daftar dilepas. Outlet yang terlambat hanya bisa lewat Susulan."],
  ["H-1 malam", "belanja", "Tukang belanja meneruskan daftar WhatsApp ke grup supplier. Admin memutuskan susulan."],
  ["H dini hari–pagi", "belanja", "Belanja ke pasar; hasil dicatat (centang, harga, catatan)."],
  ["H pagi", "keringan", "Admin Keringan menyiapkan barang per outlet; stok berkurang."],
  ["H pagi–siang", "outlet", "Barang tiba. Outlet mencatat penerimaan di tab Barang datang."],
  ["H siang", "admin", "Admin membuka Realisasi dan menindaklanjuti selisih."],
];

const FAQ = [
  ["outlet", "Saya sudah mengirim tetapi ingin menambah satu barang.", "Bila daftar belum dilepas, ketuk **Ubah pesanan**, tambah barang, lalu **Kirim** lagi. Bila sudah ditutup, pakai **Kirim susulan** dan tunggu persetujuan admin."],
  ["outlet", "Pesanan saya hilang setelah menutup aplikasi.", "Draf tersimpan otomatis. Buka kembali kategorinya, drafnya muncul."],
  ["outlet", "Barang yang datang lebih banyak dari pesanan.", "Di tab **Barang datang** ketuk nama barangnya, isi jumlah sebenarnya. Status otomatis menjadi **Lebih**."],
  ["outlet", "Ada banner 'Ganti satuan pesanan'.", "Admin gudang menemukan satuan pesanan yang kurang tepat. Pakai satuan yang disarankan pada pesanan berikutnya."],
  ["belanja", "Barang tidak ada di pasar.", "Ketuk nama barang, pilih **Tidak ada** (atau **Ganti barang**) dan tulis catatan. Admin dan outlet bisa melihatnya."],
  ["belanja", "Daftar belum muncul padahal outlet sudah selesai.", "Daftar diperbarui otomatis tiap 30 detik. Buka tab lain lalu kembali, atau tutup dan buka lagi aplikasinya."],
  ["belanja", "Pesan WhatsApp terkirim ke grup yang salah.", "Hapus pesan itu di WhatsApp, lalu ketuk **Kirim lagi ke WhatsApp** dan pilih grup yang benar."],
  ["keringan", "Stok barang minus.", "Biasanya saldo awal salah atau ada barang keluar yang belum dicatat masuknya. Lakukan **Opname** dengan jumlah fisik."],
  ["keringan", "Barang pesanan tidak ada di daftar stok.", "Pilih **Tanpa stok (tidak dilacak)**. Bila seharusnya dipantau, tambahkan dulu lewat **+ Barang** di tab Stok."],
  ["keringan", "Salah memberi jumlah ke outlet.", "Buka lagi barisnya, ubah jumlah, **Simpan**: stok lama dikembalikan, stok baru dikurangi otomatis. Untuk menghapus, **Batalkan pemberian**."],
  ["admin", "Ada outlet yang lupa mengisi setelah dilepas.", "Minta outlet mengirim **susulan**, lalu setujui. Atau **tarik kembali pelepasan** bila belum dikirim ke supplier."],
  ["admin", "Kenapa angka Pantau berbeda dengan Realisasi?", "Pantau menunjukkan siapa yang sudah **memesan**. Realisasi menunjukkan **hasil**: dibeli, diterima, dan selisihnya."],
  ["admin", "Outlet baru dibuka.", "**Atur → Outlet → Tambah outlet**, lalu buat akun stafnya di tab **Akun** dengan centang outlet itu."],
];

const GLOSSARY = [
  ["Kategori", "Kelompok barang (Pasar, Keringan, Ayam Potong, Buah, Sayur, Bebek & Ayam Kampung). Satu kategori = satu daftar."],
  ["Batch / daftar", "Gabungan pesanan semua outlet untuk satu kategori dan satu tanggal kirim."],
  ["Jam tutup (cut-off)", "Batas jam pengisian. Setelah lewat, daftar otomatis dilepas."],
  ["Dilepas", "Daftar menjadi final dan diserahkan ke yang mengerjakan."],
  ["Susulan", "Tambahan pesanan setelah daftar ditutup; wajib disetujui admin."],
  ["Tanggal kirim", "Tanggal barang dibutuhkan. Menjadi tanggal acuan di semua layar."],
  ["Realisasi", "Perbandingan pesanan, pembelian nyata, dan penerimaan nyata."],
  ["Opname", "Menghitung fisik barang gudang lalu menyamakan angka sistem."],
  ["Pratinjau", "Daftar yang belum final karena masih ada outlet yang belum mengisi."],
];

module.exports = { ROLES, PHASES, MATRIX, SCREENS, DAY, FAQ, GLOSSARY };
