// Данные сайта
let siteData = {
    name: "Название сайта",
    description: "Описание сайта",
    logo: "",
    primaryColor: "#3498db",
    fontFamily: "Arial, sans-serif",
    template: "school"
};

// Массив новостей
let news = [];
let editingNewsIndex = -1;

// Элементы DOM
const constructorTabs = document.querySelectorAll('.constructor-tab');
const constructorContents = document.querySelectorAll('.constructor-content');
const newsModal = document.getElementById('newsModal');
const previewModal = document.getElementById('previewModal');
const newsList = document.getElementById('newsList');
const previewNewsList = document.getElementById('previewNewsList');
const addNewsBtn = document.getElementById('addNewsBtn');
const saveNewsBtn = document.getElementById('saveNewsBtn');
const cancelNewsBtn = document.getElementById('cancelNewsBtn');
const saveSiteBtn = document.getElementById('saveSiteBtn');
const previewBtn = document.getElementById('previewBtn');
const publishBtn = document.getElementById('publishBtn');
const closeModalBtns = document.querySelectorAll('.close-modal');
const selectTemplateBtns = document.querySelectorAll('.select-template');

// Переключение вкладок конструктора
constructorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Убираем активный класс у всех вкладок и контента
        constructorTabs.forEach(t => t.classList.remove('active'));
        constructorContents.forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс текущей вкладке и контенту
        tab.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Открытие модального окна для добавления новости
addNewsBtn.addEventListener('click', () => {
    editingNewsIndex = -1;
    document.getElementById('modalTitle').textContent = 'Добавить новость';
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    newsModal.style.display = 'flex';
});

// Сохранение новости
saveNewsBtn.addEventListener('click', () => {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const image = document.getElementById('newsImage').value;
    
    if (!title || !content) {
        alert('Заполните заголовок и текст новости');
        return;
    }
    
    const newsItem = {
        title,
        content,
        image,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    if (editingNewsIndex === -1) {
        // Добавляем новую новость
        news.push(newsItem);
    } else {
        // Редактируем существующую новость
        news[editingNewsIndex] = newsItem;
    }
    
    updateNewsList();
    newsModal.style.display = 'none';
});

// Отмена редактирования новости
cancelNewsBtn.addEventListener('click', () => {
    newsModal.style.display = 'none';
});

// Закрытие модальных окон
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        newsModal.style.display = 'none';
        previewModal.style.display = 'none';
    });
});

// Сохранение настроек сайта
saveSiteBtn.addEventListener('click', () => {
    siteData.name = document.getElementById('siteName').value || siteData.name;
    siteData.description = document.getElementById('siteDescription').value || siteData.description;
    siteData.logo = document.getElementById('siteLogo').value;
    siteData.primaryColor = document.getElementById('primaryColor').value;
    siteData.fontFamily = document.getElementById('fontFamily').value;
    
    alert('Настройки сайта сохранены!');
});

// Предпросмотр сайта
previewBtn.addEventListener('click', () => {
    updatePreview();
    previewModal.style.display = 'flex';
});

// Публикация сайта
publishBtn.addEventListener('click', () => {
    alert('Сайт успешно опубликован! Теперь он доступен по адресу: ' + generateSiteUrl());
});

// Выбор шаблона
selectTemplateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        siteData.template = btn.getAttribute('data-template');
        alert(`Шаблон "${btn.parentElement.querySelector('h3').textContent}" выбран!`);
    });
});

// Обновление списка новостей
function updateNewsList() {
    newsList.innerHTML = '';
    
    if (news.length === 0) {
        newsList.innerHTML = '<div class="empty-state">Новостей пока нет. Добавьте первую!</div>';
        return;
    }
    
    news.forEach((item, index) => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <h3>${item.title}</h3>
            <div class="news-meta">Опубликовано: ${item.date}</div>
            <div class="news-content">${item.content.substring(0, 100)}...</div>
            <div class="actions">
                <button class="btn edit-news" data-index="${index}">Редактировать</button>
                <button class="btn btn-secondary delete-news" data-index="${index}">Удалить</button>
            </div>
        `;
        newsList.appendChild(newsElement);
    });
    
    // Добавляем обработчики для кнопок редактирования и удаления
    document.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            editNews(index);
        });
    });
    
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteNews(index);
        });
    });
}

// Редактирование новости
function editNews(index) {
    editingNewsIndex = index;
    const newsItem = news[index];
    
    document.getElementById('modalTitle').textContent = 'Редактировать новость';
    document.getElementById('newsTitle').value = newsItem.title;
    document.getElementById('newsContent').value = newsItem.content;
    document.getElementById('newsImage').value = newsItem.image;
    
    newsModal.style.display = 'flex';
}

// Удаление новости
function deleteNews(index) {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        news.splice(index, 1);
        updateNewsList();
    }
}

// Обновление предпросмотра
function updatePreview() {
    document.getElementById('previewSiteTitle').textContent = siteData.name || 'Название сайта';
    document.getElementById('previewSiteDescription').textContent = siteData.description || 'Описание сайта';
    
    // Применяем настройки дизайна
    const previewArea = document.getElementById('sitePreview');
    previewArea.style.fontFamily = siteData.fontFamily;
    
    const siteHeader = previewArea.querySelector('.site-header');
    siteHeader.style.backgroundColor = siteData.primaryColor;
    
    // Обновляем список новостей в предпросмотре
    previewNewsList.innerHTML = '';
    
    if (news.length === 0) {
        previewNewsList.innerHTML = '<div class="empty-state">Новостей пока нет</div>';
        return;
    }
    
    news.forEach(item => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            ${item.image ? `<div class="news-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;">${!item.image.startsWith('http') ? 'Изображение' : ''}</div>` : ''}
            <h3>${item.title}</h3>
            <div class="news-meta">Опубликовано: ${item.date}</div>
            <div class="news-content">${item.content}</div>
        `;
        previewNewsList.appendChild(newsElement);
    });
}

// Генерация URL для сайта
function generateSiteUrl() {
    const name = siteData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://${name}.newsconstructor.ru`;
}

// Закрытие модальных окон по клику вне области
window.addEventListener('click', (e) => {
    if (e.target === newsModal) {
        newsModal.style.display = 'none';
    }
    if (e.target === previewModal) {
        previewModal.style.display = 'none';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateNewsList();
    
    // Заполняем поля настроек сайта
    document.getElementById('siteName').value = siteData.name;
    document.getElementById('siteDescription').value = siteData.description;
    document.getElementById('siteLogo').value = siteData.logo;
    document.getElementById('primaryColor').value = siteData.primaryColor;
    document.getElementById('fontFamily').value = siteData.fontFamily;
});