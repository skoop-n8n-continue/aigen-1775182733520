/**
 * Hotel In-Room Display - Data Binding and Logic
 */

// Fetch and parse data.json
async function loadAppData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load app data:', error);
        return null;
    }
}

/**
 * Initialize the application
 */
async function init() {
    const data = await loadAppData();
    if (!data) return;

    // 1. Apply Styles from App Settings
    const settings = data.sections.app_settings;
    const storefront = data.sections.storefront;

    document.documentElement.style.setProperty('--primary-color', settings.primary_color.value);
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color.value);
    document.documentElement.style.setProperty('--text-color', settings.text_color.value);
    document.documentElement.style.setProperty('--bg-image', `url('${storefront.background_image.value}')`);

    // 2. Map Branding and Storefront
    document.getElementById('hotel-name').textContent = storefront.hotel_name.value;
    document.getElementById('hotel-logo').src = storefront.hotel_logo.value;
    document.getElementById('welcome-msg').textContent = `Welcome, ${storefront.guest_name.value}`;

    // 3. Map Weather
    const weather = data.sections.weather;
    document.getElementById('weather-temp').textContent = `${weather.temperature.value}°`;
    document.getElementById('weather-condition').textContent = weather.condition.value;
    document.getElementById('weather-location').textContent = weather.location.value;

    // 4. Update Time and Date
    updateTime();
    setInterval(updateTime, 1000 * 60); // Update every minute

    // 5. Render Collections
    renderTVGuide(data.sections.tv_guide.value);
    renderRoomService(data.sections.room_service.value);
    renderRestaurants(data.sections.restaurants.value);
    renderAttractions(data.sections.attractions.value);

    // 6. Reveal the app
    setTimeout(() => {
        document.getElementById('app-container').classList.add('loaded');
    }, 100);
}

/**
 * Update current time and date
 */
function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateStr = now.toLocaleDateString('en-US', options).replace(',', ' |');
    document.getElementById('current-date-time').textContent = dateStr;
}

/**
 * Render TV Guide highlights
 */
function renderTVGuide(tvChannels) {
    const list = document.getElementById('tv-list');
    list.innerHTML = '';

    tvChannels.slice(0, 3).forEach(channel => {
        const item = document.createElement('div');
        item.className = 'tv-item';
        item.innerHTML = `
            <div class="channel">${channel.channel}</div>
            <div class="show">${channel.show}</div>
            <div class="time">${channel.time}</div>
        `;
        list.appendChild(item);
    });
}

/**
 * Render Room Service highlights
 */
function renderRoomService(menuItems) {
    const list = document.getElementById('menu-list');
    list.innerHTML = '';

    menuItems.slice(0, 2).forEach(menuItem => {
        const item = document.createElement('div');
        item.className = 'menu-item';
        item.innerHTML = `
            <img src="${menuItem.image}" alt="${menuItem.item_name}">
            <div class="menu-info">
                <h4>${menuItem.item_name}</h4>
                <div class="price">$${menuItem.price.toFixed(2)}</div>
            </div>
        `;
        list.appendChild(item);
    });
}

/**
 * Render Restaurants nearby
 */
function renderRestaurants(restaurants) {
    const list = document.getElementById('restaurant-list');
    list.innerHTML = '';

    restaurants.forEach(rest => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="rating">★ ${rest.rating}</span>
            <img src="${rest.image}" alt="${rest.name}">
            <div class="card-content">
                <h4>${rest.name}</h4>
                <p>${rest.cuisine}</p>
            </div>
        `;
        list.appendChild(card);
    });
}

/**
 * Render Local Attractions
 */
function renderAttractions(attractions) {
    const list = document.getElementById('attraction-list');
    list.innerHTML = '';

    attractions.forEach(attr => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="distance">${attr.distance}</span>
            <img src="${attr.image}" alt="${attr.name}">
            <div class="card-content">
                <h4>${attr.name}</h4>
                <p>Local Attraction</p>
            </div>
        `;
        list.appendChild(card);
    });
}

// Kick off initialization
init();
