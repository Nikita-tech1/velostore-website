// Переменная для хранения загруженных товаров (для реализации живого поиска)
let currentProductsData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadNews();
    initContactForm();
    initCatalogFilters();
    initCatalogSearch(); // <--- Инициализация живого поиска
});

// --- ЛОГИКА ДЛЯ КАТАЛОГА И УСЛУГ (ИЗ БАЗЫ ДАННЫХ) ---
const fallbackServices = [
    {
        "id": 1,
        "title": "Горный велосипед Cross Country 29\"",
        "category": "bikes",
        "price": "45 900 ₽",
        "description": "Легкая алюминиевая рама, дисковые гидравлические тормоза, амортизационная вилка с блокировкой.",
        "badge": "Хит продаж"
    },
    {
        "id": 4,
        "title": "Полное ТО велосипеда",
        "category": "services",
        "price": "3 500 ₽",
        "description": "Разборка, чистка, смазка всех узлов, переборка втулок, настройка переключателей и тормозов.",
        "badge": "Сервис"
    }
];

// Загрузка товаров/услуг с сохранением в массив currentProductsData
async function loadServices(category = '') {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    try {
        const url = category ? `get_products.php?category=${encodeURIComponent(category)}` : 'get_products.php';

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        
        currentProductsData = await response.json();
        renderServicesCards(currentProductsData, grid);
    } catch (error) {
        console.warn('Не удалось загрузить данные из БД, используем запасные данные:', error);
        
        currentProductsData = category 
            ? fallbackServices.filter(item => item.category === category)
            : fallbackServices;
            
        renderServicesCards(currentProductsData, grid);
    }
}

function renderServicesCards(data, grid) {
    grid.innerHTML = '';

    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">Ничего не найдено.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('li');
        card.className = 'service-card';
        
        const formattedPrice = typeof item.price === 'number' || !isNaN(item.price) 
            ? `${Number(item.price).toLocaleString('ru-RU')} ₽` 
            : item.price;

        const badgeText = item.badge || (item.category === 'bikes' ? 'Велосипед' : 'Услуга');

        card.innerHTML = `
            <div class="card-badge">${badgeText}</div>
            <h3>${item.title}</h3>
            <p class="card-desc">${item.description}</p>
            <div class="card-footer">
                <span class="card-price">${formattedPrice}</span>
                <button class="btn-sm" onclick="openOrderModal('${item.title}')">Заказать</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Обработка живого поиска по названию и описанию
function initCatalogSearch() {
    const searchInput = document.getElementById('catalog-search');
    const grid = document.getElementById('services-grid');
    if (!searchInput || !grid) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        const filtered = currentProductsData.filter(item => {
            const titleMatch = item.title ? item.title.toLowerCase().includes(query) : false;
            const descMatch = item.description ? item.description.toLowerCase().includes(query) : false;
            return titleMatch || descMatch;
        });

        renderServicesCards(filtered, grid);
    });
}

// Обработка кликов по кнопкам «Все», «Велосипеды», «Услуги»
function initCatalogFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Очищаем поле поиска при переключении категории
            const searchInput = document.getElementById('catalog-search');
            if (searchInput) searchInput.value = '';

            const category = button.getAttribute('data-category');
            loadServices(category);
        });
    });
}


// --- ЛОГИКА ДЛЯ НОВОСТЕЙ ---
const fallbackNews = [
    {
        "id": 1,
        "title": "Открытие нового сервисного центра",
        "date": "15 сентября 2026",
        "summary": "Мы открыли новую мастерскую с современным оборудованием для диагностики и ремонта любых типов велосипедов."
    },
    {
        "id": 2,
        "title": "Поступление новой линейки горных велосипедов",
        "date": "01 сентября 2026",
        "summary": "В наш каталог поступили свежие модели текущего сезона с обновленной геометрией рам и гидравликой."
    },
    {
        "id": 3,
        "title": "Скидки до 20% на сезонное ТО",
        "date": "20 августа 2026",
        "summary": "Пройдите комплексное техническое обслуживание со скидкой и подготовьте свой байк к комфортным поездкам."
    },
    {
        "id": 4,
        "title": "Велозаезд по дорогам города",
        "date": "10 августа 2026",
        "summary": "Приглашаем всех клиентов нашей сети принять участие в любительском городском веломарше."
    },
    {
        "id": 5,
        "title": "Мастер-класс по уходу за цепью и трансмиссией",
        "date": "01 августа 2026",
        "summary": "Наш главный механик поделился секретами правильной чистки и смазки цепи в домашних условиях."
    }
];

async function loadNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    try {
        const response = await fetch('get_news.php');
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        renderNewsCards(data, grid);
    } catch (error) {
        console.warn('Не удалось загрузить новости из БД, используем запасные данные:', error);
        renderNewsCards(fallbackNews, grid);
    }
}

function renderNewsCards(data, grid) {
    grid.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <span class="news-date">${item.date}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a href="#" class="card-link" onclick="alert('Чтение статьи: ${item.title}'); return false;">Читать полностью →</a>
        `;
        grid.appendChild(card);
    });
}


// --- ОБРАБОТКА ФОРМЫ КОНТАКТОВ (ОТПРАВКА В БД) ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById('name') ? document.getElementById('name').value : '';
        const phoneVal = document.getElementById('phone') ? document.getElementById('phone').value : '';
        const messageVal = document.getElementById('message') ? document.getElementById('message').value : '';

        try {
            const response = await fetch('send_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    phone: phoneVal,
                    message: messageVal
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Спасибо, ${nameVal}! ${result.message}`);
                form.reset();
            } else {
                alert(`Ошибка: ${result.message}`);
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            alert('Не удалось отправить заявку. Проверьте соединение с сервером.');
        }
    });
}


// --- ЛОГИКА МОДАЛЬНОГО ОКНА БЫСТРОГО ЗАКАЗА ---
let selectedProductTitle = '';

function openOrderModal(productTitle) {
    selectedProductTitle = productTitle;
    const modal = document.getElementById('order-modal');
    const titleElem = document.getElementById('modal-product-title');
    
    if (modal && titleElem) {
        titleElem.textContent = productTitle;
        modal.classList.add('active');
    }
}

// Закрытие модального окна и обработка формы
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('order-modal');
    const closeBtn = document.getElementById('modal-close');
    const orderForm = document.getElementById('modal-order-form');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Закрытие при клике мимо окна
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('modal-name').value;
            const phoneVal = document.getElementById('modal-phone').value;
            const messageVal = `Заказ товара: ${selectedProductTitle}`;

            try {
                const response = await fetch('send_request.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: nameVal,
                        phone: phoneVal,
                        message: messageVal
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert(`Спасибо, ${nameVal}! Заявка на "${selectedProductTitle}" принята.`);
                    orderForm.reset();
                    modal.classList.remove('active');
                } else {
                    alert(`Ошибка: ${result.message}`);
                }
            } catch (error) {
                console.error('Ошибка отправки заказа:', error);
                alert('Не удалось отправить заказ. Проверьте соединение с сервером.');
            }
        });
    }
});