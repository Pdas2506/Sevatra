// AmbiSevatra Chatbot Popup - Reusable Module
let chatbotData = null;
let chatHistory = [];

// Load chatbot responses
async function loadChatbotData() {
    try {
        const response = await fetch('chatbot_responses.json');
        chatbotData = await response.json();
        initializeChatbot();
    } catch (error) {
        console.error('Failed to load chatbot data:', error);
        chatbotData = {
            greetings: ["Hello! How can I help you today?"],
            fallback: ["I'm having trouble understanding. Please try rephrasing your question."],
            quick_actions: []
        };
        initializeChatbot();
    }
}

function initializeChatbot() {
    // Add welcome message
    const welcomeMsg = chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)];
    addBotMessage(welcomeMsg);

    // Load quick actions
    loadQuickActions();
}

function loadQuickActions() {
    const container = document.getElementById('quickActionButtons');
    if (!chatbotData.quick_actions || !container) return;

    container.innerHTML = chatbotData.quick_actions.slice(0, 6).map(action => `
        <button onclick="handleQuickAction('${action.action}', '${action.url || ''}', '${action.message || ''}')" 
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary-blue hover:text-white dark:hover:bg-primary-blue text-text-dark dark:text-white rounded-lg text-xs font-semibold transition-all">
            ${action.label}
        </button>
    `).join('');
}

function handleQuickAction(action, url, message) {
    if (action === 'redirect' && url) {
        window.location.href = url;
    } else if (action === 'message' && message) {
        document.getElementById('chatInput').value = message;
        sendMessage();
    }
}

function openChatbot() {
    const popup = document.getElementById('chatbotPopup');
    const container = document.getElementById('chatbotContainer');
    if (!popup || !container) return;

    popup.classList.remove('pointer-events-none');
    setTimeout(() => {
        container.classList.remove('translate-y-full', 'sm:translate-x-full');
    }, 10);

    // Load chatbot data if not already loaded
    if (!chatbotData) {
        loadChatbotData();
    }
}

function closeChatbot() {
    const popup = document.getElementById('chatbotPopup');
    const container = document.getElementById('chatbotContainer');
    if (!popup || !container) return;

    container.classList.add('translate-y-full', 'sm:translate-x-full');
    setTimeout(() => {
        popup.classList.add('pointer-events-none');
    }, 300);
}

function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-2 items-start';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-white text-sm">smart_toy</span>
        </div>
        <div class="flex-1 bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none p-3 shadow-sm">
            <p class="text-sm text-text-dark dark:text-white whitespace-pre-line">${message}</p>
            <p class="text-[10px] text-gray-400 mt-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-2 items-start justify-end';
    messageDiv.innerHTML = `
        <div class="flex-1 bg-primary-blue rounded-2xl rounded-tr-none p-3 shadow-sm max-w-[80%] ml-auto">
            <p class="text-sm text-white">${message}</p>
            <p class="text-[10px] text-white/70 mt-1 text-right">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(userMessage) {
    if (!chatbotData || !chatbotData.keywords) {
        return chatbotData?.fallback[0] || "I'm having trouble right now. Please try again.";
    }

    const message = userMessage.toLowerCase();

    // Check for keyword matches
    for (const [key, data] of Object.entries(chatbotData.keywords)) {
        if (data.patterns && data.patterns.some(pattern => message.includes(pattern.toLowerCase()))) {
            const responses = data.responses || [];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Fallback response
    return chatbotData.fallback[Math.floor(Math.random() * chatbotData.fallback.length)];
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addUserMessage(message);
    input.value = '';

    // Simulate typing delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addBotMessage(response);
    }, 500);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chatbot HTML structure if not present
function initChatbotHTML() {
    if (document.getElementById('chatbotPopup')) return; // Already exists

    const chatbotHTML = `
    <!-- Chatbot Popup -->
    <div id="chatbotPopup" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 pointer-events-none">
        <div id="chatbotContainer" class="pointer-events-auto bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-96 h-[85vh] sm:h-[600px] flex flex-col transform translate-y-full sm:translate-y-0 sm:translate-x-full transition-transform duration-300 ease-out">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary-blue to-blue-600 text-white p-4 sm:p-5 rounded-t-3xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined">support_agent</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">AmbiSevatra Support</h3>
                        <p class="text-xs opacity-90">
                            <span class="inline-flex items-center gap-1">
                                <span class="w-2 h-2 bg-success-green rounded-full animate-pulse"></span>
                                Online - We're here to help
                            </span>
                        </p>
                    </div>
                </div>
                <button onclick="closeChatbot()" class="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <!-- Messages Container -->
            <div id="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                <!-- Welcome message will be inserted here -->
            </div>

            <!-- Quick Actions -->
            <div id="quickActions" class="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p class="text-xs text-text-gray dark:text-gray-400 mb-2 font-semibold">Quick Actions:</p>
                <div class="grid grid-cols-2 gap-2" id="quickActionButtons">
                    <!-- Quick action buttons will be inserted here -->
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="chatInput" 
                        placeholder="Type your message..."
                        class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue dark:bg-gray-800 dark:text-white text-sm"
                        onkeypress="handleChatKeyPress(event)"
                    />
                    <button 
                        onclick="sendMessage()" 
                        class="px-4 py-3 bg-primary-blue text-white rounded-xl hover:bg-blue-600 transition-all">
                        <span class="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotHTML);
} else {
    initChatbotHTML();
}
