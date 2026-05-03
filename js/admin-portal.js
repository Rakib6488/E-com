'use strict';

(function () {
    if (sessionStorage.getItem('farhaAdminLoggedIn') !== 'true') {
        window.location.href = './admin-login.html';
        return;
    }

    var content = window.FarhaStore.load();
    var activeProductId = null;

    var form = document.getElementById('product-form');
    var settingsForm = document.getElementById('settings-form');
    var productTable = document.getElementById('product-table-body');
    var productCount = document.getElementById('product-count');
    var inventoryCount = document.getElementById('inventory-count');
    var lowStockCount = document.getElementById('low-stock-count');
    var statusMessage = document.getElementById('admin-status');
    var searchInput = document.getElementById('product-search');
    var categoryFilter = document.getElementById('category-filter');
    var imageInput = document.getElementById('product-image-file');

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
        document.getElementById(id).value = nextValue || '';
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

    function clearProductForm() {
        activeProductId = null;
        form.reset();
        setValue('product-category', 'women');
        setValue('product-image', 'img/product/product-1.jpg');
        setValue('product-stock', '1');
        document.getElementById('product-featured').checked = true;
        document.getElementById('product-submit').textContent = 'Add Product';
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

    function renderStats() {
        var totalInventory = content.products.reduce(function (sum, product) {
            return sum + Number(product.stock || 0);
        }, 0);
        var lowStock = content.products.filter(function (product) {
            return Number(product.stock || 0) <= 5;
        }).length;

        productCount.textContent = content.products.length;
        inventoryCount.textContent = totalInventory;
        lowStockCount.textContent = lowStock;
    }

    function renderSettings() {
        setValue('setting-site-name', content.settings.siteName);
        setValue('setting-instagram', content.settings.instagram);
        setValue('setting-footer', content.settings.footerText);
        setValue('setting-announcement', content.settings.announcement);
    }

    function render() {
        renderStats();
        renderProducts();
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

    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        content.settings.siteName = value('setting-site-name') || 'Farha E-com';
        content.settings.instagram = value('setting-instagram') || '@ farha_ecom';
        content.settings.footerText = value('setting-footer');
        content.settings.announcement = value('setting-announcement');
        saveContent('Website settings saved');
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

    searchInput.addEventListener('input', renderProducts);
    categoryFilter.addEventListener('change', renderProducts);

    document.getElementById('product-clear').addEventListener('click', clearProductForm);

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
                content.products = Array.isArray(imported.products) ? imported.products : content.products;
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
    render();
}());
