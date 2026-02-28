// AmbiSevatra - Single Page Application Logic
// State management and navigation

let currentScreen = 'homeScreen';
let sosCountdownTimer = null;
let sosCountdown = 10;

// Navigation function
function navigateTo(screenId) {
    // Hide current screen
    const currentEl = document.getElementById(currentScreen);
    if (currentEl) {
        currentEl.classList.remove('active');
    }

    // Show new screen
    const newEl = document.getElementById(screenId);
    if (newEl) {
        newEl.classList.add('active');
        currentScreen = screenId;

        // Initialize maps when navigating to specific screens
        if (screenId === 'bookingScreen') {
            setTimeout(() => initializeBookingMap(), 100);
        } else if (screenId === 'confirmScreen') {
            setTimeout(() => initializeTrackingMap(), 100);
        } else if (screenId === 'sosScreen') {
            startSOSCountdown();
        } else if (sosCountdownTimer) {
            clearInterval(sosCountdownTimer);
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// SOS Countdown Logic
function startSOSCountdown() {
    sosCountdown = 10;
    const countdownEl = document.getElementById('sosCountdown');
    const progressRing = document.getElementById('sosProgressRing');
    const circumference = 2 * Math.PI * 100;

    // Update progress ring
    const updateProgress = (timeLeft) => {
        const offset = circumference - (timeLeft / 10) * circumference;
        progressRing.style.strokeDashoffset = offset;
    };

    // Initialize
    updateProgress(10);

    // Start countdown
    sosCountdownTimer = setInterval(() => {
        sosCountdown--;
        countdownEl.textContent = sosCountdown;
        updateProgress(sosCountdown);

        if (sosCountdown <= 0) {
            clearInterval(sosCountdownTimer);
            navigateTo('sosConfirmScreen');
        }
    }, 1000);
}

// Cancel SOS
document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancelSOS');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel the SOS alert?')) {
                clearInterval(sosCountdownTimer);
                navigateTo('homeScreen');
            }
        });
    }
});

// Chatbot Logic
let isChatOpen = false;
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatBadge = document.getElementById('chatBadge');

function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('chat-hidden');
        chatWindow.classList.add('chat-visible');
        chatBadge.style.display = 'none';
        messageInput.focus();
    } else {
        chatWindow.classList.remove('chat-visible');
        chatWindow.classList.add('chat-hidden');
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

// Add user message to chat
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-end gap-2 justify-end';
    messageDiv.innerHTML = `
        <div class="flex flex-col gap-1 items-end">
            <div class="max-w-[260px] rounded-2xl rounded-br-sm px-4 py-3 bg-primary-blue text-white shadow-sm">
                <p class="text-sm">${escapeHtml(text)}</p>
            </div>
            <p class="text-xs text-text-gray px-2">Just now</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Add bot message to chat
function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-end gap-2';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0 shadow">
            <span class="material-symbols-outlined text-white text-lg">smart_toy</span>
        </div>
        <div class="flex flex-col gap-1">
            <div class="max-w-[260px] rounded-2xl rounded-bl-sm px-4 py-3 bg-white dark:bg-gray-700 shadow-sm">
                <p class="text-sm text-text-dark dark:text-white">${text}</p>
            </div>
            <p class="text-xs text-text-gray px-2">Just now</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Chatbot response logic
function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    if (msg.includes('book') || msg.includes('ambulance') || msg.includes('transport')) {
        setTimeout(() => navigateTo('bookingScreen'), 1000);
        return '🚑 <b>Perfect!</b> I\'ll take you to the booking form where you can provide your details.';
    } else if (msg.includes('emergency') || msg.includes('sos') || msg.includes('urgent')) {
        return '🚨 <b>Emergency Assistance</b><br><br>For immediate help:<br>• Press the <span class="font-bold text-emergency-red">SOS button</span> on home page<br>• Or call emergency: <a href="tel:102" class="text-primary-blue font-bold">102</a>';
    } else if (msg.includes('status') || msg.includes('track') || msg.includes('where')) {
        return '📍 <b>Track Your Ambulance</b><br><br>Your ambulance is en route!<br>• ETA: 8 minutes<br>• Driver: Rajesh Kumar<br>• Vehicle: DL-01-AB-1234';
    } else if (msg.includes('help') || msg.includes('assist') || msg.includes('info')) {
        return 'ℹ️ <b>How Can I Help?</b><br><br>I can assist with:<br>• <b>Booking an ambulance</b><br>• <b>Emergency assistance</b><br>• <b>Tracking your booking</b><br>• <b>Pricing information</b><br><br>What would you like to do?';
    } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return '👋 <b>Hello there!</b> Welcome to AmbiSevatra! How can I assist you today?';
    } else if (msg.includes('thank')) {
        return '😊 <b>You\'re very welcome!</b> Stay safe and healthy! Anything else I can help with?';
    } else if (msg.includes('cancel')) {
        return 'To cancel a booking, please contact our 24/7 support team at <b>1-800-AMBISEVATRA</b> or <a href="tel:102" class="text-primary-blue font-bold">102</a>.';
    } else if (msg.includes('cost') || msg.includes('price') || msg.includes('fee')) {
        return '💰 <b>Pricing Information</b><br><br>• <b>Basic Ambulance:</b> ₹500-800<br>• <b>AC Ambulance:</b> ₹800-1200<br>• <b>ICU Ambulance:</b> ₹1500-2500<br><br><i>Prices vary by distance. No hidden charges!</i>';
    } else if (msg.includes('time') || msg.includes('fast') || msg.includes('quick')) {
        return '⚡ <b>Response Time</b><br><br>• <b>Booking:</b> Under 2 minutes<br>• <b>Dispatch:</b> Instant<br>• <b>Arrival:</b> 5-10 minutes avg<br><br><i>Emergency SOS gets priority!</i>';
    } else {
        return '🤔 <b>I\'m here to help!</b><br><br>Try asking about:<br>• <b>Booking an ambulance</b><br>• <b>Emergency help</b><br>• <b>Tracking</b><br>• <b>Pricing</b><br><br>What do you need?';
    }
}

// Handle chat form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        addUserMessage(message);
        messageInput.value = '';

        // Simulate bot typing delay
        setTimeout(() => {
            const response = getBotResponse(message);
            addBotMessage(response);
        }, 500);
    }
});

// Utility functions
function scrollChatToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Prevent accidental page leave during SOS
window.addEventListener('beforeunload', (e) => {
    if (currentScreen === 'sosScreen' && sosCountdown > 0) {
        e.preventDefault();
        e.returnValue = 'SOS is active. Are you sure you want to leave?';
    }
});

// Map initialization
let homeMap = null;
let bookingMap = null;
let trackingMap = null;

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize home page map
    initializeHomeMap();

    // Quick reply buttons for chatbot
    const quickReplies = document.querySelectorAll('.quick-reply');
    quickReplies.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.textContent.trim();
            messageInput.value = text.replace(/[^\w\s]/g, '');
            chatForm.dispatchEvent(new Event('submit'));
        });
    });
});

function initializeHomeMap() {
    if (document.getElementById('homeMap') && !homeMap) {
        homeMap = L.map('homeMap', {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            doubleClickZoom: false
        }).setView([28.6139, 77.2090], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(homeMap);

        // Add ambulance markers
        const ambulanceIcon = L.divIcon({
            className: 'custom-icon',
            html: '<div style="background: linear-gradient(135deg, #E63946, #DC2626); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-center; box-shadow: 0 4px 12px rgba(230, 57, 70, 0.5); border: 3px solid white;"><span style="color: white; font-size: 24px; line-height: 1;" class="material-symbols-outlined">ambulance</span></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add multiple ambulance markers
        const locations = [
            [28.6139, 77.2090],
            [28.5355, 77.3910],
            [28.7041, 77.1025],
            [28.4595, 77.0266],
            [28.6692, 77.4538]
        ];

        locations.forEach(loc => {
            L.marker(loc, { icon: ambulanceIcon }).addTo(homeMap);
        });
    }
}

function initializeBookingMap() {
    if (document.getElementById('bookingMap') && !bookingMap) {
        bookingMap = L.map('bookingMap').setView([28.6139, 77.2090], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(bookingMap);

        const pickupIcon = L.divIcon({
            className: 'custom-icon',
            html: '<div style="background: linear-gradient(135deg, #2ECC71, #27AE60); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(46, 204, 113, 0.5); border: 3px solid white;"><span style="color: white; font-size: 24px;" class="material-symbols-outlined">location_on</span></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        L.marker([28.6139, 77.2090], { icon: pickupIcon })
            .addTo(bookingMap)
            .bindPopup('<div class="text-center p-2"><p class="font-bold">Pickup Location</p></div>');
    }
}

function initializeTrackingMap() {
    if (document.getElementById('trackingMap') && !trackingMap) {
        trackingMap = L.map('trackingMap').setView([28.6139, 77.2090], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(trackingMap);

        const ambulanceIcon = L.divIcon({
            className: 'custom-icon',
            html: '<div style="background: linear-gradient(135deg, #E63946, #DC2626); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(230, 57, 70, 0.4); border: 3px solid white;"><span style="color: white; font-size: 28px;" class="material-symbols-outlined">ambulance</span></div>',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
        });

        const destinationIcon = L.divIcon({
            className: 'custom-icon',
            html: '<div style="background: linear-gradient(135deg, #2ECC71, #27AE60); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4); border: 3px solid white;"><span style="color: white; font-size: 24px;" class="material-symbols-outlined">location_on</span></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const ambulanceLat = 28.5355;
        const ambulanceLng = 77.3910;
        const ambulanceMarker = L.marker([ambulanceLat, ambulanceLng], { icon: ambulanceIcon })
            .addTo(trackingMap)
            .bindPopup('<div class="text-center p-2"><p class="font-bold text-emergency-red">Ambulance</p><p class="text-xs">DL-01-AB-1234</p></div>');

        const destinationLat = 28.6139;
        const destinationLng = 77.2090;
        L.marker([destinationLat, destinationLng], { icon: destinationIcon })
            .addTo(trackingMap)
            .bindPopup('<div class="text-center p-2"><p class="font-bold text-success-green">Your Location</p></div>');

        const routeLine = L.polyline([
            [ambulanceLat, ambulanceLng],
            [destinationLat, destinationLng]
        ], {
            color: '#007BFF',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(trackingMap);

        const bounds = L.latLngBounds([
            [ambulanceLat, ambulanceLng],
            [destinationLat, destinationLng]
        ]);
        trackingMap.fitBounds(bounds, { padding: [50, 50] });

        // Simulate ambulance movement
        let step = 0;
        const totalSteps = 100;
        setInterval(() => {
            if (step < totalSteps) {
                step++;
                const ratio = step / totalSteps;
                const newLat = ambulanceLat + (destinationLat - ambulanceLat) * ratio;
                const newLng = ambulanceLng + (destinationLng - ambulanceLng) * ratio;
                ambulanceMarker.setLatLng([newLat, newLng]);

                routeLine.setLatLngs([
                    [newLat, newLng],
                    [destinationLat, destinationLng]
                ]);
            }
        }, 500);
    }
}

// Initialize app
console.log('AmbiSevatra SPA loaded successfully');
console.log('Current screen:', currentScreen);
