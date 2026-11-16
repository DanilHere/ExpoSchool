'use strict';

// ============================================================
// UTILITAS KEAMANAN (XSS Sanitizer, Input Validator & Safe Math)
// ============================================================
function escapeHTML(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

// Bersihkan karakter berbahaya & batasi panjang teks input pembeli (Diperbaiki tanpa karakter aneh)
function sanitizeTextInput(raw, maxLen = 60) {
    if (typeof raw !== 'string') return '';
    return raw
        .replace(/[<>\/\\"'`]/g, '')
        .trim()
        .slice(0, maxLen);
}

// ============================================================
// PENGATURAN GAMBAR PRODUK & KATALOG TERKUNCI (Object.freeze)
// ============================================================
const PRODUCT_IMAGES = Object.freeze({
    "01": "image/cappucino.jpeg",
    "02": "image/matchalatte.jpeg",
    "03": "image/dubai.jpeg",
    "04": "image/matchastraw.jpeg",
    "05": "image/escoklat.webp",
    "06": "image/batagor.jpg",
    "07": "image/pentol.webp"
});

// Data 7 Produk Kelas XII MIPA 2 (Booth #04) - Dibekukan agar aman
const menuItems = Object.freeze([
    Object.freeze({
        id: "01",
        name: "Cappucino Ice",
        category: "minuman",
        badge: "SIGNATURE COFFEE",
        badgeStyle: "bg-tealDeep text-white",
        price: 10000,
        stock: 35,
        prepTime: "Diracik fresh dengan es batu kristal",
        description: "Perpaduan double shot espresso robusta pilihan, gula aren organik cair, dan susu segar full cream dingin.",
        ingredients: "Double shot espresso robusta pilihan, gula aren organik cair, dan susu segar full cream dingin.",
        image: PRODUCT_IMAGES["01"],
        fitMode: "contain",
        accentHex: "#B57B4C"
    }),
    Object.freeze({
        id: "02",
        name: "Iced Matcha Latte",
        category: "minuman",
        badge: "PURE MATCHA • CREAMY",
        badgeStyle: "bg-matcha text-white",
        price: 12000,
        stock: 25,
        prepTime: "Whisked fresh tiap pesanan",
        description: "Pure Japanese matcha powder grade premium yang di-whisk lembut di atas susu segar dingin.",
        ingredients: "Pure Japanese matcha powder grade premium yang di-whisk lembut di atas susu segar dingin.",
        image: PRODUCT_IMAGES["02"],
        fitMode: "contain",
        accentHex: "#5B9A3D"
    }),
    Object.freeze({
        id: "03",
        name: "Mochi Dubai Cokelat Pistachio Kunafa",
        category: "makanan",
        badge: "VIRAL • LIMITED BATCH",
        badgeStyle: "bg-terracotta text-white",
        price: 15000,
        stock: 20,
        prepTime: "Disajikan dingin agar tetap lumer & renyah",
        description: "Kulit mochi cokelat lembut berbalut bubuk kakao premium dengan isian selai pistachio melimpah dan kunafa renyah.",
        ingredients: "Kulit mochi cokelat lembut berbalut bubuk kakao premium dengan isian selai pistachio melimpah dan kunafa renyah.",
        image: PRODUCT_IMAGES["03"],
        fitMode: "cover",
        accentHex: "#5C3A21"
    }),
    Object.freeze({
        id: "04",
        name: "Iced Strawberry Matcha Latte",
        category: "minuman",
        badge: "TRIPLE LAYER • SEGAR",
        badgeStyle: "bg-terracotta text-white",
        price: 14000,
        stock: 25,
        prepTime: "Langsung diracik 3 layer",
        description: "Selai stroberi homemade manis-asam di dasar gelas, susu segar dingin, dan lapisan pure matcha di atasnya.",
        ingredients: "Selai stroberi homemade manis-asam di dasar gelas, susu segar dingin, dan lapisan pure matcha di atasnya.",
        image: PRODUCT_IMAGES["04"],
        fitMode: "contain",
        accentHex: "#D93848"
    }),
    Object.freeze({
        id: "05",
        name: "Iced Chocolate Klasik",
        category: "minuman",
        badge: "RICH COCOA • FAVORIT",
        badgeStyle: "bg-tealDeep text-white",
        price: 10000,
        stock: 30,
        prepTime: "Siap saji dingin",
        description: "Dark cocoa powder pekat yang diracik creamy dengan susu segar dan es batu penuh.",
        ingredients: "Dark cocoa powder pekat yang diracik creamy dengan susu segar dan es batu penuh.",
        image: PRODUCT_IMAGES["05"],
        fitMode: "cover",
        accentHex: "#6F4E37"
    }),
    Object.freeze({
        id: "06",
        name: "Batagor",
        category: "makanan",
        badge: "GURIH & RENYAH",
        badgeStyle: "bg-terracotta text-white",
        price: 10000,
        stock: 25,
        prepTime: "Digoreng hangat & disiram bumbu kacang",
        description: "Pangsit dan tahu ikan tenggiri goreng renyah disiram bumbu kacang kental gurih, kecap manis, serta perasan jeruk limau segar.",
        ingredients: "Tahu putih, pangsit ikan tenggiri, saus kacang sangrai, kecap manis, jeruk limau",
        image: PRODUCT_IMAGES["06"],
        fitMode: "cover",
        accentHex: "#B85D19"
    }),
    Object.freeze({
        id: "07",
        name: "Pentol Gaul",
        category: "makanan",
        badge: "KUAH KALDU",
        badgeStyle: "bg-matcha text-white",
        price: 10000,
        stock: 30,
        prepTime: "Disajikan panas dengan kuah kaldu",
        description: "Pentol daging sapi kenyal disajikan dalam kuah kaldu gurih hangat lengkap dengan taburan bawang goreng, seledri, dan taoge segar.",
        ingredients: "Pentol bakso daging sapi, kuah kaldu sapi gurih, taoge, daun seledri, bawang merah goreng, sambal",
        image: PRODUCT_IMAGES["07"],
        fitMode: "cover",
        accentHex: "#4A7C59"
    })
]);

const ALLOWED_PICKUP_TIMES = Object.freeze([
    "Istirahat 1 (09.30)",
    "Istirahat 2 (12.00)",
    "Pulang Sekolah (14.30)",
    "Ambil di Booth/Stan"
]);

// Generator fallback SVG bersih jika file gambar lokal belum berada di folder yang sama
function getFallbackIllustration(item) {
    const bg = item.fitMode === 'contain' ? '#FFFFFF' : '#F7F5F2';
    const accent = item.accentHex || '#124E54';
    const safeName = escapeHTML(item.name);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
            <rect width="600" height="450" fill="${bg}"/>
            <rect x="24" y="24" width="552" height="402" rx="18" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 6" opacity="0.45"/>
            <circle cx="300" cy="185" r="46" fill="${accent}" opacity="0.12"/>
            <path d="M276 195 h48 l-6 22 h-36 z M284 175 c0-10 32-10 32 0" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="300" y="268" font-family="monospace" font-size="14" font-weight="bold" fill="#222222" text-anchor="middle">MENU NO. ${escapeHTML(item.id)} • DAPUR XII-2</text>
            <text x="300" y="294" font-family="sans-serif" font-size="18" font-weight="bold" fill="${accent}" text-anchor="middle">${safeName}</text>
        </svg>
    `.trim();
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// State Keranjang & Filter Aktif
let cart = [];
let currentFilter = 'all';

// Generate nomor tiket acak
function generateNewTicketNumber() {
    let randomNum = 48;
    if (window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint16Array(1);
        window.crypto.getRandomValues(arr);
        randomNum = 100 + (arr[0] % 900);
    } else {
        randomNum = Math.floor(100 + Math.random() * 900);
    }
    return `#XII2-${randomNum}`;
}

const ticketEl = document.getElementById('ticket-number');
if (ticketEl) ticketEl.textContent = generateNewTicketNumber();

// Format Rupiah
function formatRupiah(angka) {
    const num = Number(angka) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
}

// Ambil jumlah item di keranjang untuk kartu menu
function getItemQtyInCart(id) {
    const found = cart.find(item => item.id === id);
    return found ? found.qty : 0;
}

// Hitung ulang total keranjang langsung dari katalog resmi
function getVerifiedCartSummary() {
    let total = 0;
    let totalQty = 0;
    const verifiedItems = [];

    cart.forEach(cartEntry => {
        const official = menuItems.find(m => m.id === cartEntry.id);
        if (!official) return;
        const safeQty = Math.min(Math.max(1, parseInt(cartEntry.qty, 10) || 1), official.stock);
        const subtotal = official.price * safeQty;
        total += subtotal;
        totalQty += safeQty;
        verifiedItems.push({
            id: official.id,
            name: official.name,
            price: official.price,
            qty: safeQty,
            subtotal
        });
    });

    return { verifiedItems, total, totalQty };
}

// Render Daftar Menu
function renderMenu(filter = currentFilter) {
    const validFilters = ['all', 'makanan', 'minuman'];
    currentFilter = validFilters.includes(filter) ? filter : 'all';

    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    const filteredItems = currentFilter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentFilter);

    filteredItems.forEach(item => {
        const qtyInCart = getItemQtyInCart(item.id);
        const stockStatus = item.stock <= 20 ? 'STOK TERBATAS' : 'READY STOK';
        const stockColor = item.stock <= 20 ? 'text-terracotta' : 'text-matcha';
        const imgWrapperBg = item.fitMode === 'contain' ? 'bg-white' : 'bg-surfaceSoft';
        const imgClass = item.fitMode === 'contain' 
            ? 'w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500' 
            : 'w-full h-full object-cover group-hover:scale-105 transition duration-500';
        const fallbackUrl = getFallbackIllustration(item);

        const card = document.createElement('article');
        card.className = 'bg-white border border-borderLight rounded-2xl hover:shadow-card-hover transition duration-300 flex flex-col justify-between overflow-hidden group';
        card.innerHTML = `
            <div>
                <!-- Image Area -->
                <div onclick="openProductModal('${escapeHTML(item.id)}')" class="relative h-56 overflow-hidden ${imgWrapperBg} border-b border-borderLight/60 cursor-pointer">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy"
                         onerror="this.onerror=null; this.src='${fallbackUrl}';"
                         class="${imgClass}">
                    <span class="absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-xs ${item.badgeStyle}">
                        ${escapeHTML(item.badge)}
                    </span>
                    <span class="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-ink font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-borderLight">
                        NO. ${escapeHTML(item.id)}
                    </span>
                    <span class="absolute bottom-3 right-3 bg-white/95 text-ink text-[11px] font-semibold px-3 py-1 rounded-full border border-borderLight shadow-2xs opacity-95 group-hover:bg-ink group-hover:text-white transition">
                        <i class="fa-solid fa-magnifying-glass-plus mr-1"></i>Detail
                    </span>
                </div>

                <!-- Body -->
                <div class="p-4 pb-3">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-[11px] font-semibold ${stockColor}">● ${stockStatus} (${item.stock})</span>
                    </div>
                    <h3 onclick="openProductModal('${escapeHTML(item.id)}')" class="font-medium text-base text-ink hover:text-terracotta cursor-pointer transition leading-snug">
                        ${escapeHTML(item.name)}
                    </h3>
                    <p class="text-xs text-inkMuted mt-1.5 line-clamp-2 leading-relaxed">
                        ${escapeHTML(item.description)}
                    </p>
                </div>
            </div>

            <!-- Footer Price & Quantity Controls -->
            <div class="px-4 pb-4 pt-3 flex items-center justify-between gap-2">
                <div>
                    <span class="block text-[10px] font-medium text-inkMuted">HARGA PORSI</span>
                    <span class="font-bold text-lg text-ink">${formatRupiah(item.price)}</span>
                </div>

                ${qtyInCart === 0 ? `
                    <button type="button" onclick="addToCart('${escapeHTML(item.id)}')" 
                            class="bg-surfaceSoft hover:bg-terracotta text-ink hover:text-white border border-borderLight hover:border-terracotta font-semibold text-xs px-4 py-2.5 rounded-full transition cursor-pointer">
                        + TAMBAH
                    </button>
                ` : `
                    <div class="flex items-center gap-1.5 bg-surfaceSoft border border-borderLight rounded-full p-1 text-xs">
                        <button type="button" onclick="changeQty('${escapeHTML(item.id)}', -1)" class="w-7 h-7 rounded-full bg-white text-ink hover:bg-terracotta hover:text-white font-bold transition cursor-pointer shadow-2xs">-</button>
                        <span class="w-6 text-center font-bold text-ink">${qtyInCart}</span>
                        <button type="button" onclick="changeQty('${escapeHTML(item.id)}', 1)" class="w-7 h-7 rounded-full bg-ink text-white font-bold hover:bg-terracotta transition cursor-pointer">+</button>
                    </div>
                `}
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter Kategori
function filterMenu(category) {
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.className = 'filter-tab px-4 py-2 rounded-full bg-surfaceSoft text-ink hover:bg-surfaceWarm font-semibold transition cursor-pointer';
    });
    const activeBtn = document.getElementById(`btn-${category}`);
    if (activeBtn) {
        activeBtn.className = 'filter-tab px-4 py-2 rounded-full bg-ink text-white font-semibold shadow-xs transition cursor-pointer';
    }
    renderMenu(category);
}

// Modal Detail Produk
function openProductModal(id) {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;

    const modalImgBg = item.fitMode === 'contain' ? 'bg-white' : 'bg-surfaceSoft';
    const modalImgClass = item.fitMode === 'contain' ? 'w-full h-full object-contain p-5' : 'w-full h-full object-cover';
    const fallbackUrl = getFallbackIllustration(item);

    const modalContent = document.getElementById('product-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="h-64 ${modalImgBg} border-b border-borderLight relative">
            <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" 
                 onerror="this.onerror=null; this.src='${fallbackUrl}';"
                 class="${modalImgClass}">
            <span class="absolute bottom-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs ${item.badgeStyle}">
                ${escapeHTML(item.badge)}
            </span>
        </div>
        <div class="p-6 space-y-4">
            <div>
                <span class="font-mono text-xs text-inkMuted">MENU NO. ${escapeHTML(item.id)} • SISA STOK: ${item.stock} PORSI</span>
                <h3 class="font-serif text-2xl font-bold text-ink mt-0.5">${escapeHTML(item.name)}</h3>
                <p class="text-xl font-bold text-terracotta mt-1">${formatRupiah(item.price)}</p>
            </div>

            <div class="bg-surfaceSoft rounded-xl p-4 border border-borderLight space-y-2.5 text-xs">
                <div>
                    <span class="font-bold text-ink block">DESKRIPSI MENU:</span>
                    <p class="text-inkMuted mt-0.5 leading-relaxed">${escapeHTML(item.description)}</p>
                </div>
                <div class="pt-2 border-t border-borderLight">
                    <span class="font-bold text-ink block">KOMPOSISI & BAHAN:</span>
                    <p class="text-inkMuted mt-0.5 leading-relaxed">${escapeHTML(item.ingredients)}</p>
                </div>
                <div class="pt-2 border-t border-borderLight">
                    <span class="font-bold text-matcha">PENYAJIAN:</span>
                    <span class="text-inkMuted"> ${escapeHTML(item.prepTime)}</span>
                </div>
            </div>

            <button type="button" onclick="addToCart('${escapeHTML(item.id)}'); closeProductModal();" 
                    class="w-full bg-terracotta hover:bg-terracottaDark text-white font-semibold text-xs py-3.5 rounded-full transition cursor-pointer shadow-sm">
                + MASUKKAN KE KUPON PESANAN
            </button>
        </div>
    `;

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Tambah ke Kupon Pesanan
function addToCart(id) {
    const product = menuItems.find(item => item.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        if (existingItem.qty < product.stock) {
            existingItem.qty += 1;
        } else {
            showToast(`Stok ${product.name} mentok di ${product.stock} porsi!`);
            return;
        }
    } else {
        cart.push({ id: product.id, qty: 1 });
    }

    updateCartUI();
    renderMenu(currentFilter);
    showToast(`+1 ${product.name} masuk kupon!`);
}

// Ubah Jumlah Porsi
function changeQty(id, delta) {
    const product = menuItems.find(item => item.id === id);
    const itemIndex = cart.findIndex(item => item.id === id);
    if (!product || itemIndex === -1) return;

    const newQty = cart[itemIndex].qty + delta;
    if (newQty <= 0) {
        cart.splice(itemIndex, 1);
    } else if (newQty <= product.stock) {
        cart[itemIndex].qty = newQty;
    } else {
        showToast(`Maksimal stok ${product.stock} porsi.`);
    }
    updateCartUI();
    renderMenu(currentFilter);
}

// Reset Kupon
function clearCart() {
    cart = [];
    updateCartUI();
    renderMenu(currentFilter);
    showToast('Kupon pesanan dikosongkan.');
}

// Update Tampilan Kupon Pesanan
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const mobileTotalEl = document.getElementById('mobile-total');
    const mobileCountEl = document.getElementById('mobile-count');

    if (!cartContainer || !totalEl) return;

    const { verifiedItems, total, totalQty } = getVerifiedCartSummary();

    if (verifiedItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-7 px-4 bg-surfaceSoft rounded-xl border border-dashed border-borderLight text-xs text-inkMuted leading-relaxed">
                Kupon pesanan masih kosong.<br>Klik tombol <strong class="text-ink">"+ Tambah"</strong> di daftar menu sebelah ya!
            </div>
        `;
        totalEl.textContent = 'Rp 0';
        if (mobileTotalEl) mobileTotalEl.textContent = 'Rp 0';
        if (mobileCountEl) mobileCountEl.textContent = '0';
        return;
    }

    cartContainer.innerHTML = verifiedItems.map(item => `
        <div class="flex items-center justify-between gap-2 bg-surfaceSoft px-3.5 py-2.5 rounded-xl border border-borderLight animate-pop">
            <div class="min-w-0 flex-1">
                <p class="font-semibold text-xs text-ink truncate">${escapeHTML(item.name)}</p>
                <p class="text-[11px] text-inkMuted">${formatRupiah(item.price)} × ${item.qty} = <strong class="text-terracotta">${formatRupiah(item.subtotal)}</strong></p>
            </div>
            <div class="flex items-center gap-1 text-xs shrink-0">
                <button type="button" onclick="changeQty('${escapeHTML(item.id)}', -1)" class="w-6 h-6 rounded-full bg-white border border-borderLight text-ink font-bold hover:bg-terracotta hover:text-white transition cursor-pointer">-</button>
                <span class="w-5 text-center font-bold text-ink">${item.qty}</span>
                <button type="button" onclick="changeQty('${escapeHTML(item.id)}', 1)" class="w-6 h-6 rounded-full bg-ink text-white font-bold hover:bg-terracotta transition cursor-pointer">+</button>
            </div>
        </div>
    `).join('');

    totalEl.textContent = formatRupiah(total);
    if (mobileTotalEl) mobileTotalEl.textContent = formatRupiah(total);
    if (mobileCountEl) mobileCountEl.textContent = String(totalQty);
}

// Kirim Pesanan Otomatis via WhatsApp + Catat ke Panel Admin
function sendWhatsAppOrder(e) {
    e.preventDefault();
    const { verifiedItems, total } = getVerifiedCartSummary();
    if (verifiedItems.length === 0) {
        showToast('Pilih minimal 1 menu dulu sebelum kirim pesanan!');
        return;
    }

    const ticketEl = document.getElementById('ticket-number');
    const nameEl = document.getElementById('buyer-name');
    const classEl = document.getElementById('buyer-class');
    const pickupEl = document.getElementById('pickup-time');
    const noteEl = document.getElementById('buyer-note');

    const ticketId = sanitizeTextInput(ticketEl ? ticketEl.textContent : '#XII2-048', 20);
    const name = sanitizeTextInput(nameEl ? nameEl.value : '', 45);
    const buyerClass = sanitizeTextInput(classEl ? classEl.value : '', 30);
    const rawPickup = pickupEl ? pickupEl.value : '';
    const pickup = ALLOWED_PICKUP_TIMES.includes(rawPickup) ? rawPickup : ALLOWED_PICKUP_TIMES[0];
    const note = sanitizeTextInput(noteEl ? noteEl.value : '', 100);

    if (!name || !buyerClass) {
        showToast('Nama dan Kelas/Status wajib diisi dengan benar!');
        return;
    }

    const orderLines = verifiedItems.map((item, idx) => {
        return `${idx + 1}. ${item.name} (${item.qty}x) — ${formatRupiah(item.subtotal)}`;
    }).join('\n');

    recordOrderToAdmin({
        ticketId,
        buyerName: name,
        buyerClass,
        pickupTime: pickup,
        note,
        items: verifiedItems.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
        total
    });

    const message = `Halo Kasir Dapur XII-2 (Booth #04)! Saya mau Pre-Order (${ticketId}):\n\n*Nama:* ${name}\n*Kelas/Status:* ${buyerClass}\n*Jam Ambil:* ${pickup}\n\n*Daftar Pesanan:*\n${orderLines}\n\n*Total Bayar:* ${formatRupiah(total)}\n${note ? `*Catatan:* ${note}\n` : ''}Terima kasih!`;

    if (ticketEl) ticketEl.textContent = generateNewTicketNumber();

    const waNumber = "6281234567890";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
}

// Preview Struk Digital di Layar
function generateReceiptPreview() {
    const { verifiedItems, total } = getVerifiedCartSummary();
    if (verifiedItems.length === 0) {
        showToast('Kupon masih kosong, tambah menu dulu ya.');
        return;
    }

    const ticketEl = document.getElementById('ticket-number');
    const nameEl = document.getElementById('buyer-name');
    const classEl = document.getElementById('buyer-class');
    const pickupEl = document.getElementById('pickup-time');
    const noteEl = document.getElementById('buyer-note');

    const ticketId = sanitizeTextInput(ticketEl ? ticketEl.textContent : '#XII2-048', 20);
    const name = sanitizeTextInput(nameEl ? nameEl.value : '', 45) || 'Pembeli Booth';
    const buyerClass = sanitizeTextInput(classEl ? classEl.value : '', 30) || 'Umum';
    const rawPickup = pickupEl ? pickupEl.value : '';
    const pickup = ALLOWED_PICKUP_TIMES.includes(rawPickup) ? rawPickup : ALLOWED_PICKUP_TIMES[0];
    const note = sanitizeTextInput(noteEl ? noteEl.value : '', 100);

    const itemsHtml = verifiedItems.map(item => {
        return `<div class="flex justify-between text-ink"><span>${item.qty}x ${escapeHTML(item.name)}</span><span class="font-bold">${formatRupiah(item.subtotal)}</span></div>`;
    }).join('');

    recordOrderToAdmin({
        ticketId,
        buyerName: name,
        buyerClass,
        pickupTime: pickup,
        note,
        items: verifiedItems.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
        total
    });

    const modalBody = document.getElementById('receipt-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div class="bg-surfaceSoft p-3.5 rounded-xl border border-borderLight space-y-1.5 text-ink">
            <div class="flex justify-between"><span class="text-inkMuted">NO. KUPON:</span><strong class="font-mono">${escapeHTML(ticketId)}</strong></div>
            <div class="flex justify-between"><span class="text-inkMuted">PEMBELI:</span><strong>${escapeHTML(name)} (${escapeHTML(buyerClass)})</strong></div>
            <div class="flex justify-between"><span class="text-inkMuted">JAM AMBIL:</span><strong>${escapeHTML(pickup)}</strong></div>
            ${note ? `<div class="pt-1.5 border-t border-borderLight text-inkMuted break-words"><strong class="text-ink">CATATAN:</strong> ${escapeHTML(note)}</div>` : ''}
        </div>
        <div class="py-2 space-y-1.5">
            ${itemsHtml}
        </div>
        <div class="pt-2.5 border-t border-borderLight flex justify-between font-bold text-sm text-terracotta">
            <span>TOTAL BAYAR</span>
            <span>${formatRupiah(total)}</span>
        </div>
    `;

    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Notifikasi Toast Singkat
function showToast(msg) {
    const box = document.getElementById('toast-box');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'bg-ink text-white text-xs font-medium px-4 py-3 rounded-full shadow-lg border-l-4 border-terracotta animate-pop';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 2600);
}

// ============================================================
// PANEL ADMIN TERPROTEKSI (SHA-256 PIN, Rate Limit & Dynamic DOM)
// ============================================================
const ADMIN_STORAGE_KEY = 'dapur_xii_2_orders_v2';
const ADMIN_PIN_SHA256 = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

let isAdminAuthenticated = false;
let unreadOrdersCount = 0;
let failedPinAttempts = 0;
let pinLockoutUntil = 0;

async function computeSHA256(text) {
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    return '';
}

function getAdminOrders() {
    try {
        const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(o => o && typeof o === 'object' && Array.isArray(o.items)).map(o => ({
            ticketId: sanitizeTextInput(String(o.ticketId || '#XII2-000'), 20),
            buyerName: sanitizeTextInput(String(o.buyerName || 'Pembeli'), 45),
            buyerClass: sanitizeTextInput(String(o.buyerClass || '-'), 30),
            pickupTime: sanitizeTextInput(String(o.pickupTime || '-'), 35),
            note: sanitizeTextInput(String(o.note || ''), 100),
            timestamp: sanitizeTextInput(String(o.timestamp || '--:--'), 15),
            status: o.status === 'Selesai' ? 'Selesai' : 'Menunggu',
            total: Math.max(0, Number(o.total) || 0),
            items: o.items.map(it => ({
                id: sanitizeTextInput(String(it.id || ''), 10),
                name: sanitizeTextInput(String(it.name || 'Menu'), 60),
                price: Math.max(0, Number(it.price) || 0),
                qty: Math.max(1, parseInt(it.qty, 10) || 1)
            }))
        }));
    } catch (err) {
        return [];
    }
}

function saveAdminOrders(orders) {
    try {
        const trimmed = Array.isArray(orders) ? orders.slice(0, 200) : [];
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
        console.warn('Gagal menyimpan log admin:', err);
    }
}

function recordOrderToAdmin(orderData) {
    const orders = getAdminOrders();
    if (orders.some(o => o.ticketId === orderData.ticketId)) {
        return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
        ticketId: sanitizeTextInput(orderData.ticketId, 20),
        buyerName: sanitizeTextInput(orderData.buyerName, 45),
        buyerClass: sanitizeTextInput(orderData.buyerClass, 30),
        pickupTime: sanitizeTextInput(orderData.pickupTime, 35),
        note: sanitizeTextInput(orderData.note, 100),
        items: orderData.items.map(i => ({
            id: sanitizeTextInput(i.id, 10),
            name: sanitizeTextInput(i.name, 60),
            price: Math.max(0, Number(i.price) || 0),
            qty: Math.max(1, parseInt(i.qty, 10) || 1)
        })),
        total: Math.max(0, Number(orderData.total) || 0),
        timestamp: timeStr,
        status: 'Menunggu'
    };

    orders.unshift(newRecord);
    saveAdminOrders(orders);

    unreadOrdersCount += 1;
    updateAdminBadge();
    showNewOrderNotification(newRecord);

    if (isAdminAuthenticated) {
        renderAdminDashboard();
    }
}

function updateAdminBadge() {
    const badge = document.getElementById('admin-notif-badge');
    if (!badge) return;
    if (unreadOrdersCount > 0) {
        badge.textContent = String(unreadOrdersCount);
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function showNewOrderNotification(order) {
    const box = document.getElementById('toast-box');
    if (!box) return;
    const summaryText = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

    const notif = document.createElement('div');
    notif.className = 'pointer-events-auto bg-white text-ink rounded-2xl shadow-2xl border-2 border-terracotta p-4 max-w-xs sm:max-w-sm animate-slide-in';
    notif.innerHTML = `
        <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-full bg-terracotta text-white flex items-center justify-center text-xs shrink-0 animate-bounce">
                    <i class="fa-solid fa-bell"></i>
                </span>
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-terracotta block">PESANAN BARU MASUK!</span>
                    <p class="font-bold text-xs text-ink">${escapeHTML(order.buyerName)} (${escapeHTML(order.buyerClass)})</p>
                </div>
            </div>
            <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-inkMuted hover:text-ink text-xs font-bold cursor-pointer">✕</button>
        </div>
        <p class="text-[11px] text-inkMuted mt-2 line-clamp-2">${escapeHTML(summaryText)}</p>
        <div class="mt-2.5 pt-2 border-t border-borderLight flex items-center justify-between text-[11px]">
            <span class="font-bold text-tealDeep">${formatRupiah(order.total)} • ${escapeHTML(order.pickupTime)}</span>
            <button type="button" onclick="openAdminModal(); this.closest('.pointer-events-auto').remove();" class="font-bold text-terracotta hover:underline cursor-pointer">
                Cek Admin →
            </button>
        </div>
    `;
    box.appendChild(notif);
    setTimeout(() => {
        if (notif.parentElement) notif.remove();
    }, 6000);
}

function renderAdminLoginGate() {
    const viewport = document.getElementById('admin-dynamic-viewport');
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (!viewport) return;
    if (logoutBtn) logoutBtn.classList.add('hidden');

    viewport.innerHTML = `
        <div class="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-tealSoft text-tealDeep mx-auto flex items-center justify-center text-2xl">
                <i class="fa-solid fa-lock"></i>
            </div>
            <div>
                <h4 class="font-serif text-2xl font-bold text-ink">Akses Khusus Panitia Kelas</h4>
                <p class="text-xs text-inkMuted mt-1 leading-relaxed">
                    Masukkan PIN Kasir Dapur XII-2 untuk membuka dashboard penjualan, notifikasi antrean & kalkulator kasir.
                </p>
            </div>
            <form onsubmit="verifyAdminPin(event)" class="space-y-3 pt-2" autocomplete="off">
                <input type="password" id="admin-pin-input" inputmode="numeric" maxlength="8" placeholder="Masukkan PIN Kasir" required
                       class="w-full text-center font-mono tracking-widest text-lg bg-white border border-borderLight rounded-xl px-4 py-3 focus:outline-none focus:border-tealDeep">
                <p id="admin-lockout-msg" class="text-[11px] font-semibold text-terracotta hidden"></p>
                <button type="submit" class="w-full bg-terracotta hover:bg-terracottaDark text-white font-semibold text-xs py-3.5 rounded-full transition cursor-pointer">
                    VERIFIKASI & BUKA DASHBOARD
                </button>
            </form>
        </div>
    `;
    setTimeout(() => {
        const input = document.getElementById('admin-pin-input');
        if (input) input.focus();
    }, 80);
}

function mountAdminDashboardShell() {
    const viewport = document.getElementById('admin-dynamic-viewport');
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (!viewport) return;
    if (logoutBtn) logoutBtn.classList.remove('hidden');

    viewport.innerHTML = `
        <div class="p-5 sm:p-6 space-y-6">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div class="bg-white p-4 rounded-2xl border border-borderLight shadow-2xs">
                    <span class="text-[11px] font-semibold text-inkMuted block">TOTAL OMZET MASUK</span>
                    <span id="stat-revenue" class="font-serif text-2xl font-bold text-tealDeep mt-1 block">Rp 0</span>
                    <span class="text-[10px] text-matcha font-medium mt-0.5 block">Real-time dari pesanan</span>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-borderLight shadow-2xs">
                    <span class="text-[11px] font-semibold text-inkMuted block">TOTAL TRANSAKSI</span>
                    <span id="stat-orders" class="font-serif text-2xl font-bold text-ink mt-1 block">0 Order</span>
                    <span id="stat-pending" class="text-[10px] text-terracotta font-semibold mt-0.5 block">0 menunggu diambil</span>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-borderLight shadow-2xs">
                    <span class="text-[11px] font-semibold text-inkMuted block">TOTAL PORSI TERJUAL</span>
                    <span id="stat-portions" class="font-serif text-2xl font-bold text-ink mt-1 block">0 Porsi</span>
                    <span class="text-[10px] text-inkMuted mt-0.5 block">Gabungan makanan & minuman</span>
                </div>
                <div class="bg-surfaceWarm p-4 rounded-2xl border border-terracotta/30 shadow-2xs">
                    <span class="text-[11px] font-bold text-terracotta uppercase block"><i class="fa-solid fa-fire mr-1"></i>PALING LAKU</span>
                    <span id="stat-bestseller" class="font-serif text-lg font-bold text-ink mt-1 block line-clamp-1">Belum ada data</span>
                    <span id="stat-bestseller-qty" class="text-[11px] text-inkMuted font-medium mt-0.5 block">0 porsi terjual</span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-4 bg-white p-5 rounded-2xl border border-borderLight shadow-2xs space-y-4">
                    <div class="flex items-center justify-between border-b border-borderLight pb-3">
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-terracotta block">ALAT BANTU KASIR</span>
                            <h4 class="font-serif text-lg font-bold text-ink">Kalkulator Digital</h4>
                        </div>
                        <span class="w-8 h-8 rounded-full bg-tealSoft text-tealDeep flex items-center justify-center text-xs">
                            <i class="fa-solid fa-calculator"></i>
                        </span>
                    </div>

                    <div class="bg-ink text-white rounded-xl p-3.5 text-right font-mono space-y-1 shadow-inner">
                        <div id="calc-history" class="text-[11px] text-white/60 min-h-[16px] truncate">0</div>
                        <div id="calc-display" class="text-2xl sm:text-3xl font-bold tracking-tight overflow-x-auto">0</div>
                    </div>

                    <div class="space-y-1.5">
                        <span class="text-[10px] font-semibold text-inkMuted uppercase tracking-wider block">Uang Tunai Cepat (Klik untuk input):</span>
                        <div class="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
                            <button type="button" onclick="calcAppendAmount(10000)" class="py-1.5 rounded-lg bg-surfaceSoft hover:bg-tealSoft text-ink font-bold border border-borderLight transition cursor-pointer">+10rb</button>
                            <button type="button" onclick="calcAppendAmount(20000)" class="py-1.5 rounded-lg bg-surfaceSoft hover:bg-tealSoft text-ink font-bold border border-borderLight transition cursor-pointer">+20rb</button>
                            <button type="button" onclick="calcAppendAmount(50000)" class="py-1.5 rounded-lg bg-surfaceSoft hover:bg-tealSoft text-ink font-bold border border-borderLight transition cursor-pointer">+50rb</button>
                            <button type="button" onclick="calcAppendAmount(100000)" class="py-1.5 rounded-lg bg-surfaceSoft hover:bg-tealSoft text-ink font-bold border border-borderLight transition cursor-pointer">+100rb</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-2 font-mono text-sm font-bold">
                        <button type="button" onclick="calcClear()" class="calc-btn bg-amber-100 hover:bg-terracotta text-terracotta hover:text-white py-3 rounded-xl transition cursor-pointer">C</button>
                        <button type="button" onclick="calcBackspace()" class="calc-btn bg-surfaceSoft hover:bg-surfaceWarm text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer"><i class="fa-solid fa-delete-left"></i></button>
                        <button type="button" onclick="calcOperator('/')" class="calc-btn bg-tealSoft hover:bg-tealDeep text-tealDeep hover:text-white py-3 rounded-xl transition cursor-pointer">÷</button>
                        <button type="button" onclick="calcOperator('*')" class="calc-btn bg-tealSoft hover:bg-tealDeep text-tealDeep hover:text-white py-3 rounded-xl transition cursor-pointer">×</button>

                        <button type="button" onclick="calcInput('7')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">7</button>
                        <button type="button" onclick="calcInput('8')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">8</button>
                        <button type="button" onclick="calcInput('9')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">9</button>
                        <button type="button" onclick="calcOperator('-')" class="calc-btn bg-tealSoft hover:bg-tealDeep text-tealDeep hover:text-white py-3 rounded-xl transition cursor-pointer">−</button>

                        <button type="button" onclick="calcInput('4')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">4</button>
                        <button type="button" onclick="calcInput('5')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">5</button>
                        <button type="button" onclick="calcInput('6')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">6</button>
                        <button type="button" onclick="calcOperator('+')" class="calc-btn bg-tealSoft hover:bg-tealDeep text-tealDeep hover:text-white py-3 rounded-xl transition cursor-pointer">+</button>

                        <button type="button" onclick="calcInput('1')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">1</button>
                        <button type="button" onclick="calcInput('2')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">2</button>
                        <button type="button" onclick="calcInput('3')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">3</button>
                        <button type="button" onclick="calcEquals()" class="row-span-2 calc-btn bg-terracotta hover:bg-terracottaDark text-white py-3 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center text-lg">=</button>

                        <button type="button" onclick="calcInput('0')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">0</button>
                        <button type="button" onclick="calcInput('000')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">000</button>
                        <button type="button" onclick="calcInput('.')" class="calc-btn bg-white hover:bg-surfaceSoft text-ink py-3 rounded-xl border border-borderLight transition cursor-pointer">.</button>
                    </div>

                    <div class="bg-surfaceSoft p-3 rounded-xl border border-borderLight space-y-2">
                        <span class="text-[11px] font-bold text-ink block"><i class="fa-solid fa-coins text-terracotta mr-1"></i>Hitung Kembalian Tunai</span>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label class="text-[10px] text-inkMuted block mb-0.5">Total Belanja (Rp)</label>
                                <input type="number" min="0" max="100000000" id="change-bill-input" oninput="calculateCashChange()" placeholder="25000" class="w-full bg-white border border-borderLight rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-tealDeep">
                            </div>
                            <div>
                                <label class="text-[10px] text-inkMuted block mb-0.5">Uang Pembeli (Rp)</label>
                                <input type="number" min="0" max="100000000" id="change-paid-input" oninput="calculateCashChange()" placeholder="50000" class="w-full bg-white border border-borderLight rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-tealDeep">
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-borderLight/80 text-xs">
                            <span class="text-inkMuted font-medium">Kembalian:</span>
                            <span id="change-result-text" class="font-mono font-bold text-tealDeep">Rp 0</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 bg-white p-5 rounded-2xl border border-borderLight shadow-2xs space-y-4">
                    <div class="flex items-center justify-between border-b border-borderLight pb-3">
                        <div>
                            <h4 class="font-serif text-lg font-bold text-ink">Analisis Produk Terlaris</h4>
                            <p class="text-[11px] text-inkMuted">Urutan menu berdasarkan porsi terjual</p>
                        </div>
                        <span class="text-xs font-bold bg-tealSoft text-tealDeep px-2.5 py-1 rounded-full">TOP 7</span>
                    </div>
                    <div id="bestseller-ranking-list" class="space-y-3"></div>
                </div>

                <div class="lg:col-span-4 bg-white p-5 rounded-2xl border border-borderLight shadow-2xs flex flex-col justify-between space-y-4">
                    <div>
                        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-borderLight pb-3 mb-4">
                            <div>
                                <h4 class="font-serif text-lg font-bold text-ink">Notifikasi & Antrean</h4>
                                <p class="text-[11px] text-inkMuted">Pesanan masuk otomatis tercatat di sini</p>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button type="button" onclick="simulateIncomingOrder()" class="text-[10px] font-semibold bg-tealSoft hover:bg-tealDeep text-tealDeep hover:text-white px-2.5 py-1.5 rounded-full transition cursor-pointer">
                                    + Simulasi
                                </button>
                                <button type="button" onclick="clearAdminOrders()" class="text-[10px] font-semibold text-inkMuted hover:text-terracotta px-2 py-1.5 rounded-full border border-borderLight transition cursor-pointer">
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div id="admin-orders-list" class="space-y-3 max-h-[430px] overflow-y-auto pr-1"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (isAdminAuthenticated) {
        unreadOrdersCount = 0;
        updateAdminBadge();
        mountAdminDashboardShell();
        renderAdminDashboard();
    } else {
        renderAdminLoginGate();
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function logoutAdmin() {
    isAdminAuthenticated = false;
    calcClear();
    renderAdminLoginGate();
    showToast('Panel Admin dikunci.');
}

async function verifyAdminPin(e) {
    e.preventDefault();
    const now = Date.now();
    const lockMsgEl = document.getElementById('admin-lockout-msg');

    if (now < pinLockoutUntil) {
        const sisaDetik = Math.ceil((pinLockoutUntil - now) / 1000);
        if (lockMsgEl) {
            lockMsgEl.textContent = `Terlalu banyak percobaan gagal. Coba lagi dalam ${sisaDetik} detik.`;
            lockMsgEl.classList.remove('hidden');
        }
        return;
    }

    const inputEl = document.getElementById('admin-pin-input');
    const rawPin = inputEl ? inputEl.value.trim() : '';
    const hashedInput = await computeSHA256(rawPin);

    if (hashedInput === ADMIN_PIN_SHA256) {
        failedPinAttempts = 0;
        pinLockoutUntil = 0;
        isAdminAuthenticated = true;
        unreadOrdersCount = 0;
        updateAdminBadge();
        mountAdminDashboardShell();
        renderAdminDashboard();
        showToast('Berhasil masuk ke Panel Admin Dapur XII-2');
    } else {
        failedPinAttempts += 1;
        if (inputEl) inputEl.value = '';

        if (failedPinAttempts >= 5) {
            pinLockoutUntil = Date.now() + 30000;
            failedPinAttempts = 0;
            if (lockMsgEl) {
                lockMsgEl.textContent = 'Akses dikunci sementara selama 30 detik karena 5x salah PIN.';
                lockMsgEl.classList.remove('hidden');
            }
        } else {
            const sisa = 5 - failedPinAttempts;
            if (lockMsgEl) {
                lockMsgEl.textContent = `PIN salah! Sisa percobaan: ${sisa}x.`;
                lockMsgEl.classList.remove('hidden');
            }
        }
    }
}

function renderAdminDashboard() {
    if (!isAdminAuthenticated) return;
    const orders = getAdminOrders();

    let totalRevenue = 0;
    let totalPortions = 0;
    let pendingOrders = 0;
    const productSalesMap = {};

    menuItems.forEach(m => {
        productSalesMap[m.id] = {
            id: m.id,
            name: m.name,
            category: m.category,
            price: m.price,
            soldQty: 0,
            revenue: 0
        };
    });

    orders.forEach(order => {
        totalRevenue += order.total;
        if (order.status === 'Menunggu') pendingOrders += 1;

        order.items.forEach(item => {
            totalPortions += item.qty;
            if (!productSalesMap[item.id]) {
                productSalesMap[item.id] = {
                    id: item.id,
                    name: item.name,
                    category: 'menu',
                    price: item.price,
                    soldQty: 0,
                    revenue: 0
                };
            }
            productSalesMap[item.id].soldQty += item.qty;
            productSalesMap[item.id].revenue += item.price * item.qty;
        });
    });

    const rankedProducts = Object.values(productSalesMap).sort((a, b) => b.soldQty - a.soldQty);
    const topProduct = rankedProducts[0];

    const revEl = document.getElementById('stat-revenue');
    const ordEl = document.getElementById('stat-orders');
    const pendEl = document.getElementById('stat-pending');
    const portEl = document.getElementById('stat-portions');
    const bestEl = document.getElementById('stat-bestseller');
    const bestQtyEl = document.getElementById('stat-bestseller-qty');

    if (revEl) revEl.textContent = formatRupiah(totalRevenue);
    if (ordEl) ordEl.textContent = `${orders.length} Order`;
    if (pendEl) pendEl.textContent = `${pendingOrders} menunggu diambil`;
    if (portEl) portEl.textContent = `${totalPortions} Porsi`;

    if (topProduct && topProduct.soldQty > 0) {
        if (bestEl) bestEl.textContent = topProduct.name;
        if (bestQtyEl) bestQtyEl.textContent = `${topProduct.soldQty} porsi • ${formatRupiah(topProduct.revenue)}`;
    } else {
        if (bestEl) bestEl.textContent = 'Belum ada penjualan';
        if (bestQtyEl) bestQtyEl.textContent = '0 porsi terjual';
    }

    const rankingContainer = document.getElementById('bestseller-ranking-list');
    if (rankingContainer) {
        const maxSold = topProduct && topProduct.soldQty > 0 ? topProduct.soldQty : 1;
        rankingContainer.innerHTML = rankedProducts.map((prod, idx) => {
            const pct = Math.min(100, Math.max(0, Math.round((prod.soldQty / maxSold) * 100)));
            const isFirst = idx === 0 && prod.soldQty > 0;
            const barColor = isFirst ? 'bg-terracotta' : 'bg-tealDeep';
            const rankBadge = isFirst 
                ? '<span class="px-2 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-bold">#1 TERLARIS</span>' 
                : `<span class="font-mono text-xs font-bold text-inkMuted">#${idx + 1}</span>`;

            return `
                <div class="space-y-1">
                    <div class="flex items-center justify-between gap-2 text-xs">
                        <div class="flex items-center gap-1.5 min-w-0">
                            ${rankBadge}
                            <span class="font-semibold text-ink truncate">${escapeHTML(prod.name)}</span>
                        </div>
                        <span class="font-mono font-bold text-ink shrink-0">${prod.soldQty} porsi</span>
                    </div>
                    <div class="w-full h-2 bg-surfaceSoft rounded-full overflow-hidden">
                        <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-inkMuted">
                        <span class="uppercase">${escapeHTML(prod.category)}</span>
                        <span>Omzet: ${formatRupiah(prod.revenue)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    const ordersContainer = document.getElementById('admin-orders-list');
    if (ordersContainer) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="text-center py-10 px-4 bg-surfaceSoft rounded-xl border border-dashed border-borderLight text-xs text-inkMuted space-y-2">
                    <p>Belum ada pesanan masuk yang tercatat.</p>
                    <p>Klik <strong>"+ Simulasi"</strong> di kanan atas untuk mengetes notifikasi & analisis terlaris!</p>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = orders.map((order, idx) => {
            const isDone = order.status === 'Selesai';
            const statusBadge = isDone 
                ? '<span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-matcha text-[10px] font-bold">SELESAI DIAMBIL</span>'
                : '<span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-terracotta text-[10px] font-bold">MENUNGGU</span>';

            const itemsList = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');

            return `
                <div class="p-3.5 rounded-xl border ${isDone ? 'bg-surfaceSoft/60 border-borderLight' : 'bg-white border-terracotta/40 shadow-2xs'} space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-tealDeep">${escapeHTML(order.ticketId)}</span>
                            <span class="font-bold text-xs text-ink">${escapeHTML(order.buyerName)} (${escapeHTML(order.buyerClass)})</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-inkMuted">${escapeHTML(order.timestamp)} WIB</span>
                            ${statusBadge}
                        </div>
                    </div>
                    <p class="text-xs text-ink font-medium">${escapeHTML(itemsList)}</p>
                    ${order.note ? `<p class="text-[11px] text-inkMuted italic break-words">Catatan: "${escapeHTML(order.note)}"</p>` : ''}
                    <div class="pt-2 border-t border-borderLight flex items-center justify-between gap-2 text-xs">
                        <span class="font-bold text-terracotta">${formatRupiah(order.total)} • <span class="text-inkMuted font-normal">${escapeHTML(order.pickupTime)}</span></span>
                        <button type="button" onclick="toggleOrderStatus(${idx})" class="text-[11px] font-semibold px-3 py-1 rounded-full ${isDone ? 'bg-white border border-borderLight text-inkMuted hover:text-ink' : 'bg-tealDeep text-white hover:bg-matcha'} transition cursor-pointer">
                            ${isDone ? 'Tandai Belum Diambil' : '✓ Tandai Selesai'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function toggleOrderStatus(index) {
    if (!isAdminAuthenticated) return;
    const orders = getAdminOrders();
    if (!orders[index]) return;
    orders[index].status = orders[index].status === 'Selesai' ? 'Menunggu' : 'Selesai';
    saveAdminOrders(orders);
    renderAdminDashboard();
}

function clearAdminOrders() {
    if (!isAdminAuthenticated) return;
    saveAdminOrders([]);
    unreadOrdersCount = 0;
    updateAdminBadge();
    renderAdminDashboard();
    showToast('Riwayat pesanan admin dibersihkan.');
}

function simulateIncomingOrder() {
    if (!isAdminAuthenticated) return;
    const sampleBuyers = [
        { name: 'Rizky Pratama', cls: 'XI TKJ 1', pickup: 'Istirahat 1 (09.30)', note: 'Es batu sedang' },
        { name: 'Bu Siti Aminah', cls: 'Guru', pickup: 'Istirahat 2 (12.00)', note: 'Bumbu kacang dipisah' },
        { name: 'Nabila Putri', cls: 'XII AKL 2', pickup: 'Ambil di Booth/Stan', note: '' },
        { name: 'Dimas Saputra', cls: 'X TKR 3', pickup: 'Pulang Sekolah (14.30)', note: 'Pedas dikit' }
    ];
    const buyer = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];

    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.floor(Math.random() * 2) + 1).map(m => ({
        id: m.id,
        name: m.name,
        price: m.price,
        qty: Math.floor(Math.random() * 2) + 1
    }));

    const total = picked.reduce((sum, item) => sum + item.price * item.qty, 0);

    recordOrderToAdmin({
        ticketId: generateNewTicketNumber(),
        buyerName: buyer.name,
        buyerClass: buyer.cls,
        pickupTime: buyer.pickup,
        note: buyer.note,
        items: picked,
        total
    });
}

// ============================================================
// KALKULATOR DIGITAL KHUSUS ADMIN
// ============================================================
let calcExpression = '';
let calcJustEvaluated = false;

function updateCalcScreen() {
    const displayEl = document.getElementById('calc-display');
    if (!displayEl) return;
    displayEl.textContent = calcExpression === '' ? '0' : calcExpression;
}

function calcInput(val) {
    if (!isAdminAuthenticated) return;
    if (calcExpression.length >= 24) return;

    if (calcJustEvaluated) {
        calcExpression = '';
        calcJustEvaluated = false;
    }

    if (calcExpression === '0' && val !== '.') {
        calcExpression = val;
    } else {
        calcExpression += val;
    }
    updateCalcScreen();
}

function calcOperator(op) {
    if (!isAdminAuthenticated) return;
    if (!['+', '-', '*', '/'].includes(op)) return;
    calcJustEvaluated = false;

    if (calcExpression === '') {
        if (op === '-') {
            calcExpression = '-';
            updateCalcScreen();
        }
        return;
    }

    const lastChar = calcExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        calcExpression = calcExpression.slice(0, -1) + op;
    } else {
        calcExpression += op;
    }
    updateCalcScreen();
}

function calcClear() {
    calcExpression = '';
    calcJustEvaluated = false;
    const historyEl = document.getElementById('calc-history');
    if (historyEl) historyEl.textContent = '0';
    updateCalcScreen();
}

function calcBackspace() {
    if (!isAdminAuthenticated) return;
    if (calcJustEvaluated) {
        calcClear();
        return;
    }
    calcExpression = calcExpression.slice(0, -1);
    updateCalcScreen();
}

function calcAppendAmount(amount) {
    if (!isAdminAuthenticated) return;
    const safeAmt = Math.max(0, parseInt(amount, 10) || 0);
    if (calcJustEvaluated) {
        calcExpression = String(safeAmt);
        calcJustEvaluated = false;
    } else if (calcExpression === '' || calcExpression === '0') {
        calcExpression = String(safeAmt);
    } else {
        const lastChar = calcExpression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            calcExpression += String(safeAmt);
        } else {
            calcExpression += '+' + String(safeAmt);
        }
    }
    updateCalcScreen();
}

function safeEvaluateMath(expr) {
    const normalized = expr.replace(/^\+/, '');
    const tokens = normalized.match(/(^-?\d+\.?\d*|(?<=[+\-*/])-\d+\.?\d*|\d+\.?\d*|\.\d+|[+\-*/])/g);
    if (!tokens || tokens.length === 0) return NaN;

    const stack = [];
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token === '*' || token === '/') {
            const prev = parseFloat(stack.pop());
            const next = parseFloat(tokens[++i]);
            if (isNaN(prev) || isNaN(next) || (token === '/' && next === 0)) {
                return NaN;
            }
            stack.push(token === '*' ? prev * next : prev / next);
        } else {
            stack.push(token);
        }
        i++;
    }

    let result = parseFloat(stack[0]);
    if (isNaN(result)) return NaN;

    for (let j = 1; j < stack.length; j += 2) {
        const op = stack[j];
        const val = parseFloat(stack[j + 1]);
        if (isNaN(val)) return NaN;
        if (op === '+') result += val;
        else if (op === '-') result -= val;
        else return NaN;
    }

    return result;
}

function calcEquals() {
    if (!isAdminAuthenticated || calcExpression === '') return;
    const historyEl = document.getElementById('calc-history');

    const sanitized = calcExpression.replace(/[^0-9+\-*/.]/g, '');
    const cleanExpr = sanitized.replace(/[+\-*/.]+$/, '');
    if (!cleanExpr) return;

    const result = safeEvaluateMath(cleanExpr);
    if (!isFinite(result) || isNaN(result)) {
        if (historyEl) historyEl.textContent = 'Format hitung tidak valid';
        calcExpression = '';
        updateCalcScreen();
        return;
    }

    const formattedResult = Number.isInteger(result)
        ? String(result)
        : String(parseFloat(result.toFixed(4)));

    if (historyEl) {
        historyEl.textContent = `${cleanExpr} = ${Number(formattedResult).toLocaleString('id-ID')}`;
    }
    calcExpression = formattedResult;
    calcJustEvaluated = true;
    updateCalcScreen();
}

function calculateCashChange() {
    if (!isAdminAuthenticated) return;
    const billInput = document.getElementById('change-bill-input');
    const paidInput = document.getElementById('change-paid-input');
    const resultEl = document.getElementById('change-result-text');
    if (!billInput || !paidInput || !resultEl) return;

    const bill = Math.max(0, parseFloat(billInput.value) || 0);
    const paid = Math.max(0, parseFloat(paidInput.value) || 0);

    if (paid === 0 && bill === 0) {
        resultEl.textContent = 'Rp 0';
        resultEl.className = 'font-mono font-bold text-tealDeep';
        return;
    }

    const diff = paid - bill;
    if (diff < 0) {
        resultEl.textContent = `Kurang ${formatRupiah(Math.abs(diff))}`;
        resultEl.className = 'font-mono font-bold text-terracotta';
    } else {
        resultEl.textContent = formatRupiah(diff);
        resultEl.className = 'font-mono font-bold text-matcha';
    }
}

// Inisialisasi Awal Saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
});