'use strict';

(function () {
    var STORAGE_KEY = 'farhaEcomContent';
    var DEFAULT_IMAGE = 'img/product/product-1.jpg';

    var defaultContent = {
        settings: {
            siteName: 'Farha E-com',
            instagram: '@ farha_ecom',
            footerText: 'Farha E-com brings fresh fashion, accessories, and beauty picks together in one easy shop.',
            announcement: 'Free shipping on orders over $99',
            payments: {
                bkash: 'Enabled',
                nagad: 'Enabled',
                card: 'Enabled',
                emi: 'Disabled',
                refundPolicy: 'Refund requests are reviewed within 3 business days after return approval.'
            },
            shipping: {
                courier: 'Pathao',
                charge: 80,
                tracking: 'PX-2401-8842',
                status: 'In Transit'
            },
            marketing: {
                coupon: 'FARHA10',
                campaign: 'Eid fashion flash sale',
                message: 'New arrivals are live with limited-time discount.',
                push: 'Your cart picks are waiting.'
            },
            roles: {
                admin: 'Full',
                staff: 'Limited',
                activityLog: [
                    'Admin updated order ORD-1003 to Processing',
                    'Staff exported content backup',
                    'Admin changed homepage trend section'
                ]
            },
            cms: {
                banner: 'Fresh styles for every day',
                homepage: 'Women, men, kids, accessories, and beauty',
                blog: 'How to style new season essentials',
                seo: 'Shop fashion, accessories, cosmetics, and everyday essentials at Farha E-com.'
            },
            security: {
                twoFactor: true,
                backup: 'Daily',
                fraud: 'Enabled'
            },
            automation: {
                confirmation: true,
                stock: true,
                cart: 'After 24 hours'
            }
        },
        orders: [
            {
                id: 'ORD-1001',
                customerId: 'c-1',
                customer: 'Nusrat Jahan',
                date: '2026-05-03',
                status: 'Pending',
                payment: 'Unpaid',
                method: 'bKash',
                total: 245,
                returnStatus: 'None',
                tracking: ''
            },
            {
                id: 'ORD-1002',
                customerId: 'c-2',
                customer: 'Rafi Ahmed',
                date: '2026-05-02',
                status: 'Processing',
                payment: 'Paid',
                method: 'Card',
                total: 177,
                returnStatus: 'None',
                tracking: 'RX-882101'
            },
            {
                id: 'ORD-1003',
                customerId: 'c-3',
                customer: 'Samia Rahman',
                date: '2026-05-01',
                status: 'Delivered',
                payment: 'Paid',
                method: 'Nagad',
                total: 318,
                returnStatus: 'Return Requested',
                tracking: 'PA-730002'
            }
        ],
        customers: [
            {
                id: 'c-1',
                name: 'Nusrat Jahan',
                email: 'nusrat@example.com',
                phone: '+8801711000001',
                orders: 3,
                spent: 428,
                activity: 'Browsed accessories and abandoned cart reminder sent'
            },
            {
                id: 'c-2',
                name: 'Rafi Ahmed',
                email: 'rafi@example.com',
                phone: '+8801811000002',
                orders: 5,
                spent: 690,
                activity: 'Used FARHA10 coupon and paid by card'
            },
            {
                id: 'c-3',
                name: 'Samia Rahman',
                email: 'samia@example.com',
                phone: '+8801911000003',
                orders: 2,
                spent: 318,
                activity: 'Requested return for delivered order'
            }
        ],
        products: [
            {
                id: 'p-1',
                name: 'Buttons tweed blazer',
                category: 'women',
                price: 59,
                salePrice: '',
                image: 'img/product/product-1.jpg',
                badge: 'New',
                stock: 18,
                sku: 'FEC-W-001',
                description: 'A polished everyday blazer for office and evening looks.',
                featured: true
            },
            {
                id: 'p-2',
                name: 'Flowy striped skirt',
                category: 'women',
                price: 49,
                salePrice: '',
                image: 'img/product/product-2.jpg',
                badge: '',
                stock: 24,
                sku: 'FEC-W-002',
                description: 'Light striped skirt with easy movement.',
                featured: true
            },
            {
                id: 'p-3',
                name: 'Croc-effect bag',
                category: 'accessories',
                price: 59,
                salePrice: '',
                image: 'img/product/product-3.jpg',
                badge: 'Out Of Stock',
                stock: 0,
                sku: 'FEC-A-003',
                description: 'Structured croc-effect handbag.',
                featured: true
            },
            {
                id: 'p-4',
                name: 'Slim striped pocket shirt',
                category: 'men',
                price: 59,
                salePrice: '',
                image: 'img/product/product-4.jpg',
                badge: '',
                stock: 15,
                sku: 'FEC-M-004',
                description: 'A clean striped shirt with a slim fit.',
                featured: true
            },
            {
                id: 'p-5',
                name: 'Fit micro corduroy shirt',
                category: 'kid',
                price: 59,
                salePrice: '',
                image: 'img/product/product-5.jpg',
                badge: '',
                stock: 12,
                sku: 'FEC-K-005',
                description: 'Soft corduroy shirt for kids.',
                featured: true
            },
            {
                id: 'p-6',
                name: 'Tropical Kimono',
                category: 'women',
                price: 59,
                salePrice: 49,
                image: 'img/product/product-6.jpg',
                badge: 'Sale',
                stock: 20,
                sku: 'FEC-W-006',
                description: 'Bright kimono layer for warm days.',
                featured: true
            },
            {
                id: 'p-7',
                name: 'Contrasting sunglasses',
                category: 'accessories',
                price: 59,
                salePrice: '',
                image: 'img/product/product-7.jpg',
                badge: '',
                stock: 32,
                sku: 'FEC-A-007',
                description: 'Bold sunglasses with contrast frames.',
                featured: true
            },
            {
                id: 'p-8',
                name: 'Water resistant backpack',
                category: 'accessories',
                price: 59,
                salePrice: 49,
                image: 'img/product/product-8.jpg',
                badge: 'Sale',
                stock: 8,
                sku: 'FEC-A-008',
                description: 'Durable everyday backpack.',
                featured: true
            }
        ],
        trends: [
            {
                id: 't-1',
                section: 'hot',
                sectionTitle: 'Hot Trend',
                name: 'Chain bucket bag',
                price: 59,
                image: 'img/trend/ht-1.jpg'
            },
            {
                id: 't-2',
                section: 'hot',
                sectionTitle: 'Hot Trend',
                name: 'Pendant earrings',
                price: 59,
                image: 'img/trend/ht-2.jpg'
            },
            {
                id: 't-3',
                section: 'hot',
                sectionTitle: 'Hot Trend',
                name: 'Cotton T-Shirt',
                price: 59,
                image: 'img/trend/ht-3.jpg'
            },
            {
                id: 't-4',
                section: 'best',
                sectionTitle: 'Best seller',
                name: 'Cotton T-Shirt',
                price: 59,
                image: 'img/trend/bs-1.jpg'
            },
            {
                id: 't-5',
                section: 'best',
                sectionTitle: 'Best seller',
                name: 'Zip-pockets pebbled tote briefcase',
                price: 59,
                image: 'img/trend/bs-2.jpg'
            },
            {
                id: 't-6',
                section: 'best',
                sectionTitle: 'Best seller',
                name: 'Round leather bag',
                price: 59,
                image: 'img/trend/bs-3.jpg'
            },
            {
                id: 't-7',
                section: 'feature',
                sectionTitle: 'Feature',
                name: 'Bow wrap skirt',
                price: 59,
                image: 'img/trend/f-1.jpg'
            },
            {
                id: 't-8',
                section: 'feature',
                sectionTitle: 'Feature',
                name: 'Metallic earrings',
                price: 59,
                image: 'img/trend/f-2.jpg'
            },
            {
                id: 't-9',
                section: 'feature',
                sectionTitle: 'Feature',
                name: 'Flap cross-body bag',
                price: 59,
                image: 'img/trend/f-3.jpg'
            }
        ]
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function load() {
        var saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            save(defaultContent);
            return clone(defaultContent);
        }

        try {
            var content = JSON.parse(saved);
            content.settings = Object.assign({}, defaultContent.settings, content.settings || {});
            content.settings.payments = Object.assign({}, defaultContent.settings.payments, content.settings.payments || {});
            content.settings.shipping = Object.assign({}, defaultContent.settings.shipping, content.settings.shipping || {});
            content.settings.marketing = Object.assign({}, defaultContent.settings.marketing, content.settings.marketing || {});
            content.settings.roles = Object.assign({}, defaultContent.settings.roles, content.settings.roles || {});
            content.settings.cms = Object.assign({}, defaultContent.settings.cms, content.settings.cms || {});
            content.settings.security = Object.assign({}, defaultContent.settings.security, content.settings.security || {});
            content.settings.automation = Object.assign({}, defaultContent.settings.automation, content.settings.automation || {});
            content.orders = Array.isArray(content.orders) ? content.orders : clone(defaultContent.orders);
            content.customers = Array.isArray(content.customers) ? content.customers : clone(defaultContent.customers);
            content.products = Array.isArray(content.products) ? content.products : clone(defaultContent.products);
            content.trends = Array.isArray(content.trends) ? content.trends : clone(defaultContent.trends);
            return content;
        } catch (error) {
            save(defaultContent);
            return clone(defaultContent);
        }
    }

    function save(content) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }

    function reset() {
        save(defaultContent);
        return clone(defaultContent);
    }

    function money(value) {
        var amount = Number(value);

        if (!Number.isFinite(amount)) {
            amount = 0;
        }

        return '$ ' + amount.toFixed(amount % 1 === 0 ? 0 : 2);
    }

    function safeText(value) {
        return String(value || '').replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[character];
        });
    }

    function categoryClass(category) {
        return String(category || 'women').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    }

    function renderPrice(product) {
        if (product.salePrice !== '' && product.salePrice !== null && product.salePrice !== undefined) {
            return money(product.salePrice) + ' <span>' + money(product.price) + '</span>';
        }

        return money(product.price);
    }

    function renderRating() {
        return '<div class="rating">' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '<i class="fa fa-star"></i>' +
            '</div>';
    }

    function renderBadge(product) {
        var badge = safeText(product.badge);

        if (!badge) {
            return '';
        }

        var badgeClass = badge.toLowerCase().indexOf('stock') !== -1 ? 'stockout' : badge.toLowerCase();
        return '<div class="label ' + safeText(badgeClass) + '">' + badge + '</div>';
    }

    function productCard(product, columnClass) {
        var image = product.image || DEFAULT_IMAGE;
        var category = categoryClass(product.category);
        var saleClass = product.salePrice !== '' && product.salePrice !== null && product.salePrice !== undefined ? ' sale' : '';

        return '<div class="' + columnClass + ' mix ' + category + '">' +
            '<div class="product__item' + saleClass + '">' +
            '<div class="product__item__pic set-bg" data-setbg="' + safeText(image) + '">' +
            renderBadge(product) +
            '<ul class="product__hover">' +
            '<li><a href="' + safeText(image) + '" class="image-popup"><span class="arrow_expand"></span></a></li>' +
            '<li><a href="#"><span class="icon_heart_alt"></span></a></li>' +
            '<li><a href="#"><span class="icon_bag_alt"></span></a></li>' +
            '</ul>' +
            '</div>' +
            '<div class="product__item__text">' +
            '<h6><a href="./product-details.html">' + safeText(product.name) + '</a></h6>' +
            renderRating() +
            '<div class="product__price">' + renderPrice(product) + '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function applyBackgrounds(scope) {
        var root = scope || document;
        var items = root.querySelectorAll('.set-bg');

        items.forEach(function (item) {
            var bg = item.getAttribute('data-setbg');

            if (bg) {
                item.style.backgroundImage = 'url(' + bg + ')';
            }
        });
    }

    function renderProducts() {
        var content = load();
        var products = content.products;
        var homeGallery = document.querySelector('[data-farha-products="home"]');
        var shopGallery = document.querySelector('[data-farha-products="shop"]');

        if (homeGallery) {
            homeGallery.innerHTML = products.filter(function (product) {
                return product.featured !== false;
            }).slice(0, 8).map(function (product) {
                return productCard(product, 'col-lg-3 col-md-4 col-sm-6');
            }).join('');
            applyBackgrounds(homeGallery);
        }

        if (shopGallery) {
            shopGallery.innerHTML = products.map(function (product) {
                return productCard(product, 'col-lg-4 col-md-6');
            }).join('') +
            '<div class="col-lg-12 text-center"><div class="pagination__option"><a href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#"><i class="fa fa-angle-right"></i></a></div></div>';
            applyBackgrounds(shopGallery);
        }
    }

    function trendItem(item) {
        return '<div class="trend__item">' +
            '<div class="trend__item__pic">' +
            '<img src="' + safeText(item.image || DEFAULT_IMAGE) + '" alt="">' +
            '</div>' +
            '<div class="trend__item__text">' +
            '<h6>' + safeText(item.name) + '</h6>' +
            renderRating() +
            '<div class="product__price">' + money(item.price) + '</div>' +
            '</div>' +
            '</div>';
    }

    function renderTrends() {
        var content = load();
        var trendRoot = document.querySelector('[data-farha-trends]');
        var sections = [
            { id: 'hot', title: 'Hot Trend' },
            { id: 'best', title: 'Best seller' },
            { id: 'feature', title: 'Feature' }
        ];

        if (!trendRoot) {
            return;
        }

        trendRoot.innerHTML = sections.map(function (section) {
            var items = content.trends.filter(function (item) {
                return item.section === section.id;
            });
            var title = items[0] && items[0].sectionTitle ? items[0].sectionTitle : section.title;

            return '<div class="col-lg-4 col-md-4 col-sm-6">' +
                '<div class="trend__content">' +
                '<div class="section-title"><h4>' + safeText(title) + '</h4></div>' +
                items.map(trendItem).join('') +
                '</div>' +
                '</div>';
        }).join('');
    }

    function applySettings() {
        var content = load();
        var settings = content.settings;

        document.querySelectorAll('.site-logo-text, [data-farha-brand]').forEach(function (item) {
            item.textContent = settings.siteName || 'Farha E-com';
        });

        document.querySelectorAll('[data-farha-instagram]').forEach(function (item) {
            item.textContent = settings.instagram || '@ farha_ecom';
        });

        document.querySelectorAll('[data-farha-footer]').forEach(function (item) {
            item.textContent = settings.footerText || defaultContent.settings.footerText;
        });

        document.title = document.title.replace(/^.*Farha E-com/, settings.siteName || 'Farha E-com');
    }

    function initPublic() {
        applySettings();
        renderProducts();
        renderTrends();
    }

    window.FarhaStore = {
        defaultContent: clone(defaultContent),
        load: load,
        save: save,
        reset: reset,
        money: money,
        safeText: safeText,
        applySettings: applySettings,
        renderProducts: renderProducts,
        renderTrends: renderTrends,
        initPublic: initPublic
    };

    document.addEventListener('DOMContentLoaded', initPublic);
}());
