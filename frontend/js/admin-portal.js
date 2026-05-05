'use strict';

(function () {
    if (sessionStorage.getItem('farhaAdminLoggedIn') !== 'true') {
        window.location.href = './admin-login.html';
        return;
    }

    var content = window.FarhaStore.load();
    var activeProductId = null;
    var activeTrendId = null;

    var form = document.getElementById('product-form');
    var trendForm = document.getElementById('trend-form');
    var settingsForm = document.getElementById('settings-form');
    var productTable = document.getElementById('product-table-body');
    var trendTable = document.getElementById('trend-table-body');
    var productCount = document.getElementById('product-count');
    var inventoryCount = document.getElementById('inventory-count');
    var lowStockCount = document.getElementById('low-stock-count');
    var orderCount = document.getElementById('order-count');
    var paidCount = document.getElementById('paid-count');
    var salesTotal = document.getElementById('sales-total');
    var statusMessage = document.getElementById('admin-status');
    var searchInput = document.getElementById('product-search');
    var categoryFilter = document.getElementById('category-filter');
    var imageInput = document.getElementById('product-image-file');
    var orderTable = document.getElementById('order-table-body');
    var customerTable = document.getElementById('customer-table-body');
    var reportGrid = document.getElementById('report-grid');
    var topProducts = document.getElementById('top-products');
    var activityLog = document.getElementById('activity-log');

    function notify(message) {
        statusMessage.textContent = message;
        window.setTimeout(function () {
            statusMessage.textContent = '';
        }, 2500);
    }

    function saveContent(message) {
        window.FarhaStore.save(content);
        render();
        notify(message || 'Saved');
    }

    function value(id) {
        return document.getElementById(id).value.trim();
    }

    function setValue(id, nextValue) {
        document.getElementById(id).value = nextValue === 0 ? 0 : (nextValue || '');
    }

    function setChecked(id, checked) {
        document.getElementById(id).checked = Boolean(checked);
    }

    function ensureAdminContent() {
        content.orders = Array.isArray(content.orders) ? content.orders : [];
        content.customers = Array.isArray(content.customers) ? content.customers : [];
        content.settings.payments = content.settings.payments || {};
        content.settings.shipping = content.settings.shipping || {};
        content.settings.marketing = content.settings.marketing || {};
        content.settings.roles = content.settings.roles || {};
        content.settings.cms = content.settings.cms || {};
        content.settings.security = content.settings.security || {};
        content.settings.automation = content.settings.automation || {};
    }

    function addActivity(message) {
        var roles = content.settings.roles;
        roles.activityLog = Array.isArray(roles.activityLog) ? roles.activityLog : [];
        roles.activityLog.unshift(message);
        roles.activityLog = roles.activityLog.slice(0, 6);
    }

    function productFromForm() {
        return {
            id: activeProductId || 'p-' + Date.now(),
            name: value('product-name'),
            category: value('product-category'),
            price: Number(value('product-price')) || 0,
            salePrice: value('product-sale-price') === '' ? '' : Number(value('product-sale-price')),
            image: value('product-image') || 'img/product/product-1.jpg',
            badge: value('product-badge'),
            stock: Number(value('product-stock')) || 0,
            sku: value('product-sku'),
            description: value('product-description'),
            featured: document.getElementById('product-featured').checked
        };
    }

    function trendFromForm() {
        return {
            id: activeTrendId || 't-' + Date.now(),
            section: value('trend-section'),
            sectionTitle: value('trend-section-title') || sectionLabel(value('trend-section')),
            name: value('trend-name'),
            price: Number(value('trend-price')) || 0,
            image: value('trend-image') || 'img/trend/ht-1.jpg'
        };
    }

    function sectionLabel(section) {
        if (section === 'best') {
            return 'Best seller';
        }

        if (section === 'feature') {
            return 'Feature';
        }

        return 'Hot Trend';
    }

    function clearProductForm() {
        activeProductId = null;
        form.reset();
        setValue('product-category', 'women');
        setValue('product-image', 'img/product/product-1.jpg');
        setValue('product-stock', '1');
        document.getElementById('product-featured').checked = true;
        document.getElementById('product-submit').textContent = 'Add Product';
    }

    function clearTrendForm() {
        activeTrendId = null;
        trendForm.reset();
        setValue('trend-section', 'hot');
        setValue('trend-section-title', 'Hot Trend');
        setValue('trend-image', 'img/trend/ht-1.jpg');
        document.getElementById('trend-submit').textContent = 'Update Trend Item';
    }

    function editProduct(id) {
        var product = content.products.find(function (item) {
            return item.id === id;
        });

        if (!product) {
            return;
        }

        activeProductId = id;
        setValue('product-name', product.name);
        setValue('product-category', product.category);
        setValue('product-price', product.price);
        setValue('product-sale-price', product.salePrice);
        setValue('product-image', product.image);
        setValue('product-badge', product.badge);
        setValue('product-stock', product.stock);
        setValue('product-sku', product.sku);
        setValue('product-description', product.description);
        document.getElementById('product-featured').checked = product.featured !== false;
        document.getElementById('product-submit').textContent = 'Update Product';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function editTrend(id) {
        var trend = content.trends.find(function (item) {
            return item.id === id;
        });

        if (!trend) {
            return;
        }

        activeTrendId = id;
        setValue('trend-section', trend.section);
        setValue('trend-section-title', trend.sectionTitle);
        setValue('trend-name', trend.name);
        setValue('trend-price', trend.price);
        setValue('trend-image', trend.image);
        trendForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function deleteProduct(id) {
        if (!window.confirm('Delete this product from Farha E-com?')) {
            return;
        }

        content.products = content.products.filter(function (product) {
            return product.id !== id;
        });
        saveContent('Product deleted');
        clearProductForm();
    }

    function filteredProducts() {
        var query = searchInput.value.trim().toLowerCase();
        var category = categoryFilter.value;

        return content.products.filter(function (product) {
            var matchesQuery = !query ||
                product.name.toLowerCase().indexOf(query) !== -1 ||
                String(product.sku || '').toLowerCase().indexOf(query) !== -1;
            var matchesCategory = category === 'all' || product.category === category;
            return matchesQuery && matchesCategory;
        });
    }

    function renderProducts() {
        var products = filteredProducts();

        productTable.innerHTML = products.map(function (product) {
            var stockClass = Number(product.stock) <= 5 ? ' admin-stock-low' : '';

            return '<tr>' +
                '<td><img class="admin-product-thumb" src="' + window.FarhaStore.safeText(product.image) + '" alt=""></td>' +
                '<td><strong>' + window.FarhaStore.safeText(product.name) + '</strong><span>' + window.FarhaStore.safeText(product.sku || 'No SKU') + '</span></td>' +
                '<td>' + window.FarhaStore.safeText(product.category) + '</td>' +
                '<td>' + window.FarhaStore.money(product.salePrice || product.price) + '</td>' +
                '<td class="' + stockClass + '">' + Number(product.stock || 0) + '</td>' +
                '<td>' + (product.featured !== false ? 'Yes' : 'No') + '</td>' +
                '<td><button class="admin-link-button" data-edit="' + product.id + '" type="button">Edit</button><button class="admin-link-button admin-link-button--danger" data-delete="' + product.id + '" type="button">Delete</button></td>' +
                '</tr>';
        }).join('');

        if (!products.length) {
            productTable.innerHTML = '<tr><td colspan="7" class="admin-empty">No products found.</td></tr>';
        }
    }

    function renderOrders() {
        orderTable.innerHTML = content.orders.map(function (order) {
            return '<tr>' +
                '<td><strong>' + window.FarhaStore.safeText(order.id) + '</strong><span>' + window.FarhaStore.safeText(order.date) + '</span></td>' +
                '<td>' + window.FarhaStore.safeText(order.customer) + '<span>' + window.FarhaStore.safeText(order.method) + '</span></td>' +
                '<td><select class="admin-inline-select" data-order-status="' + order.id + '">' +
                statusOption(order.status, 'Pending') +
                statusOption(order.status, 'Processing') +
                statusOption(order.status, 'Delivered') +
                '</select></td>' +
                '<td><select class="admin-inline-select" data-payment-status="' + order.id + '">' +
                statusOption(order.payment, 'Paid') +
                statusOption(order.payment, 'Unpaid') +
                '</select></td>' +
                '<td>' + window.FarhaStore.money(order.total) + '</td>' +
                '<td><select class="admin-inline-select" data-return-status="' + order.id + '">' +
                statusOption(order.returnStatus, 'None') +
                statusOption(order.returnStatus, 'Return Requested') +
                statusOption(order.returnStatus, 'Returned') +
                statusOption(order.returnStatus, 'Cancelled') +
                '</select></td>' +
                '<td><button class="admin-link-button" data-invoice="' + order.id + '" type="button">Generate</button></td>' +
                '</tr>';
        }).join('');
    }

    function statusOption(current, value) {
        return '<option value="' + value + '"' + (current === value ? ' selected' : '') + '>' + value + '</option>';
    }

    function renderCustomers() {
        customerTable.innerHTML = content.customers.map(function (customer) {
            return '<tr>' +
                '<td><strong>' + window.FarhaStore.safeText(customer.name) + '</strong><span>Total spent ' + window.FarhaStore.money(customer.spent) + '</span></td>' +
                '<td>' + window.FarhaStore.safeText(customer.phone) + '<span>' + window.FarhaStore.safeText(customer.email) + '</span></td>' +
                '<td>' + Number(customer.orders || 0) + '<span>Order history</span></td>' +
                '<td>' + window.FarhaStore.safeText(customer.activity) + '</td>' +
                '</tr>';
        }).join('');
    }

    function renderTrends() {
        var sectionOrder = { hot: 1, best: 2, feature: 3 };
        var trends = content.trends.slice().sort(function (a, b) {
            return (sectionOrder[a.section] || 9) - (sectionOrder[b.section] || 9);
        });

        trendTable.innerHTML = trends.map(function (trend) {
            return '<tr>' +
                '<td><img class="admin-product-thumb" src="' + window.FarhaStore.safeText(trend.image) + '" alt=""></td>' +
                '<td><strong>' + window.FarhaStore.safeText(trend.sectionTitle || sectionLabel(trend.section)) + '</strong><span>' + window.FarhaStore.safeText(trend.section) + '</span></td>' +
                '<td>' + window.FarhaStore.safeText(trend.name) + '</td>' +
                '<td>' + window.FarhaStore.money(trend.price) + '</td>' +
                '<td><button class="admin-link-button" data-trend-edit="' + trend.id + '" type="button">Edit</button></td>' +
                '</tr>';
        }).join('');
    }

    function renderStats() {
        var totalInventory = content.products.reduce(function (sum, product) {
            return sum + Number(product.stock || 0);
        }, 0);
        var lowStock = content.products.filter(function (product) {
            return Number(product.stock || 0) <= 5;
        }).length;
        var newOrders = content.orders.filter(function (order) {
            return order.status !== 'Delivered' && order.returnStatus !== 'Cancelled';
        }).length;
        var paidOrders = content.orders.filter(function (order) {
            return order.payment === 'Paid';
        }).length;
        var totalSales = content.orders.reduce(function (sum, order) {
            return sum + (order.payment === 'Paid' ? Number(order.total || 0) : 0);
        }, 0);

        productCount.textContent = content.products.length;
        inventoryCount.textContent = totalInventory;
        lowStockCount.textContent = lowStock;
        orderCount.textContent = newOrders;
        paidCount.textContent = paidOrders;
        salesTotal.textContent = window.FarhaStore.money(totalSales);
    }

    function renderReports() {
        var paidOrders = content.orders.filter(function (order) {
            return order.payment === 'Paid';
        });
        var totalSales = paidOrders.reduce(function (sum, order) {
            return sum + Number(order.total || 0);
        }, 0);
        var dailySales = paidOrders.slice(0, 2).reduce(function (sum, order) {
            return sum + Number(order.total || 0);
        }, 0);
        var profit = Math.round(totalSales * 0.32);
        var customerCount = content.customers.length;

        reportGrid.innerHTML = [
            ['Daily sales', window.FarhaStore.money(dailySales)],
            ['Monthly sales', window.FarhaStore.money(totalSales)],
            ['Profit / loss', window.FarhaStore.money(profit) + ' profit'],
            ['Customer behavior', customerCount + ' active customers']
        ].map(function (item) {
            return '<div class="admin-report-card"><span>' + item[0] + '</span><strong>' + item[1] + '</strong></div>';
        }).join('');

        var products = content.products.slice(0, 4);
        topProducts.innerHTML = '<h5>Top-selling products</h5>' + products.map(function (product, index) {
            var percent = Math.max(20, 95 - (index * 18));
            return '<div class="admin-progress-item"><div><strong>' + window.FarhaStore.safeText(product.name) + '</strong><span>' + percent + '% sales share</span></div><b style="width:' + percent + '%"></b></div>';
        }).join('');
    }

    function renderSettings() {
        setValue('setting-site-name', content.settings.siteName);
        setValue('setting-instagram', content.settings.instagram);
        setValue('setting-footer', content.settings.footerText);
        setValue('setting-announcement', content.settings.announcement);
        setValue('gateway-bkash', content.settings.payments.bkash);
        setValue('gateway-nagad', content.settings.payments.nagad);
        setValue('gateway-card', content.settings.payments.card);
        setValue('gateway-emi', content.settings.payments.emi);
        setValue('refund-policy', content.settings.payments.refundPolicy);
        setValue('shipping-courier', content.settings.shipping.courier);
        setValue('shipping-charge', content.settings.shipping.charge);
        setValue('shipping-tracking', content.settings.shipping.tracking);
        setValue('shipping-status', content.settings.shipping.status);
        setValue('marketing-coupon', content.settings.marketing.coupon);
        setValue('marketing-campaign', content.settings.marketing.campaign);
        setValue('marketing-message', content.settings.marketing.message);
        setValue('marketing-push', content.settings.marketing.push);
        setValue('role-admin', content.settings.roles.admin);
        setValue('role-staff', content.settings.roles.staff);
        setValue('cms-banner', content.settings.cms.banner);
        setValue('cms-homepage', content.settings.cms.homepage);
        setValue('cms-blog', content.settings.cms.blog);
        setValue('cms-seo', content.settings.cms.seo);
        setChecked('security-2fa', content.settings.security.twoFactor);
        setValue('security-backup', content.settings.security.backup);
        setValue('security-fraud', content.settings.security.fraud);
        setChecked('auto-confirmation', content.settings.automation.confirmation);
        setChecked('auto-stock', content.settings.automation.stock);
        setValue('auto-cart', content.settings.automation.cart);
        renderActivityLog();
    }

    function renderActivityLog() {
        var items = content.settings.roles.activityLog || [];
        activityLog.innerHTML = '<h5>Activity log</h5>' + items.map(function (item) {
            return '<p>' + window.FarhaStore.safeText(item) + '</p>';
        }).join('');
    }

    function render() {
        ensureAdminContent();
        renderStats();
        renderOrders();
        renderCustomers();
        renderReports();
        renderActivityLog();
        renderProducts();
        renderTrends();
        window.FarhaStore.applySettings();
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var nextProduct = productFromForm();

        if (!nextProduct.name) {
            notify('Product name is required');
            return;
        }

        if (activeProductId) {
            content.products = content.products.map(function (product) {
                return product.id === activeProductId ? nextProduct : product;
            });
            saveContent('Product updated');
        } else {
            content.products.unshift(nextProduct);
            saveContent('Product added');
        }

        clearProductForm();
    });

    trendForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var nextTrend = trendFromForm();

        if (!nextTrend.name) {
            notify('Trend item name is required');
            return;
        }

        if (activeTrendId) {
            content.trends = content.trends.map(function (trend) {
                return trend.id === activeTrendId ? nextTrend : trend;
            });
        } else {
            content.trends.push(nextTrend);
        }

        saveContent('Trend item saved');
        clearTrendForm();
    });

    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.siteName = value('setting-site-name') || 'Farha E-com';
        content.settings.instagram = value('setting-instagram') || '@ farha_ecom';
        content.settings.footerText = value('setting-footer');
        content.settings.announcement = value('setting-announcement');
        addActivity('Admin updated website settings');
        saveContent('Website settings saved');
    });

    orderTable.addEventListener('change', function (event) {
        var orderId = event.target.getAttribute('data-order-status') ||
            event.target.getAttribute('data-payment-status') ||
            event.target.getAttribute('data-return-status');
        var field = event.target.getAttribute('data-order-status') ? 'status' :
            event.target.getAttribute('data-payment-status') ? 'payment' : 'returnStatus';

        content.orders = content.orders.map(function (order) {
            if (order.id === orderId) {
                order[field] = event.target.value;
                addActivity('Admin changed ' + order.id + ' ' + field + ' to ' + event.target.value);
            }

            return order;
        });
        saveContent('Order updated');
    });

    orderTable.addEventListener('click', function (event) {
        var invoiceId = event.target.getAttribute('data-invoice');
        var order;

        if (!invoiceId) {
            return;
        }

        order = content.orders.find(function (item) {
            return item.id === invoiceId;
        });

        if (order) {
            addActivity('Admin generated invoice for ' + order.id);
            saveContent('Invoice ready: ' + order.id + ' / ' + order.customer + ' / ' + window.FarhaStore.money(order.total));
        }
    });

    document.getElementById('payment-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.payments.bkash = value('gateway-bkash');
        content.settings.payments.nagad = value('gateway-nagad');
        content.settings.payments.card = value('gateway-card');
        content.settings.payments.emi = value('gateway-emi');
        content.settings.payments.refundPolicy = value('refund-policy');
        addActivity('Admin updated payment gateway setup');
        saveContent('Payment settings saved');
    });

    document.getElementById('shipping-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.shipping.courier = value('shipping-courier');
        content.settings.shipping.charge = Number(value('shipping-charge')) || 0;
        content.settings.shipping.tracking = value('shipping-tracking');
        content.settings.shipping.status = value('shipping-status');
        addActivity('Admin updated shipping delivery setup');
        saveContent('Shipping settings saved');
    });

    document.getElementById('marketing-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.marketing.coupon = value('marketing-coupon');
        content.settings.marketing.campaign = value('marketing-campaign');
        content.settings.marketing.message = value('marketing-message');
        content.settings.marketing.push = value('marketing-push');
        addActivity('Admin updated marketing tools');
        saveContent('Marketing settings saved');
    });

    document.getElementById('role-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.roles.admin = value('role-admin');
        content.settings.roles.staff = value('role-staff');
        addActivity('Admin updated user role permissions');
        saveContent('Role settings saved');
    });

    document.getElementById('cms-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.cms.banner = value('cms-banner');
        content.settings.cms.homepage = value('cms-homepage');
        content.settings.cms.blog = value('cms-blog');
        content.settings.cms.seo = value('cms-seo');
        addActivity('Admin updated CMS content and SEO');
        saveContent('CMS settings saved');
    });

    document.getElementById('security-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.security.twoFactor = document.getElementById('security-2fa').checked;
        content.settings.security.backup = value('security-backup');
        content.settings.security.fraud = value('security-fraud');
        addActivity('Admin updated security and backup settings');
        saveContent('Security settings saved');
    });

    document.getElementById('automation-form').addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.automation.confirmation = document.getElementById('auto-confirmation').checked;
        content.settings.automation.stock = document.getElementById('auto-stock').checked;
        content.settings.automation.cart = value('auto-cart');
        addActivity('Admin updated automation rules');
        saveContent('Automation settings saved');
    });

    productTable.addEventListener('click', function (event) {
        var editId = event.target.getAttribute('data-edit');
        var deleteId = event.target.getAttribute('data-delete');

        if (editId) {
            editProduct(editId);
        }

        if (deleteId) {
            deleteProduct(deleteId);
        }
    });

    trendTable.addEventListener('click', function (event) {
        var editId = event.target.getAttribute('data-trend-edit');

        if (editId) {
            editTrend(editId);
        }
    });

    searchInput.addEventListener('input', renderProducts);
    categoryFilter.addEventListener('change', renderProducts);

    document.getElementById('product-clear').addEventListener('click', clearProductForm);
    document.getElementById('trend-clear').addEventListener('click', clearTrendForm);

    document.getElementById('export-content').addEventListener('click', function () {
        var blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'farha-ecom-content.json';
        link.click();
        URL.revokeObjectURL(link.href);
    });

    document.getElementById('import-content').addEventListener('change', function (event) {
        var file = event.target.files[0];

        if (!file) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function () {
            try {
                var imported = JSON.parse(reader.result);
                content.settings = Object.assign({}, content.settings, imported.settings || {});
                content.orders = Array.isArray(imported.orders) ? imported.orders : content.orders;
                content.customers = Array.isArray(imported.customers) ? imported.customers : content.customers;
                content.products = Array.isArray(imported.products) ? imported.products : content.products;
                content.trends = Array.isArray(imported.trends) ? imported.trends : content.trends;
                ensureAdminContent();
                saveContent('Content imported');
            } catch (error) {
                notify('Import failed. Use a valid JSON file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    });

    document.getElementById('reset-content').addEventListener('click', function () {
        if (!window.confirm('Reset all Farha E-com content to the starter data?')) {
            return;
        }

        content = window.FarhaStore.reset();
        clearProductForm();
        clearTrendForm();
        renderSettings();
        saveContent('Content reset');
    });

    imageInput.addEventListener('change', function (event) {
        var file = event.target.files[0];

        if (!file) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function () {
            setValue('product-image', reader.result);
            notify('Image loaded into product form');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('admin-logout').addEventListener('click', function () {
        sessionStorage.removeItem('farhaAdminLoggedIn');
        window.location.href = './admin-login.html';
    });

    renderSettings();
    clearProductForm();
    clearTrendForm();
    render();
}());
