/**
 * Premium Residence - 配置文件
 * Configuration File
 * ไฟล์การตั้งค่า
 */

// 联系方式配置 / Contact Information / ข้อมูลการติดต่อ
const CONTACT_INFO = {
    // WhatsApp号码（包含国家代码，不需要加号）/ WhatsApp number (with country code, no +)
    whatsapp: "8613800138000", // 示例：86为中国的国家代码

// 电话号码 / Phone number / เบอร์โทรศัพท์
phone: "+862022365066", // 中国广州号码：+862022365066

    // 微信号（可选）/ WeChat ID (optional) / ไอดีวีแชท (ไม่จำเป็น)
wechat: "huahaida888"
};

// 默认语言 / Default Language / ภาษาเริ่มต้น
const DEFAULT_LANG = 'zh';

// 可用语言列表 / Available Languages / รายการภาษาที่รองรับ
const AVAILABLE_LANGUAGES = ['zh', 'en', 'th'];

// 货币汇率配置（用于泰铢显示）/ Currency exchange rate (for Thai Baht display) / อัตราแลกเปลี่ยนสกุลเงิน
const CURRENCY_RATE = {
    // 1 CNY = 5 THB (示例汇率，请根据实际汇率调整)
    // 1 CNY = 5 THB (Example rate, adjust according to actual rate)
    CNY_TO_THB: 5
};

// 房源类型标签 / Apartment type labels / ป้ายกำกับประเภทห้อง
const APARTMENT_TYPES = {
    'studio': {
        zh: '开间',
        en: 'Studio',
        th: 'สตูดิโอ'
    },
    '1bedroom': {
        zh: '一居室',
        en: '1 Bedroom',
        th: '1 ห้องนอน'
    },
    '2bedroom': {
        zh: '两居室',
        en: '2 Bedrooms',
        th: '2 ห้องนอน'
    }
};

// 图片懒加载配置 / Image lazy loading configuration / การตั้งค่าการโหลดภาพแบบ Lazy
const LAZY_LOADING = {
    enabled: true,
    threshold: 100 // 像素：图片进入视口前100px开始加载 / Pixels: Start loading 100px before image enters viewport
};

// 动画配置 / Animation configuration / การตั้งค่าแอนิเมชัน
const ANIMATION_CONFIG = {
    // 卡片悬浮效果时长 / Card hover animation duration / ระยะเวลาเอฟเฟกต์การโฮเวอร์การ์ด
    cardHoverDuration: 300,
    // 模态框打开时长 / Modal open duration / ระยะเวลาเปิดโมดัล
    modalOpenDuration: 300
};
