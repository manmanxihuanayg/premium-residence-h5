/**
 * Premium Residence - 主应用程序
 * Main Application
 * แอปพลิเคชันหลัก
 */

// 全局状态 / Global State / สถานะทั่วไป
let currentLang = DEFAULT_LANG;
let currentFilter = 'all';
let apartmentsData = [];
let translationsData = {};

// 初始化应用 / Initialize Application / เริ่มต้นแอปพลิเคชัน
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEventListeners();
});

// 加载数据 / Load Data / โหลดข้อมูล
function loadData() {
    Promise.all([
        fetch('data/apartments.json').then(res => res.json()),
        fetch('data/translations.json').then(res => res.json())
    ])
    .then(([apartments, translations]) => {
        apartmentsData = apartments.apartments;
        translationsData = translations.translations;
        renderApartments();
        updateLanguage();
    })
    .catch(error => {
        console.error('Error loading data:', error);
        showError('无法加载数据，请稍后重试 / Failed to load data, please try again later / ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้ง');
    });
}

// 初始化事件监听器 / Initialize Event Listeners / เริ่มต้นตัวฟังเหตุการณ์
function initEventListeners() {
    // 语言切换 / Language Switcher / ตัวสลับภาษา
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;
            if (AVAILABLE_LANGUAGES.includes(lang)) {
                switchLanguage(lang);
            }
        });
    });

    // 筛选器 / Filter / ตัวกรอง
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            applyFilter(filter);
        });
    });

    // 关闭模态框 / Close Modal / ปิดโมดัล
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') {
            closeModal();
        }
    });

    // 键盘事件 / Keyboard Events / เหตุการณ์แป้นพิมพ์
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 切换语言 / Switch Language / เปลี่ยนภาษา
function switchLanguage(lang) {
    currentLang = lang;

    // 更新按钮状态 / Update button states / อัปเดตสถานะปุ่ม
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 更新界面文本 / Update UI text / อัปเดตข้อความอินเทอร์เฟซ
    updateLanguage();
}

// 更新界面语言 / Update UI Language / อัปเดตภาษาอินเทอร์เฟซ
function updateLanguage() {
    // 更新带 data-i18n 属性的所有元素 / Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const text = getTranslation(key);
        if (text) {
            element.textContent = text;
        }
    });

    // 重新渲染房源卡片以更新价格和配置信息 / Re-render apartment cards to update prices and features
    renderApartments();
}

// 获取翻译文本 / Get Translation Text / รับข้อความแปล
function getTranslation(key) {
    const keys = key.split('.');
    let value = translationsData;

    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }

    return value && value[currentLang] ? value[currentLang] : value;
}

// 应用筛选 / Apply Filter / ใช้ตัวกรอง
function applyFilter(filter) {
    currentFilter = filter;

    // 更新筛选器状态 / Update filter states / อัปเดตสถานะตัวกรอง
    document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.toggle('active', item.dataset.filter === filter);
    });

    // 重新渲染房源 / Re-render apartments / แสดงห้องใหม่
    renderApartments();
}

// 渲染房源列表 / Render Apartment List / แสดงรายการห้อง
function renderApartments() {
    const grid = document.getElementById('apartmentsGrid');
    
    // 筛选房源 / Filter apartments / กรองห้อง
    const filteredApartments = currentFilter === 'all' 
        ? apartmentsData 
        : apartmentsData.filter(apt => apt.type === currentFilter);

    if (filteredApartments.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <p data-i18n="noResults">暂无符合条件房源 / No units found / ไม่พบห้องที่ตรงกัน</p>
            </div>
        `;
        return;
    }

    // 生成房源卡片 / Generate apartment cards / สร้างการ์ดห้อง
    grid.innerHTML = filteredApartments.map(apt => createApartmentCard(apt)).join('');
}

// 创建房源卡片 HTML / Create Apartment Card HTML / สร้าง HTML การ์ดห้อง
function createApartmentCard(apt) {
    const typeLabel = APARTMENT_TYPES[apt.type]?.[currentLang] || apt.type;
    const priceText = apt.price[currentLang] || apt.price.zh;
    const mainImage = apt.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

        // 获取房号显示名称（中英泰三语）/ Get room number display name with trilingual support
    let roomNumberDisplay;
    if (apt.displayName && typeof apt.displayName === 'object') {
        roomNumberDisplay = apt.displayName[currentLang] || apt.displayName.zh || apt.displayName.en || apt.displayName.th || apt.id;
    } else {
        roomNumberDisplay = apt.id;
    }
    
    // 安全地获取楼层信息（中英泰三语）/ Safely get floor info with trilingual support
    let floorText;
    if (typeof apt.floor === 'object' && apt.floor !== null) {
        // 如果是对象，根据当前语言获取值
        if (currentLang && apt.floor[currentLang] && typeof apt.floor[currentLang] === 'string') {
            floorText = apt.floor[currentLang];
        } else if (apt.floor.zh && typeof apt.floor.zh === 'string') {
            floorText = apt.floor.zh;
        } else {
            // 如果没有有效的字符串值，使用默认值
            floorText = apt.floor.zh || apt.floor.en || apt.floor.th || '';
        }
    } else if (typeof apt.floor === 'string') {
        // 如果是字符串，直接使用
        floorText = apt.floor;
    } else {
        // 其他情况，使用空字符串
        floorText = '';
    }

    return `
        <div class="apartment-card" data-id="${apt.id}" onclick="openModal('${apt.id}')">
            <div class="card-image">
                <img
                    src="${mainImage}"
                    alt="Apartment ${roomNumberDisplay}"
                    loading="${LAZY_LOADING.enabled ? 'lazy' : 'eager'}"
                    onerror="this.src='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                >
                <span class="card-badge">${roomNumberDisplay}</span>
            </div>
            <div class="card-content">
                <div class="card-room-number">${roomNumberDisplay}</div>
                <h3 class="card-title">${typeLabel}</h3>
                <div class="card-info">
                    <span class="info-item">
                        <i class="fas fa-ruler-combined"></i>
                        ${apt.area}
                    </span>
                    <span class="info-item">
                        <i class="fas fa-building"></i>
                        ${floorText}
                    </span>
                </div>
                <div class="card-price">
                    <span class="price-label" data-i18n="contact.price">${getTranslation('contact.price') || 'Price'}</span>
                    <span class="price-value">${priceText}</span>
                </div>
            </div>
        </div>
    `;
}

// 打开模态框 / Open Modal / เปิดโมดัล
function openModal(apartmentId) {
    const apt = apartmentsData.find(a => a.id === apartmentId);
    if (!apt) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    // 安全地获取楼层信息（中英泰三语）/ Safely get floor info with trilingual support
    let floorText;
    if (typeof apt.floor === 'object' && apt.floor !== null) {
        // 如果是对象，根据当前语言获取值
        if (currentLang && apt.floor[currentLang] && typeof apt.floor[currentLang] === 'string') {
            floorText = apt.floor[currentLang];
        } else if (apt.floor.zh && typeof apt.floor.zh === 'string') {
            floorText = apt.floor.zh;
        } else {
            // 如果没有有效的字符串值，使用默认值
            floorText = apt.floor.zh || apt.floor.en || apt.floor.th || '';
        }
    } else if (typeof apt.floor === 'string') {
        // 如果是字符串，直接使用
        floorText = apt.floor;
    } else {
        // 其他情况，使用空字符串
        floorText = '';
    }

    // 生成模态框内容 / Generate modal content / สร้างเนื้อหาโมดัล
    const featuresList = (apt.features[currentLang] || apt.features.zh).map(feature => `
        <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${feature}</span>
        </div>
    `).join('');

    // 添加楼层信息（中英泰三语）/ Add floor info with trilingual support
    let floorInfoText = '';
    if (apt.floorInfo && typeof apt.floorInfo === 'object' && apt.floorInfo !== null) {
        if (currentLang && apt.floorInfo[currentLang] && typeof apt.floorInfo[currentLang] === 'string') {
            floorInfoText = apt.floorInfo[currentLang];
        } else if (apt.floorInfo.zh && typeof apt.floorInfo.zh === 'string') {
            floorInfoText = apt.floorInfo.zh;
        } else {
            floorInfoText = apt.floorInfo.zh || apt.floorInfo.en || apt.floorInfo.th || '';
        }
    } else if (apt.floorInfo && typeof apt.floorInfo === 'string') {
        floorInfoText = apt.floorInfo;
    }

    const depositText = apt.deposit[currentLang] || apt.deposit.zh;

    modalBody.innerHTML = `
        <div class="modal-image-gallery">
            <div class="modal-main-image">
                <img
                    src="${apt.images[0]}"
                    alt="Apartment ${apt.id}"
                    id="mainImage"
                    onerror="this.src='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
                >
            </div>
            ${apt.images.length > 1 ? `
                <div class="modal-thumbnails">
                    ${apt.images.map((img, index) => `
                        <div class="modal-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                            <img src="${img}" alt="Thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <div class="modal-info">
            <div class="info-group">
                <div class="info-label" data-i18n="modal.area">${getTranslation('modal.area') || 'Area'}</div>
                <div class="info-value">${apt.area}</div>
            </div>
            <div class="info-group">
                <div class="info-label" data-i18n="modal.floor">${getTranslation('modal.floor') || 'Floor'}</div>
                <div class="info-value">${floorText}</div>
            </div>
            <div class="info-group">
                <div class="info-label" data-i18n="modal.deposit">${getTranslation('modal.deposit') || 'Deposit'}</div>
                <div class="info-value">${depositText}</div>
            </div>
            <div class="info-group">
                <div class="info-label" data-i18n="contact.price">${getTranslation('contact.price') || 'Price'}</div>
                <div class="info-value">${apt.price[currentLang] || apt.price.zh}</div>
            </div>
        </div>

        <div class="modal-features">
            <h4 class="features-title" data-i18n="modal.features">${getTranslation('modal.features') || 'Features'}</h4>
            <div class="features-list">
                ${featuresList}
                ${floorInfoText ? `
                    <div class="feature-item floor-info">
                        <i class="fas fa-info-circle"></i>
                        <span>${floorInfoText}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // 更新联系链接 / Update contact links / อัปเดตลิงก์การติดต่อ
    const whatsappBtn = document.querySelector('.modal-footer .modal-cta');
    if (whatsappBtn) {
        const message = encodeURIComponent(`Hi, I'm interested in viewing apartment ${apt.id}. / 您好，我想看房 ${apt.id} / สวัสดี ฉันสนใจดูห้อง ${apt.id}`);
        whatsappBtn.href = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
    }

    // 显示模态框 / Show modal / แสดงโมดัล
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框 / Close Modal / ปิดโมดัล
function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 切换主图 / Change Main Image / เปลี่ยนภาพหลัก
function changeMainImage(imageUrl, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageUrl;
    }

    // 更新缩略图状态 / Update thumbnail states / อัปเดตสถานะภาพย่อ
    document.querySelectorAll('.modal-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// 显示错误信息 / Show Error Message / แสดงข้อความผิดพลาด
function showError(message) {
    const grid = document.getElementById('apartmentsGrid');
    grid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// 页面可见性变化时重新加载 / Reload on visibility change / โหลดใหม่เมื่อการมองเห็นหน้าเปลี่ยน
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && apartmentsData.length === 0) {
        loadData();
    }
});
